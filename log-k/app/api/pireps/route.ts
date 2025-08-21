import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
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
    
    // Get user profile for author name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()
    
    const authorName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous Pilot'
      : 'Anonymous Pilot'
    
    // Parse request body
    const body = await request.json()
    const {
      icao,
      flight_date,
      aircraft_type,
      report_type,
      title,
      content,
      rating
    } = body
    
    // Validate required fields
    if (!icao || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: icao, title, content' },
        { status: 400 }
      )
    }
    
    // Validate content length
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      )
    }
    
    if (content.length < 50 || content.length > 5000) {
      return NextResponse.json(
        { error: 'Content must be between 50 and 5000 characters' },
        { status: 400 }
      )
    }
    
    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    // Create PIREP
    const { data: pirep, error } = await supabase
      .from('pireps')
      .insert({
        icao: icao.toUpperCase(),
        user_id: user.id,
        author_name: authorName,
        flight_date,
        aircraft_type,
        report_type: report_type || 'general',
        title,
        content,
        rating,
        is_approved: false // Always start as unapproved
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating PIREP:', error)
      
      // Check for spam limit error
      if (error.message?.includes('Daily PIREP limit')) {
        return NextResponse.json(
          { error: 'You have reached the daily limit of 5 PIREPs' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create PIREP' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'PIREP submitted successfully. It will be visible after admin approval.',
      pirep
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error in PIREP POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}