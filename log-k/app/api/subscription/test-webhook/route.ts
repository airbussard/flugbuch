import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check configuration
    const config = {
      stripe: {
        secretKey: !!process.env.STRIPE_SECRET_KEY,
        webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        basicPriceId: process.env.STRIPE_BASIC_PRICE_ID,
        proPriceId: process.env.STRIPE_PRO_PRICE_ID,
      },
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    }

    // Test Supabase connection
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check user_subscriptions table
    let subscriptionStatus = null
    if (user) {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (data) {
        subscriptionStatus = {
          tier: data.subscription_tier,
          status: data.subscription_status,
          validUntil: data.valid_until,
          source: data.subscription_source,
          stripeCustomerId: data.stripe_customer_id ? '✅ Set' : '❌ Not set',
          stripeSubscriptionId: data.stripe_subscription_id ? '✅ Set' : '❌ Not set',
        }
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is ok
        console.error('Error fetching subscription:', error)
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      configuration: config,
      currentUser: user ? {
        id: user.id,
        email: user.email,
      } : 'Not logged in',
      subscription: subscriptionStatus || 'No subscription found',
      webhookUrl: 'https://log-k.com/api/subscription/webhook',
      testCheckoutUrl: 'https://log-k.com/subscription/choose',
      instructions: [
        '1. Make sure all configuration values are ✅',
        '2. If SUPABASE_SERVICE_ROLE_KEY is missing, webhook cannot update database',
        '3. Check Stripe Dashboard > Webhooks for event delivery status',
        '4. Check CapRover logs for webhook processing errors'
      ]
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}