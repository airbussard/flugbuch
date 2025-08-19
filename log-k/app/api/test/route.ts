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
      debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
    }
  })
}