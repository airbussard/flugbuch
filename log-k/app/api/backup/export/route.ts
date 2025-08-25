import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // Fetch all user's flights with all fields
    const { data: flights, error: flightsError } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('flight_date', { ascending: false })

    if (flightsError) {
      console.error('Error fetching flights:', flightsError)
      return NextResponse.json(
        { error: 'Failed to fetch flights' },
        { status: 500 }
      )
    }

    // Fetch all user's aircraft
    const { data: aircrafts, error: aircraftsError } = await supabase
      .from('aircrafts')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('registration', { ascending: true })

    if (aircraftsError) {
      console.error('Error fetching aircraft:', aircraftsError)
      return NextResponse.json(
        { error: 'Failed to fetch aircraft' },
        { status: 500 }
      )
    }

    // Fetch all user's crew members
    const { data: crewMembers, error: crewError } = await supabase
      .from('crew_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('name', { ascending: true })

    if (crewError) {
      console.error('Error fetching crew members:', crewError)
      return NextResponse.json(
        { error: 'Failed to fetch crew members' },
        { status: 500 }
      )
    }

    // Fetch all flight roles (crew assignments)
    const { data: flightRoles, error: rolesError } = await supabase
      .from('flight_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)

    if (rolesError) {
      console.error('Error fetching flight roles:', rolesError)
      return NextResponse.json(
        { error: 'Failed to fetch flight roles' },
        { status: 500 }
      )
    }

    // Create backup object
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userEmail: profile?.email || user.email || 'unknown',
      data: {
        flights: flights || [],
        aircrafts: aircrafts || [],
        crew_members: crewMembers || [],
        flight_roles: flightRoles || []
      },
      metadata: {
        flightCount: flights?.length || 0,
        aircraftCount: aircrafts?.length || 0,
        crewCount: crewMembers?.length || 0,
        flightRolesCount: flightRoles?.length || 0,
        totalFlightHours: flights?.reduce((sum, f) => sum + (f.block_time || 0), 0) || 0,
        dateRange: flights && flights.length > 0 ? {
          earliest: flights[flights.length - 1].flight_date,
          latest: flights[0].flight_date
        } : null
      }
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `logk-backup-${timestamp}.json`

    // Return JSON file as download
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('Backup export error:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}

// POST endpoint for filtered export (optional date range, aircraft filter)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get filter options from request
    const body = await request.json()
    const { 
      startDate, 
      endDate, 
      aircraftIds,
      includeFlights = true,
      includeAircraft = true,
      includeCrew = true
    } = body

    // Get user profile for email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    let flights = []
    let aircrafts = []
    let crewMembers = []
    let flightRoles = []

    // Fetch flights with optional filters
    if (includeFlights) {
      let flightsQuery = supabase
        .from('flights')
        .select('*')
        .eq('user_id', user.id)
        .eq('deleted', false)

      if (startDate) {
        flightsQuery = flightsQuery.gte('flight_date', startDate)
      }
      if (endDate) {
        flightsQuery = flightsQuery.lte('flight_date', endDate)
      }
      if (aircraftIds && aircraftIds.length > 0) {
        flightsQuery = flightsQuery.in('aircraft_id', aircraftIds)
      }

      const { data, error } = await flightsQuery.order('flight_date', { ascending: false })
      
      if (error) {
        console.error('Error fetching filtered flights:', error)
        return NextResponse.json(
          { error: 'Failed to fetch flights' },
          { status: 500 }
        )
      }
      
      flights = data || []

      // Get flight roles for the filtered flights
      if (flights.length > 0) {
        const flightIds = flights.map(f => f.id)
        const { data: rolesData } = await supabase
          .from('flight_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('deleted', false)
          .in('flight_id', flightIds)
        
        flightRoles = rolesData || []
      }
    }

    // Fetch aircraft
    if (includeAircraft) {
      let aircraftQuery = supabase
        .from('aircrafts')
        .select('*')
        .eq('user_id', user.id)
        .eq('deleted', false)

      if (aircraftIds && aircraftIds.length > 0) {
        aircraftQuery = aircraftQuery.in('id', aircraftIds)
      }

      const { data, error } = await aircraftQuery.order('registration', { ascending: true })
      
      if (error) {
        console.error('Error fetching aircraft:', error)
        return NextResponse.json(
          { error: 'Failed to fetch aircraft' },
          { status: 500 }
        )
      }
      
      aircrafts = data || []
    }

    // Fetch crew members
    if (includeCrew) {
      // If we have flight roles, only get crew members that are referenced
      if (flightRoles.length > 0) {
        const crewIds = [...new Set(flightRoles.map(r => r.crew_member_id))]
        const { data } = await supabase
          .from('crew_members')
          .select('*')
          .eq('user_id', user.id)
          .eq('deleted', false)
          .in('id', crewIds)
          .order('name', { ascending: true })
        
        crewMembers = data || []
      } else if (!includeFlights) {
        // If not filtering by flights, get all crew
        const { data } = await supabase
          .from('crew_members')
          .select('*')
          .eq('user_id', user.id)
          .eq('deleted', false)
          .order('name', { ascending: true })
        
        crewMembers = data || []
      }
    }

    // Create backup object
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userEmail: profile?.email || user.email || 'unknown',
      filters: {
        startDate,
        endDate,
        aircraftIds,
        includeFlights,
        includeAircraft,
        includeCrew
      },
      data: {
        flights,
        aircrafts,
        crew_members: crewMembers,
        flight_roles: flightRoles
      },
      metadata: {
        flightCount: flights.length,
        aircraftCount: aircrafts.length,
        crewCount: crewMembers.length,
        flightRolesCount: flightRoles.length,
        totalFlightHours: flights.reduce((sum, f) => sum + (f.block_time || 0), 0),
        dateRange: flights.length > 0 ? {
          earliest: flights[flights.length - 1].flight_date,
          latest: flights[0].flight_date
        } : null
      }
    }

    // Generate filename with timestamp and filter info
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filterSuffix = startDate || endDate ? '-filtered' : ''
    const filename = `logk-backup-${timestamp}${filterSuffix}.json`

    // Return JSON file as download
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('Filtered backup export error:', error)
    return NextResponse.json(
      { error: 'Failed to create filtered backup' },
      { status: 500 }
    )
  }
}