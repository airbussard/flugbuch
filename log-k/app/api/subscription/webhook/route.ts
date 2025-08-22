import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncStripeSubscription, cancelSubscription } from '@/lib/subscription/service'

// This will be uncommented when Stripe is configured
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// })

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Stripe webhook handling (to be implemented)
    /* 
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
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId
          const tier = session.metadata?.tier as 'basic' | 'premium'
          
          if (userId && tier && session.customer && session.subscription) {
            // Calculate subscription end date (1 year from now)
            const validUntil = new Date()
            validUntil.setFullYear(validUntil.getFullYear() + 1)
            
            await syncStripeSubscription(
              userId,
              session.customer as string,
              session.subscription as string,
              tier,
              validUntil
            )
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        const tier = subscription.metadata?.tier as 'basic' | 'premium'
        
        if (userId && tier) {
          const validUntil = new Date(subscription.current_period_end * 1000)
          
          await syncStripeSubscription(
            userId,
            subscription.customer as string,
            subscription.id,
            tier,
            validUntil
          )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        
        if (userId) {
          await cancelSubscription(userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.userId
          const tier = subscription.metadata?.tier as 'basic' | 'premium'
          
          if (userId && tier) {
            const validUntil = new Date(subscription.current_period_end * 1000)
            
            await syncStripeSubscription(
              userId,
              subscription.customer as string,
              subscription.id,
              tier,
              validUntil
            )
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle failed payment (send email, etc.)
        console.error('Payment failed for invoice:', invoice.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    */

    // For now, just acknowledge the webhook
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Stripe requires raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}