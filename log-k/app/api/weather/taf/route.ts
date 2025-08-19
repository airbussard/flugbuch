import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const icaoCode = searchParams.get('icao')
  
  if (!icaoCode) {
    return NextResponse.json(
      { error: 'ICAO code is required' },
      { status: 400 }
    )
  }
  
  try {
    const response = await fetch(
      `https://aviationweather.gov/api/data/taf?ids=${icaoCode}&format=json`,
      {
        headers: {
          'User-Agent': 'Log-K-Pilot-Logbook/1.0',
        },
        // Cache for 30 minutes (TAF updates less frequently)
        next: { revalidate: 1800 }
      }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch TAF data' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching TAF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}