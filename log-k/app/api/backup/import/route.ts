import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface BackupData {
  version: string
  exportDate: string
  userEmail: string
  data: {
    flights: any[]
    aircrafts: any[]
    crew_members: any[]
    flight_roles: any[]
  }
  metadata?: any
}

type ImportStrategy = 'skip' | 'overwrite' | 'merge'

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

    // Parse request
    const formData = await request.formData()
    const file = formData.get('file') as File
    const strategy = (formData.get('strategy') as ImportStrategy) || 'skip'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      )
    }

    // Parse JSON file
    const text = await file.text()
    let backup: BackupData
    
    try {
      backup = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      )
    }

    // Validate backup structure
    if (!backup.version || !backup.data) {
      return NextResponse.json(
        { error: 'Invalid backup file structure' },
        { status: 400 }
      )
    }

    // Check version compatibility
    if (!backup.version.startsWith('1.')) {
      return NextResponse.json(
        { error: `Unsupported backup version: ${backup.version}` },
        { status: 400 }
      )
    }

    const results = {
      aircrafts: { imported: 0, skipped: 0, updated: 0, errors: [] as string[] },
      crew_members: { imported: 0, skipped: 0, updated: 0, errors: [] as string[] },
      flights: { imported: 0, skipped: 0, updated: 0, errors: [] as string[] },
      flight_roles: { imported: 0, skipped: 0, updated: 0, errors: [] as string[] }
    }

    // Maps to track old IDs to new IDs for relationships
    const aircraftIdMap = new Map<string, string>()
    const crewIdMap = new Map<string, string>()
    const flightIdMap = new Map<string, string>()

    // 1. Import Aircraft
    if (backup.data.aircrafts && backup.data.aircrafts.length > 0) {
      for (const aircraft of backup.data.aircrafts) {
        try {
          // Check if aircraft exists by registration
          const { data: existing } = await supabase
            .from('aircrafts')
            .select('id')
            .eq('user_id', user.id)
            .eq('registration', aircraft.registration)
            .eq('deleted', false)
            .single()

          if (existing) {
            aircraftIdMap.set(aircraft.id, existing.id)
            
            if (strategy === 'skip') {
              results.aircrafts.skipped++
            } else if (strategy === 'overwrite') {
              // Update existing aircraft
              const { error } = await supabase
                .from('aircrafts')
                .update({
                  type: aircraft.type,
                  model: aircraft.model,
                  aircraft_class: aircraft.aircraft_class,
                  default_condition: aircraft.default_condition,
                  complex_aircraft: aircraft.complex_aircraft,
                  high_performance: aircraft.high_performance,
                  tailwheel: aircraft.tailwheel,
                  glass_panel: aircraft.glass_panel,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)

              if (error) {
                results.aircrafts.errors.push(`Failed to update aircraft ${aircraft.registration}: ${error.message}`)
              } else {
                results.aircrafts.updated++
              }
            } else {
              // Merge strategy - only update empty fields
              const { data: currentData } = await supabase
                .from('aircrafts')
                .select('*')
                .eq('id', existing.id)
                .single()

              const updates: any = {}
              if (!currentData.type && aircraft.type) updates.type = aircraft.type
              if (!currentData.model && aircraft.model) updates.model = aircraft.model
              if (!currentData.aircraft_class && aircraft.aircraft_class) updates.aircraft_class = aircraft.aircraft_class
              if (!currentData.default_condition && aircraft.default_condition) updates.default_condition = aircraft.default_condition
              
              if (Object.keys(updates).length > 0) {
                updates.updated_at = new Date().toISOString()
                const { error } = await supabase
                  .from('aircrafts')
                  .update(updates)
                  .eq('id', existing.id)

                if (error) {
                  results.aircrafts.errors.push(`Failed to merge aircraft ${aircraft.registration}: ${error.message}`)
                } else {
                  results.aircrafts.updated++
                }
              } else {
                results.aircrafts.skipped++
              }
            }
          } else {
            // Create new aircraft
            const newAircraft = {
              ...aircraft,
              id: undefined, // Let database generate new ID
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted: false,
              deleted_at: null
            }

            const { data: created, error } = await supabase
              .from('aircrafts')
              .insert(newAircraft)
              .select('id')
              .single()

            if (error) {
              results.aircrafts.errors.push(`Failed to create aircraft ${aircraft.registration}: ${error.message}`)
            } else if (created) {
              aircraftIdMap.set(aircraft.id, created.id)
              results.aircrafts.imported++
            }
          }
        } catch (error) {
          results.aircrafts.errors.push(`Error processing aircraft ${aircraft.registration}: ${error}`)
        }
      }
    }

    // 2. Import Crew Members
    if (backup.data.crew_members && backup.data.crew_members.length > 0) {
      for (const crew of backup.data.crew_members) {
        try {
          // Check if crew member exists by name
          const { data: existing } = await supabase
            .from('crew_members')
            .select('id')
            .eq('user_id', user.id)
            .eq('name', crew.name)
            .eq('deleted', false)
            .single()

          if (existing) {
            crewIdMap.set(crew.id, existing.id)
            
            if (strategy === 'skip') {
              results.crew_members.skipped++
            } else if (strategy === 'overwrite') {
              // Update existing crew member
              const { error } = await supabase
                .from('crew_members')
                .update({
                  email: crew.email,
                  phone: crew.phone,
                  license_number: crew.license_number,
                  notes: crew.notes,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)

              if (error) {
                results.crew_members.errors.push(`Failed to update crew ${crew.name}: ${error.message}`)
              } else {
                results.crew_members.updated++
              }
            } else {
              // Merge strategy
              results.crew_members.skipped++
            }
          } else {
            // Create new crew member
            const newCrew = {
              ...crew,
              id: undefined,
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted: false,
              deleted_at: null
            }

            const { data: created, error } = await supabase
              .from('crew_members')
              .insert(newCrew)
              .select('id')
              .single()

            if (error) {
              results.crew_members.errors.push(`Failed to create crew ${crew.name}: ${error.message}`)
            } else if (created) {
              crewIdMap.set(crew.id, created.id)
              results.crew_members.imported++
            }
          }
        } catch (error) {
          results.crew_members.errors.push(`Error processing crew ${crew.name}: ${error}`)
        }
      }
    }

    // 3. Import Flights
    if (backup.data.flights && backup.data.flights.length > 0) {
      for (const flight of backup.data.flights) {
        try {
          // Map aircraft ID
          const aircraftId = flight.aircraft_id ? aircraftIdMap.get(flight.aircraft_id) : null

          // Check if flight exists
          const { data: existing } = await supabase
            .from('flights')
            .select('id')
            .eq('user_id', user.id)
            .eq('flight_date', flight.flight_date)
            .eq('registration', flight.registration)
            .eq('departure_airport', flight.departure_airport)
            .eq('arrival_airport', flight.arrival_airport)
            .eq('deleted', false)
            .single()

          if (existing) {
            flightIdMap.set(flight.id, existing.id)
            
            if (strategy === 'skip') {
              results.flights.skipped++
            } else if (strategy === 'overwrite') {
              // Update existing flight
              const updateData = {
                ...flight,
                id: existing.id,
                aircraft_id: aircraftId || flight.aircraft_id,
                user_id: user.id,
                updated_at: new Date().toISOString()
              }
              delete updateData.created_at

              const { error } = await supabase
                .from('flights')
                .update(updateData)
                .eq('id', existing.id)

              if (error) {
                results.flights.errors.push(`Failed to update flight on ${flight.flight_date}: ${error.message}`)
              } else {
                results.flights.updated++
              }
            } else {
              // Merge strategy - skip existing
              results.flights.skipped++
            }
          } else {
            // Create new flight
            const newFlight = {
              ...flight,
              id: undefined,
              aircraft_id: aircraftId || flight.aircraft_id,
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted: false,
              deleted_at: null
            }

            const { data: created, error } = await supabase
              .from('flights')
              .insert(newFlight)
              .select('id')
              .single()

            if (error) {
              results.flights.errors.push(`Failed to create flight on ${flight.flight_date}: ${error.message}`)
            } else if (created) {
              flightIdMap.set(flight.id, created.id)
              results.flights.imported++
            }
          }
        } catch (error) {
          results.flights.errors.push(`Error processing flight on ${flight.flight_date}: ${error}`)
        }
      }
    }

    // 4. Import Flight Roles
    if (backup.data.flight_roles && backup.data.flight_roles.length > 0) {
      for (const role of backup.data.flight_roles) {
        try {
          // Map IDs
          const flightId = role.flight_id ? flightIdMap.get(role.flight_id) : null
          const crewMemberId = role.crew_member_id ? crewIdMap.get(role.crew_member_id) : null

          // Skip if we don't have the mapped IDs
          if (!flightId || !crewMemberId) {
            results.flight_roles.skipped++
            continue
          }

          // Check if role exists
          const { data: existing } = await supabase
            .from('flight_roles')
            .select('id')
            .eq('flight_id', flightId)
            .eq('crew_member_id', crewMemberId)
            .eq('role_name', role.role_name)
            .eq('deleted', false)
            .single()

          if (existing) {
            results.flight_roles.skipped++
          } else {
            // Create new flight role
            const newRole = {
              flight_id: flightId,
              crew_member_id: crewMemberId,
              role_name: role.role_name,
              user_id: user.id,
              deleted: false,
              deleted_at: null
            }

            const { error } = await supabase
              .from('flight_roles')
              .insert(newRole)

            if (error) {
              results.flight_roles.errors.push(`Failed to create flight role: ${error.message}`)
            } else {
              results.flight_roles.imported++
            }
          }
        } catch (error) {
          results.flight_roles.errors.push(`Error processing flight role: ${error}`)
        }
      }
    }

    // Generate summary
    const summary = {
      success: true,
      backupDate: backup.exportDate,
      backupEmail: backup.userEmail,
      results,
      totals: {
        imported: results.aircrafts.imported + results.crew_members.imported + 
                 results.flights.imported + results.flight_roles.imported,
        updated: results.aircrafts.updated + results.crew_members.updated + 
                results.flights.updated + results.flight_roles.updated,
        skipped: results.aircrafts.skipped + results.crew_members.skipped + 
                results.flights.skipped + results.flight_roles.skipped,
        errors: results.aircrafts.errors.length + results.crew_members.errors.length + 
               results.flights.errors.length + results.flight_roles.errors.length
      }
    }

    return NextResponse.json(summary)

  } catch (error) {
    console.error('Backup import error:', error)
    return NextResponse.json(
      { error: 'Failed to import backup' },
      { status: 500 }
    )
  }
}

// PUT endpoint for validation/preview
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

    // Parse request
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      )
    }

    // Parse JSON file
    const text = await file.text()
    let backup: BackupData
    
    try {
      backup = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      )
    }

    // Validate backup structure
    if (!backup.version || !backup.data) {
      return NextResponse.json(
        { error: 'Invalid backup file structure' },
        { status: 400 }
      )
    }

    // Check version compatibility
    if (!backup.version.startsWith('1.')) {
      return NextResponse.json(
        { error: `Unsupported backup version: ${backup.version}` },
        { status: 400 }
      )
    }

    // Count existing items that would be affected
    const existingCounts = {
      aircrafts: 0,
      crew_members: 0,
      flights: 0
    }

    // Check aircraft
    if (backup.data.aircrafts && backup.data.aircrafts.length > 0) {
      const registrations = backup.data.aircrafts.map(a => a.registration)
      const { count } = await supabase
        .from('aircrafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('deleted', false)
        .in('registration', registrations)
      
      existingCounts.aircrafts = count || 0
    }

    // Check crew
    if (backup.data.crew_members && backup.data.crew_members.length > 0) {
      const names = backup.data.crew_members.map(c => c.name)
      const { count } = await supabase
        .from('crew_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('deleted', false)
        .in('name', names)
      
      existingCounts.crew_members = count || 0
    }

    // Check flights (sample check for performance)
    if (backup.data.flights && backup.data.flights.length > 0) {
      // Check first 10 flights as a sample
      const sampleFlights = backup.data.flights.slice(0, 10)
      let duplicateCount = 0
      
      for (const flight of sampleFlights) {
        const { data } = await supabase
          .from('flights')
          .select('id')
          .eq('user_id', user.id)
          .eq('flight_date', flight.flight_date)
          .eq('registration', flight.registration)
          .eq('departure_airport', flight.departure_airport)
          .eq('arrival_airport', flight.arrival_airport)
          .eq('deleted', false)
          .single()
        
        if (data) duplicateCount++
      }
      
      // Estimate total duplicates
      if (sampleFlights.length > 0) {
        existingCounts.flights = Math.round(
          (duplicateCount / sampleFlights.length) * backup.data.flights.length
        )
      }
    }

    // Return preview data
    return NextResponse.json({
      valid: true,
      backup: {
        version: backup.version,
        exportDate: backup.exportDate,
        userEmail: backup.userEmail,
        metadata: backup.metadata
      },
      content: {
        flights: backup.data.flights?.length || 0,
        aircrafts: backup.data.aircrafts?.length || 0,
        crew_members: backup.data.crew_members?.length || 0,
        flight_roles: backup.data.flight_roles?.length || 0
      },
      potential_duplicates: existingCounts,
      file_size: file.size,
      file_name: file.name
    })

  } catch (error) {
    console.error('Backup validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate backup' },
      { status: 500 }
    )
  }
}