import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Read file content
    const csvContent = await file.text()
    
    // Validate CSV structure
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    })
    
    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid CSV format', details: parseResult.errors },
        { status: 400 }
      )
    }
    
    const airports = parseResult.data as any[]
    
    // Validate required fields
    const requiredFields = ['icao', 'name', 'country', 'lat', 'lon', 'alt', 'type']
    const missingFields = requiredFields.filter(
      field => !airports[0]?.hasOwnProperty(field)
    )
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Create backup of current CSV
    const csvPath = path.join(process.cwd(), 'public', 'airports.csv')
    const backupPath = path.join(
      process.cwd(), 
      'public', 
      `airports_backup_${new Date().toISOString().split('T')[0]}.csv`
    )
    
    try {
      const currentCsv = await fs.readFile(csvPath, 'utf-8')
      await fs.writeFile(backupPath, currentCsv, 'utf-8')
    } catch (error) {
      console.log('No existing CSV to backup')
    }
    
    // Write new CSV
    await fs.writeFile(csvPath, csvContent, 'utf-8')
    
    return NextResponse.json({ 
      success: true,
      count: airports.length,
      backup: backupPath
    })
  } catch (error) {
    console.error('Error importing airports:', error)
    return NextResponse.json(
      { error: 'Failed to import airports' },
      { status: 500 }
    )
  }
}