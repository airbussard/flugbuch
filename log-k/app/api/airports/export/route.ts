import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
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
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'public', 'airports.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')
    
    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="airports_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting airports:', error)
    return NextResponse.json(
      { error: 'Failed to export airports' },
      { status: 500 }
    )
  }
}