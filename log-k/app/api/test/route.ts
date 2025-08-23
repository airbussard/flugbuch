import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    build: 'v5-WORKING',
    timestamp: new Date().toISOString(),
    message: 'Log-K API is running',
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasStripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasStripeBasicPrice: !!process.env.STRIPE_BASIC_PRICE_ID,
      hasStripeProPrice: !!process.env.STRIPE_PRO_PRICE_ID,
      debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
    }
  })
}