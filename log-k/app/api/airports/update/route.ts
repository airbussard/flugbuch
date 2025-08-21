import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { airportService } from '@/lib/data/airport-service'
import fs from 'fs/promises'
import path from 'path'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin status
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
    
    const airportData = await request.json()
    
    // Read current CSV
    const csvPath = path.join(process.cwd(), 'public', 'airports.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')
    
    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    })
    
    const airports = parseResult.data as any[]
    
    // Find and update or add airport
    const existingIndex = airports.findIndex(
      (a: any) => a.icao === airportData.icao
    )
    
    const updatedAirport = {
      icao: airportData.icao,
      iata: airportData.iata || '',
      name: airportData.name,
      municipality: airportData.municipality || '',
      country: airportData.country,
      lat: airportData.lat.toString(),
      lon: airportData.lon.toString(),
      alt: airportData.alt.toString(),
      type: airportData.type,
      timezone: airportData.timezone || ''
    }
    
    if (existingIndex >= 0) {
      airports[existingIndex] = updatedAirport
    } else {
      airports.push(updatedAirport)
    }
    
    // Convert back to CSV
    const newCsv = Papa.unparse(airports)
    
    // Write updated CSV
    await fs.writeFile(csvPath, newCsv, 'utf-8')
    
    // Clear the airport service cache for this airport
    // This ensures the next request gets fresh data
    airportService.clearAirport(airportData.icao)
    
    return NextResponse.json({ 
      success: true,
      airport: updatedAirport 
    })
  } catch (error) {
    console.error('Error updating airport:', error)
    return NextResponse.json(
      { error: 'Failed to update airport' },
      { status: 500 }
    )
  }
}