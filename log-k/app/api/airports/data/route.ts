import { NextRequest, NextResponse } from 'next/server'
import { airportService } from '@/lib/data/airport-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const icao = searchParams.get('icao')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Load airports using server-side method
    await airportService.loadAirportsFromFile()
    
    // If specific ICAO requested
    if (icao) {
      const airport = await airportService.getAirport(icao.toUpperCase())
      if (airport) {
        return NextResponse.json(airport)
      } else {
        return NextResponse.json(
          { error: 'Airport not found' },
          { status: 404 }
        )
      }
    }
    
    // If search query provided
    if (search) {
      const results = await airportService.searchAirports(search, limit)
      return NextResponse.json(results)
    }
    
    // Return error if no parameters provided
    return NextResponse.json(
      { error: 'Please provide either icao or search parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error loading airport data:', error)
    return NextResponse.json(
      { error: 'Failed to load airport data' },
      { status: 500 }
    )
  }
}