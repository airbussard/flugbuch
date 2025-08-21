import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }
    
    // Get pending PIREPs
    const { data: pireps, error } = await supabase
      .from('pireps')
      .select(`
        id,
        icao,
        author_name,
        flight_date,
        aircraft_type,
        report_type,
        title,
        content,
        rating,
        created_at,
        user_id
      `)
      .eq('is_approved', false)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching pending PIREPs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pending PIREPs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(pireps || [])
  } catch (error) {
    console.error('Error in pending PIREPs API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}