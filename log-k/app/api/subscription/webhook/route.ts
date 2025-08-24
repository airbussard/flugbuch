import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncStripeSubscription, cancelSubscription } from '@/lib/subscription/service.server'
import Stripe from 'stripe'

// Add immediate logging
console.log('[WEBHOOK] Route file loaded at:', new Date().toISOString())

export async function POST(request: NextRequest) {
  // Log immediately when function is called
  console.log('=== STRIPE WEBHOOK POST REQUEST RECEIVED ===')
  console.log('Timestamp:', new Date().toISOString())
  console.log('URL:', request.url)
  console.log('Method:', request.method)
  
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
      console.log('Stripe webhook not configured')
      console.log('STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY)
      console.log('STRIPE_WEBHOOK_SECRET present:', !!webhookSecret)
      return NextResponse.json({ received: true })
    }

    // Check Supabase service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured - cannot update database!')
      return NextResponse.json({ 
        error: 'Database configuration missing' 
      }, { status: 500 })
    }

    // Initialize Stripe at runtime
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified')
      console.log('Event type:', event.type)
      console.log('Event ID:', event.id)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      console.error('Signature received:', signature?.substring(0, 20) + '...')
      console.error('Webhook secret starts with:', webhookSecret?.substring(0, 10))
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout.session.completed')
        console.log('Session ID:', session.id)
        console.log('Payment status:', session.payment_status)
        console.log('Metadata:', session.metadata)
        
        if (session.payment_status === 'paid' && session.subscription) {
          const userId = session.metadata?.userId
          const tier = session.metadata?.tier as 'basic' | 'pro'
          
          console.log('User ID from metadata:', userId)
          console.log('Tier from metadata:', tier)
          
          if (userId && tier) {
            try {
              // Get subscription details
              const subscriptionId = session.subscription as string
              console.log('Retrieving subscription:', subscriptionId)
              
              const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId) as any
              console.log('Subscription data received:', {
                id: subscriptionData.id,
                status: subscriptionData.status,
                current_period_end: subscriptionData.current_period_end,
                current_period_start: subscriptionData.current_period_start,
              })
              
              // Safely extract period end with fallback
              let validUntil: Date
              if (subscriptionData.current_period_end) {
                validUntil = new Date(subscriptionData.current_period_end * 1000)
              } else {
                // Fallback: 1 year from now for yearly subscriptions
                console.warn('No current_period_end found, using fallback (1 year from now)')
                validUntil = new Date()
                validUntil.setFullYear(validUntil.getFullYear() + 1)
              }
              
              console.log(`Valid until calculated: ${validUntil.toISOString()}`)
              
              await syncStripeSubscription(
                userId,
                session.customer as string,
                subscriptionData.id,
                tier,
                validUntil
              )
              
              console.log(`✅ Subscription created for user ${userId}: ${tier} until ${validUntil.toISOString()}`)
            } catch (subError) {
              console.error('Error processing subscription:', subError)
              throw subError
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        const tier = subscription.metadata?.tier as 'basic' | 'pro'
        
        console.log('Processing customer.subscription.updated')
        console.log('User ID:', userId, 'Tier:', tier)
        
        if (userId && tier) {
          let validUntil: Date
          if (subscription.current_period_end) {
            validUntil = new Date(subscription.current_period_end * 1000)
          } else {
            console.warn('No current_period_end in subscription update, using fallback')
            validUntil = new Date()
            validUntil.setFullYear(validUntil.getFullYear() + 1)
          }
          
          await syncStripeSubscription(
            userId,
            subscription.customer as string,
            subscription.id,
            tier,
            validUntil
          )
          
          console.log(`✅ Subscription updated for user ${userId}: ${tier} until ${validUntil.toISOString()}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        
        if (userId) {
          await cancelSubscription(userId)
          console.log(`Subscription cancelled for user ${userId}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        
        console.log('Processing invoice.payment_succeeded')
        console.log('Subscription ID:', subscriptionId)
        
        if (subscriptionId) {
          const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId) as any
          const userId = subscriptionData.metadata?.userId
          const tier = subscriptionData.metadata?.tier as 'basic' | 'pro'
          
          console.log('User ID:', userId, 'Tier:', tier)
          
          if (userId && tier) {
            let validUntil: Date
            if (subscriptionData.current_period_end) {
              validUntil = new Date(subscriptionData.current_period_end * 1000)
            } else {
              console.warn('No current_period_end in payment succeeded, using fallback')
              validUntil = new Date()
              validUntil.setFullYear(validUntil.getFullYear() + 1)
            }
            
            await syncStripeSubscription(
              userId,
              subscriptionData.customer as string,
              subscriptionData.id,
              tier,
              validUntil
            )
            
            console.log(`✅ Payment succeeded for user ${userId}: ${tier} renewed until ${validUntil.toISOString()}`)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail = (invoice as any).customer_email
        
        // Log failed payment for manual follow-up
        console.error('Payment failed for invoice:', {
          invoiceId: invoice.id,
          customerEmail,
          amountDue: (invoice as any).amount_due,
          currency: (invoice as any).currency
        })
        
        // TODO: Send email notification to customer
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    console.log('=== Webhook processing completed successfully ===')
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('=== WEBHOOK ERROR ===')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Add GET method for testing
export async function GET(request: NextRequest) {
  console.log('Webhook GET request received for testing')
  return NextResponse.json({
    status: 'Webhook endpoint is working',
    timestamp: new Date().toISOString(),
    message: 'This endpoint only accepts POST requests from Stripe',
    testCommand: 'curl -X POST https://log-k.com/api/subscription/webhook -H "Content-Type: application/json" -d \'{"test": true}\''
  })
}

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'