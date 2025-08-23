import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncStripeSubscription, cancelSubscription } from '@/lib/subscription/service.server'
import Stripe from 'stripe'

// Initialize Stripe - only if configured
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !webhookSecret) {
      console.log('Stripe webhook not configured')
      return NextResponse.json({ received: true })
    }

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
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid' && session.subscription) {
          const userId = session.metadata?.userId
          const tier = session.metadata?.tier as 'basic' | 'pro'
          
          if (userId && tier) {
            // Get subscription details
            const subscriptionId = session.subscription as string
            const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
            const subscriptionData = subscriptionResponse as Stripe.Subscription
            
            // Stripe returns the subscription data directly
            const validUntil = new Date((subscriptionData as any).current_period_end * 1000)
            
            await syncStripeSubscription(
              userId,
              session.customer as string,
              subscriptionData.id,
              tier,
              validUntil
            )
            
            console.log(`Subscription created for user ${userId}: ${tier} until ${validUntil}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        const tier = subscription.metadata?.tier as 'basic' | 'pro'
        
        if (userId && tier) {
          const validUntil = new Date((subscription as any).current_period_end * 1000)
          
          await syncStripeSubscription(
            userId,
            subscription.customer as string,
            subscription.id,
            tier,
            validUntil
          )
          
          console.log(`Subscription updated for user ${userId}: ${tier} until ${validUntil}`)
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
        const subscriptionId = (invoice as any).subscription as string
        
        if (subscriptionId) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
          const subscriptionData = subscriptionResponse as Stripe.Subscription
          const userId = subscriptionData.metadata?.userId
          const tier = subscriptionData.metadata?.tier as 'basic' | 'pro'
          
          if (userId && tier) {
            const validUntil = new Date((subscriptionData as any).current_period_end * 1000)
            
            await syncStripeSubscription(
              userId,
              subscriptionData.customer as string,
              subscriptionData.id,
              tier,
              validUntil
            )
            
            console.log(`Payment succeeded for user ${userId}: ${tier} renewed until ${validUntil}`)
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

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'