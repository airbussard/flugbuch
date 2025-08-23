import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  parseLogTenPDFText, 
  convertToDbFlight, 
  createAircraftFromParsed,
  createCrewMemberFromName,
  type ParsedLogTenFlight 
} from '@/lib/logten-parser'

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

    // Parse the LogTen PDF text
    const parseResult = parseLogTenPDFText(pdfText)
    
    if (parseResult.flights.length === 0) {
      return NextResponse.json(
        { error: 'No flights found in PDF' },
        { status: 400 }
      )
    }

    // Process aircraft - create if not exists
    const aircraftMap = new Map<string, string>() // registration -> id
    
    for (const aircraft of parseResult.aircraft) {
      // Check if aircraft exists
      const { data: existingAircraft } = await supabase
        .from('aircrafts')
        .select('id')
        .eq('user_id', user.id)
        .eq('registration', aircraft.registration)
        .eq('deleted', false)
        .single()
      
      if (existingAircraft) {
        aircraftMap.set(aircraft.registration, existingAircraft.id)
      } else {
        // Create new aircraft
        const newAircraft = createAircraftFromParsed(
          aircraft.registration,
          aircraft.type,
          user.id
        )
        
        const { data: createdAircraft, error: aircraftError } = await supabase
          .from('aircrafts')
          .insert(newAircraft)
          .select('id')
          .single()
        
        if (aircraftError) {
          console.error('Error creating aircraft:', aircraftError)
        } else if (createdAircraft) {
          aircraftMap.set(aircraft.registration, createdAircraft.id)
        }
      }
    }

    // Process crew members - create if not exists
    const crewMap = new Map<string, string>() // name -> id
    
    for (const crewName of parseResult.crewMembers) {
      // Check if crew member exists
      const { data: existingCrew } = await supabase
        .from('crew_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', crewName)
        .eq('deleted', false)
        .single()
      
      if (existingCrew) {
        crewMap.set(crewName, existingCrew.id)
      } else {
        // Create new crew member
        const newCrew = createCrewMemberFromName(crewName, user.id)
        
        const { data: createdCrew, error: crewError } = await supabase
          .from('crew_members')
          .insert(newCrew)
          .select('id')
          .single()
        
        if (crewError) {
          console.error('Error creating crew member:', crewError)
        } else if (createdCrew) {
          crewMap.set(crewName, createdCrew.id)
        }
      }
    }

    // Import flights
    let importedCount = 0
    let skippedCount = 0
    const errors: string[] = []
    
    for (const parsedFlight of parseResult.flights) {
      try {
        // Check for duplicate flight
        const { data: existingFlight } = await supabase
          .from('flights')
          .select('id')
          .eq('user_id', user.id)
          .eq('flight_date', parsedFlight.date)
          .eq('registration', parsedFlight.aircraftId)
          .eq('departure_airport', parsedFlight.from)
          .eq('arrival_airport', parsedFlight.to)
          .eq('deleted', false)
          .single()
        
        if (existingFlight) {
          skippedCount++
          continue
        }
        
        // Convert to database format
        const aircraftId = aircraftMap.get(parsedFlight.aircraftId)
        const dbFlight = convertToDbFlight(parsedFlight, user.id, aircraftId)
        
        // Insert flight
        const { data: createdFlight, error: flightError } = await supabase
          .from('flights')
          .insert(dbFlight)
          .select('id')
          .single()
        
        if (flightError) {
          errors.push(`Error importing flight on ${parsedFlight.date}: ${flightError.message}`)
        } else if (createdFlight) {
          importedCount++
          
          // Create flight roles for crew
          const flightRoles = []
          
          if (parsedFlight.picCrew) {
            const crewId = crewMap.get(parsedFlight.picCrew)
            if (crewId) {
              flightRoles.push({
                flight_id: createdFlight.id,
                crew_member_id: crewId,
                role_name: 'PIC',
                user_id: user.id,
                deleted: false,
                deleted_at: null
              })
            }
          }
          
          if (parsedFlight.sicCrew) {
            const crewId = crewMap.get(parsedFlight.sicCrew)
            if (crewId) {
              flightRoles.push({
                flight_id: createdFlight.id,
                crew_member_id: crewId,
                role_name: 'SIC',
                user_id: user.id,
                deleted: false,
                deleted_at: null
              })
            }
          }
          
          if (flightRoles.length > 0) {
            const { error: rolesError } = await supabase
              .from('flight_roles')
              .insert(flightRoles)
            
            if (rolesError) {
              console.error('Error creating flight roles:', rolesError)
            }
          }
        }
      } catch (error) {
        errors.push(`Unexpected error: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: parseResult.flights.length,
      newAircraft: parseResult.aircraft.size,
      newCrew: parseResult.crewMembers.size,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import flights' },
      { status: 500 }
    )
  }
}

// Parse endpoint - just parse without importing
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

    // Parse the LogTen PDF text
    const parseResult = parseLogTenPDFText(pdfText)
    
    // Check which aircraft and crew already exist
    const existingAircraft = new Set<string>()
    const existingCrew = new Set<string>()
    
    // Check aircraft
    for (const aircraft of parseResult.aircraft) {
      const { data } = await supabase
        .from('aircrafts')
        .select('registration')
        .eq('user_id', user.id)
        .eq('registration', aircraft.registration)
        .eq('deleted', false)
        .single()
      
      if (data) {
        existingAircraft.add(aircraft.registration)
      }
    }
    
    // Check crew
    for (const crewName of parseResult.crewMembers) {
      const { data } = await supabase
        .from('crew_members')
        .select('name')
        .eq('user_id', user.id)
        .eq('name', crewName)
        .eq('deleted', false)
        .single()
      
      if (data) {
        existingCrew.add(crewName)
      }
    }
    
    // Prepare response with new items that will be created
    const newAircraft = Array.from(parseResult.aircraft)
      .filter(a => !existingAircraft.has(a.registration))
    
    const newCrew = Array.from(parseResult.crewMembers)
      .filter(c => !existingCrew.has(c))
    
    return NextResponse.json({
      flights: parseResult.flights,
      newAircraft,
      newCrew,
      existingAircraft: Array.from(existingAircraft),
      existingCrew: Array.from(existingCrew),
      errors: parseResult.errors
    })
    
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}