import { NextRequest, NextResponse } from 'next/server'
import { runwayService } from '@/lib/data/runway-service'
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
    
    // Load runways using server-side method
    await runwayService.loadRunwaysFromFile()
    const runways = await runwayService.getRunways(icao.toUpperCase())
    
    return NextResponse.json(runways)
  } catch (error) {
    console.error('Error loading runways:', error)
    return NextResponse.json(
      { error: 'Failed to load runways' },
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
    
    const runways = await request.json()
    
    if (!Array.isArray(runways)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }
    
    // Update runways in the service
    await runwayService.loadRunwaysFromFile()
    await runwayService.updateRunways(icao.toUpperCase(), runways)
    
    return NextResponse.json({ success: true, message: 'Runways updated successfully' })
  } catch (error) {
    console.error('Error updating runways:', error)
    return NextResponse.json(
      { error: 'Failed to update runways' },
      { status: 500 }
    )
  }
}