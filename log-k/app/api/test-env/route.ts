import { NextResponse } from 'next/server'

export async function GET() {
  // Check which environment variables are present (without exposing values)
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅ Set (hidden)' : '❌ Not set',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set (hidden)' : '❌ Not set',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set (hidden)' : '❌ Not set',
    STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID ? `✅ ${process.env.STRIPE_BASIC_PRICE_ID}` : '❌ Not set',
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID ? `✅ ${process.env.STRIPE_PRO_PRICE_ID}` : '❌ Not set',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set (hidden)' : '❌ Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set (hidden)' : '❌ Not set',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set (hidden)' : '❌ Not set',
  }

  // Additional debug info
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: envStatus,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'not set',
    message: 'Use this endpoint to verify environment variables are loaded correctly'
  }

  return NextResponse.json(debugInfo, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  })
}