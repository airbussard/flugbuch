import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ icao: string }> }
) {
  try {
    const { icao } = await context.params
    const supabase = await createClient()
    
    // Get approved PIREPs for this airport
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
      .eq('icao', icao.toUpperCase())
      .eq('is_approved', true)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(50) // Limit to latest 50 PIREPs
    
    if (error) {
      console.error('Error fetching PIREPs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch PIREPs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(pireps || [])
  } catch (error) {
    console.error('Error in PIREPs API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}