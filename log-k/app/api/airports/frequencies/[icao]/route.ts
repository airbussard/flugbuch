import { NextRequest, NextResponse } from 'next/server'
import { frequencyService } from '@/lib/data/frequency-service'
import { createClient } from '@/lib/supabase/server'

interface Params {
  params: Promise<{ icao: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { icao } = await params
    
    if (!icao) {
      return NextResponse.json(
        { error: 'ICAO code is required' },
        { status: 400 }
      )
    }
    
    // Load frequencies using server-side method
    await frequencyService.loadFrequenciesFromFile()
    const frequencies = await frequencyService.getFrequencies(icao.toUpperCase())
    
    return NextResponse.json(frequencies)
  } catch (error) {
    console.error('Error loading frequencies:', error)
    return NextResponse.json(
      { error: 'Failed to load frequencies' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { icao } = await params
    
    // Check authentication
    const supabase = await createClient()
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
    
    if (!icao) {
      return NextResponse.json(
        { error: 'ICAO code is required' },
        { status: 400 }
      )
    }
    
    const frequencies = await request.json()
    
    if (!Array.isArray(frequencies)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }
    
    // Update frequencies in the service
    await frequencyService.loadFrequenciesFromFile()
    await frequencyService.updateFrequencies(icao.toUpperCase(), frequencies)
    
    return NextResponse.json({ success: true, message: 'Frequencies updated successfully' })
  } catch (error) {
    console.error('Error updating frequencies:', error)
    return NextResponse.json(
      { error: 'Failed to update frequencies' },
      { status: 500 }
    )
  }
}