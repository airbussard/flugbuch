import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ImportedFlight {
  flight_date: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  off_block?: string
  on_block?: string
  takeoff?: string
  landing?: string
  registration: string
  aircraft_type: string
  position: string
  block_time: number
  pic_time: number
  sic_time: number
  multi_pilot_time: number
  ifr_time: number
  vfr_time: number
  night_time: number
  cross_country_time: number
  dual_given_time: number
  dual_received_time: number
  landings_day: number
  landings_night: number
  is_pilot_flying: boolean
  remarks: string
}

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

    // Parse request body
    const { flights } = await request.json() as { flights: ImportedFlight[] }
    
    if (!flights || !Array.isArray(flights)) {
      return NextResponse.json(
        { error: 'Invalid request: flights array required' },
        { status: 400 }
      )
    }

    if (flights.length === 0) {
      return NextResponse.json(
        { error: 'No flights to import' },
        { status: 400 }
      )
    }

    // Validate flights
    const errors: string[] = []
    const validFlights: any[] = []
    
    for (let i = 0; i < flights.length; i++) {
      const flight = flights[i]
      const rowNum = i + 2 // Account for header row and 0-index
      
      // Required fields validation
      if (!flight.flight_date) {
        errors.push(`Row ${rowNum}: Flight date is required`)
        continue
      }
      
      if (!flight.departure_airport || !flight.arrival_airport) {
        errors.push(`Row ${rowNum}: Departure and arrival airports are required`)
        continue
      }
      
      if (!flight.registration) {
        errors.push(`Row ${rowNum}: Aircraft registration is required`)
        continue
      }

      // Parse and validate date
      const flightDate = new Date(flight.flight_date)
      if (isNaN(flightDate.getTime())) {
        errors.push(`Row ${rowNum}: Invalid date format`)
        continue
      }

      // Parse times to proper timestamps
      let off_block_date = null
      let on_block_date = null
      let takeoff_date = null
      let landing_date = null

      if (flight.off_block) {
        off_block_date = new Date(flight.off_block)
        if (isNaN(off_block_date.getTime())) {
          off_block_date = null
        }
      }

      if (flight.on_block) {
        on_block_date = new Date(flight.on_block)
        if (isNaN(on_block_date.getTime())) {
          on_block_date = null
        }
      }

      if (flight.takeoff) {
        takeoff_date = new Date(flight.takeoff)
        if (isNaN(takeoff_date.getTime())) {
          takeoff_date = null
        }
      }

      if (flight.landing) {
        landing_date = new Date(flight.landing)
        if (isNaN(landing_date.getTime())) {
          landing_date = null
        }
      }

      // Calculate total time (for compatibility)
      const total_time = flight.block_time || 0

      // Prepare flight record for database
      const dbFlight = {
        user_id: user.id,
        flight_date: flight.flight_date,
        flight_number: flight.flight_number || null,
        departure_airport: flight.departure_airport.toUpperCase(),
        arrival_airport: flight.arrival_airport.toUpperCase(),
        off_block: off_block_date?.toISOString() || null,
        off_block_date: off_block_date?.toISOString() || null,
        on_block: on_block_date?.toISOString() || null,
        takeoff: takeoff_date?.toISOString() || null,
        takeoff_date: takeoff_date?.toISOString() || null,
        landing: landing_date?.toISOString() || null,
        registration: flight.registration.toUpperCase(),  // Database column is 'registration', not 'aircraft_registration'
        aircraft_type: flight.aircraft_type || flight.registration, // Fallback to registration
        block_time: flight.block_time || 0,
        total_time: total_time,
        pic_time: flight.pic_time || 0,
        sic_time: flight.sic_time || 0,
        multi_pilot_time: flight.multi_pilot_time || 0,
        ifr_time: flight.ifr_time || 0,
        vfr_time: flight.vfr_time || 0,
        night_time: flight.night_time || 0,
        cross_country_time: flight.cross_country_time || 0,
        dual_given_time: flight.dual_given_time || 0,
        dual_received_time: flight.dual_received_time || 0,
        landings_day: flight.landings_day || 0,
        landings_night: flight.landings_night || 0,
        is_pilot_flying: flight.is_pilot_flying || false,
        remarks: flight.remarks || null,
        // Set instructor based on position
        is_instructor: flight.position === 'INSTRUCTOR' || flight.dual_given_time > 0,
        // Default fields
        is_simulator_session: false,
        safety_pilot: false,
        deleted: false
      }

      // Handle position-based time allocation
      if (flight.position === 'PIC' || flight.position === 'CAPTAIN') {
        dbFlight.pic_time = dbFlight.block_time
        dbFlight.sic_time = 0
      } else if (flight.position === 'SIC' || flight.position === 'FO' || flight.position === 'COPILOT') {
        dbFlight.pic_time = 0
        dbFlight.sic_time = dbFlight.block_time
      }

      validFlights.push(dbFlight)
    }

    // If no valid flights, return error
    if (validFlights.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          imported: 0,
          skipped: flights.length,
          errors
        },
        { status: 400 }
      )
    }

    // Check for existing flights (avoid duplicates)
    const flightDates = validFlights.map(f => f.flight_date)
    const { data: existingFlights } = await supabase
      .from('flights')
      .select('flight_date, flight_number, departure_airport, arrival_airport')
      .eq('user_id', user.id)
      .in('flight_date', flightDates)

    // Filter out potential duplicates
    const importFlights = validFlights.filter(flight => {
      const isDuplicate = existingFlights?.some(existing => 
        existing.flight_date === flight.flight_date &&
        existing.departure_airport === flight.departure_airport &&
        existing.arrival_airport === flight.arrival_airport &&
        (existing.flight_number === flight.flight_number || (!existing.flight_number && !flight.flight_number))
      )
      
      if (isDuplicate) {
        errors.push(`Skipped duplicate: ${flight.flight_date} ${flight.departure_airport}-${flight.arrival_airport}`)
      }
      
      return !isDuplicate
    })

    // Import flights in batches
    const batchSize = 50
    let imported = 0
    
    for (let i = 0; i < importFlights.length; i += batchSize) {
      const batch = importFlights.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('flights')
        .insert(batch)
        .select()

      if (error) {
        console.error('Batch import error:', error)
        errors.push(`Failed to import batch starting at row ${i + 1}: ${error.message}`)
      } else {
        imported += data?.length || 0
      }
    }

    const skipped = flights.length - imported

    return NextResponse.json({
      success: imported > 0,
      imported,
      skipped,
      errors
    })

  } catch (error: any) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import flights' },
      { status: 500 }
    )
  }
}