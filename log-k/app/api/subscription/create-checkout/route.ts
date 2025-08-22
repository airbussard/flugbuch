import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Stripe will be implemented later
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// })

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

    // For now, return a message that Stripe is coming soon
    // In production, this would create a Stripe checkout session
    
    /* Future Stripe implementation:
    const priceId = tier === 'basic' 
      ? process.env.STRIPE_BASIC_PRICE_ID 
      : process.env.STRIPE_PRO_PRICE_ID

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: returnUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier: tier
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier: tier
        }
      }
    })

    return NextResponse.json({ url: session.url })
    */

    // Temporary response
    return NextResponse.json({ 
      url: null,
      message: 'Stripe integration coming soon. Please use the iOS app to subscribe for now.'
    })
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}