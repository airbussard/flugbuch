import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { icaoCodes } = await request.json()
    
    if (!icaoCodes || !Array.isArray(icaoCodes) || icaoCodes.length === 0) {
      return NextResponse.json(
        { error: 'ICAO codes array is required' },
        { status: 400 }
      )
    }
    
    // Limit to 50 airports to prevent abuse
    const codes = icaoCodes.slice(0, 50).join(',')
    
    const response = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${codes}&format=json`,
      {
        headers: {
          'User-Agent': 'Log-K-Pilot-Logbook/1.0',
        },
        // Cache for 10 minutes
        next: { revalidate: 600 }
      }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch METAR data' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // Process the data to extract flight categories
    const processed = data.map((metar: any) => ({
      icao: metar.icaoId,
      flightCategory: metar.flightCategory || 'UNKNOWN',
      rawText: metar.rawOb,
      windSpeed: metar.wspd,
      visibility: metar.visib,
      ceiling: metar.cldCvg1,
      temperature: metar.tempC,
      dewpoint: metar.dewpC,
      altimeter: metar.altim,
      observationTime: metar.obsTime
    }))
    
    return NextResponse.json(processed)
  } catch (error) {
    console.error('Error fetching batch METAR:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}