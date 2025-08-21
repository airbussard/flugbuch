import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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
    
    // Parse request body
    const body = await request.json()
    const { approve } = body
    
    if (typeof approve !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request: approve must be a boolean' },
        { status: 400 }
      )
    }
    
    // Update PIREP approval status
    const updateData = approve 
      ? {
          is_approved: true,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        }
      : {
          is_approved: false,
          approved_by: null,
          approved_at: null
        }
    
    const { data: pirep, error } = await supabase
      .from('pireps')
      .update(updateData)
      .eq('id', id)
      .eq('deleted', false)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating PIREP:', error)
      return NextResponse.json(
        { error: 'Failed to update PIREP' },
        { status: 500 }
      )
    }
    
    if (!pirep) {
      return NextResponse.json(
        { error: 'PIREP not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: approve ? 'PIREP approved successfully' : 'PIREP approval revoked',
      pirep
    })
    
  } catch (error) {
    console.error('Error in PIREP approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}