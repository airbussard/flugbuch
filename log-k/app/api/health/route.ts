import { NextResponse } from 'next/server'

export async function GET() {
  // Simple health check that always returns OK
  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}