import { NextRequest, NextResponse } from 'next/server'

// Calculate flight category based on visibility and ceiling
function calculateFlightCategory(metar: any): string {
  // Parse visibility
  let visibilitySM = 10 // Default to 10+ statute miles
  if (typeof metar.visib === 'string') {
    if (metar.visib.includes('+')) {
      visibilitySM = 10
    } else {
      const parsed = parseFloat(metar.visib)
      if (!isNaN(parsed)) {
        visibilitySM = parsed
      }
    }
  } else if (typeof metar.visib === 'number') {
    visibilitySM = metar.visib
  }
  
  // Find lowest cloud ceiling
  let ceilingFt = 999999 // Default to unlimited ceiling
  if (metar.clouds && Array.isArray(metar.clouds)) {
    for (const cloud of metar.clouds) {
      // Check for ceiling layers (BKN, OVC)
      if (cloud.cover === 'BKN' || cloud.cover === 'OVC') {
        if (cloud.base && cloud.base < ceilingFt) {
          ceilingFt = cloud.base
        }
      }
    }
  }
  
  // CAVOK means ceiling and visibility OK (VFR)
  if (metar.clouds?.[0]?.cover === 'CAVOK') {
    return 'VFR'
  }
  
  // Determine flight category based on standard rules
  // LIFR: Visibility < 1 SM OR Ceiling < 500 ft
  if (visibilitySM < 1 || ceilingFt < 500) {
    return 'LIFR'
  }
  // IFR: Visibility 1-3 SM OR Ceiling 500-1000 ft
  if (visibilitySM < 3 || ceilingFt < 1000) {
    return 'IFR'
  }
  // MVFR: Visibility 3-5 SM OR Ceiling 1000-3000 ft
  if (visibilitySM < 5 || ceilingFt < 3000) {
    return 'MVFR'
  }
  // VFR: Visibility >= 5 SM AND Ceiling >= 3000 ft
  return 'VFR'
}

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
      flightCategory: calculateFlightCategory(metar),
      rawText: metar.rawOb,
      windSpeed: metar.wspd,
      visibility: metar.visib,
      temperature: metar.temp,  // Changed from tempC
      dewpoint: metar.dewp,      // Changed from dewpC
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