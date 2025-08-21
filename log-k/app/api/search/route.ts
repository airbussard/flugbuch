import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { airportService } from '@/lib/data/airport-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchTerm = query.toLowerCase()
  const results: any[] = []

  try {
    // Search Flights
    const { data: flights } = await supabase
      .from('flights')
      .select('id, flight_date, departure_airport, arrival_airport, registration, flight_number')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .or(`departure_airport.ilike.%${searchTerm}%,arrival_airport.ilike.%${searchTerm}%,registration.ilike.%${searchTerm}%,flight_number.ilike.%${searchTerm}%`)
      .order('flight_date', { ascending: false })
      .limit(10)

    if (flights) {
      flights.forEach(flight => {
        results.push({
          type: 'flight',
          id: flight.id,
          title: `${flight.departure_airport || 'N/A'} → ${flight.arrival_airport || 'N/A'}`,
          subtitle: `${flight.flight_date || ''} • ${flight.registration || ''}`,
          url: `/flights/${flight.id}`
        })
      })
    }

    // Search Aircraft
    const { data: aircraft } = await supabase
      .from('aircrafts')
      .select('id, registration, aircraft_type, serial_number, aircraft_class')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .or(`registration.ilike.%${searchTerm}%,aircraft_type.ilike.%${searchTerm}%,serial_number.ilike.%${searchTerm}%`)
      .order('registration')
      .limit(10)

    if (aircraft) {
      aircraft.forEach(plane => {
        results.push({
          type: 'aircraft',
          id: plane.id,
          title: plane.registration,
          subtitle: `${plane.aircraft_type}${plane.aircraft_class ? ` • ${plane.aircraft_class}` : ''}`,
          url: `/fleet/${plane.id}`
        })
      })
    }

    // Search Crew
    const { data: crew } = await supabase
      .from('crew_members')
      .select('id, name, email, role')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`)
      .order('name')
      .limit(10)

    if (crew) {
      crew.forEach(member => {
        results.push({
          type: 'crew',
          id: member.id,
          title: member.name,
          subtitle: member.role || member.email || '',
          url: `/crew/${member.id}`
        })
      })
    }

    // Search Airports (from CSV data)
    await airportService.loadAirportsFromFile()
    const airports = await airportService.searchAirports(query)
    
    airports.slice(0, 10).forEach(airport => {
      results.push({
        type: 'airport',
        id: airport.icao,
        title: `${airport.icao}${airport.iata ? ` / ${airport.iata}` : ''}`,
        subtitle: `${airport.name} • ${airport.country || ''}`,
        url: `/airports/${airport.icao}`
      })
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}