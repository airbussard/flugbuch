import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(request: Request) {
  try {
    const { tier, userId, returnUrl, cancelUrl } = await request.json()
    
    if (!tier || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Verify user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || 
        !process.env.STRIPE_BASIC_PRICE_ID || 
        !process.env.STRIPE_PRO_PRICE_ID) {
      console.log('Stripe not configured - returning placeholder response')
      return NextResponse.json({ 
        url: null,
        message: 'Stripe integration coming soon. Please use the iOS app to subscribe for now.'
      })
    }

    // Get the correct price ID based on tier
    let priceId: string
    if (tier === 'basic') {
      priceId = process.env.STRIPE_BASIC_PRICE_ID
    } else if (tier === 'pro' || tier === 'premium') {
      priceId = process.env.STRIPE_PRO_PRICE_ID
    } else {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: returnUrl || `${request.headers.get('origin')}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/subscription/choose?cancelled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier: tier === 'premium' ? 'pro' : tier, // Map premium to pro for consistency
        source: 'web'
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier: tier === 'premium' ? 'pro' : tier,
          source: 'web'
        }
      },
      // Enable customer portal for managing subscriptions
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    })
    
  } catch (error) {
    console.error('Error creating checkout:', error)
    
    // Check if it's a Stripe configuration error
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Payment service configuration error. Please try again later.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}