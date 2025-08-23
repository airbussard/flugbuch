import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  parseDutyPlanPDF, 
  convertDutyPlanToDbFlight,
  type DutyPlanFlight 
} from '@/lib/duty-plan-parser'

// POST - Import duty plan flights
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

    // Get the PDF text from request
    const formData = await request.formData()
    const pdfText = formData.get('pdfText') as string
    
    if (!pdfText) {
      return NextResponse.json(
        { error: 'No PDF text provided' },
        { status: 400 }
      )
    }

    // Parse the Duty Plan PDF
    const parseResult = parseDutyPlanPDF(pdfText)
    
    if (parseResult.flights.length === 0) {
      return NextResponse.json(
        { error: 'No EW flights found in Duty Plan' },
        { status: 400 }
      )
    }

    // Import flights
    let importedCount = 0
    let skippedCount = 0
    const errors: string[] = []
    
    for (const dutyFlight of parseResult.flights) {
      try {
        // Check for duplicate flight
        const { data: existingFlight } = await supabase
          .from('flights')
          .select('id')
          .eq('user_id', user.id)
          .eq('flight_date', dutyFlight.date)
          .eq('flight_number', dutyFlight.flightNumber)
          .eq('deleted', false)
          .single()
        
        if (existingFlight) {
          skippedCount++
          continue
        }
        
        // Convert to database format
        const dbFlight = convertDutyPlanToDbFlight(dutyFlight, user.id)
        
        // Insert flight
        const { error: flightError } = await supabase
          .from('flights')
          .insert(dbFlight)
        
        if (flightError) {
          errors.push(`Error importing ${dutyFlight.flightNumber} on ${dutyFlight.date}: ${flightError.message}`)
        } else {
          importedCount++
        }
      } catch (error) {
        errors.push(`Unexpected error for ${dutyFlight.flightNumber}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: parseResult.flights.length,
      period: parseResult.period,
      errors: errors.length > 0 ? errors : undefined,
      warnings: [
        'Aircraft registrations need to be updated',
        'Crew assignments need to be added',
        'Actual takeoff/landing times need to be updated',
        'PIC/SIC times need to be assigned'
      ]
    })
    
  } catch (error) {
    console.error('Duty Plan import error:', error)
    return NextResponse.json(
      { error: 'Failed to import duty plan' },
      { status: 500 }
    )
  }
}

// PUT - Parse duty plan without importing (preview)
export async function PUT(request: NextRequest) {
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

    // Get the PDF text from request
    const formData = await request.formData()
    const pdfText = formData.get('pdfText') as string
    
    if (!pdfText) {
      return NextResponse.json(
        { error: 'No PDF text provided' },
        { status: 400 }
      )
    }

    // Parse the Duty Plan PDF
    const parseResult = parseDutyPlanPDF(pdfText)
    
    if (parseResult.flights.length === 0) {
      return NextResponse.json(
        { 
          error: 'No EW flights found in Duty Plan',
          details: 'Make sure the PDF contains Eurowings (EW) flight numbers. Deadhead (DH) flights are automatically excluded.'
        },
        { status: 400 }
      )
    }
    
    // Check which flights already exist
    const duplicates: string[] = []
    
    for (const flight of parseResult.flights) {
      const { data } = await supabase
        .from('flights')
        .select('id')
        .eq('user_id', user.id)
        .eq('flight_date', flight.date)
        .eq('flight_number', flight.flightNumber)
        .eq('deleted', false)
        .single()
      
      if (data) {
        duplicates.push(`${flight.date} ${flight.flightNumber}`)
      }
    }
    
    return NextResponse.json({
      flights: parseResult.flights,
      period: parseResult.period,
      duplicates,
      totalFlights: parseResult.flights.length,
      newFlights: parseResult.flights.length - duplicates.length,
      errors: parseResult.errors
    })
    
  } catch (error) {
    console.error('Duty Plan parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse duty plan' },
      { status: 500 }
    )
  }
}