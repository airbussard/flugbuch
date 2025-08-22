import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const subscriptionId = searchParams.get('subscriptionId')
    
    const adminSupabase = createAdminClient()
    
    let query = adminSupabase
      .from('subscription_history')
      .select(`
        *,
        user_profiles!subscription_history_user_id_fkey (
          id,
          first_name,
          last_name,
          email,
          username
        )
      `)
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (subscriptionId) {
      query = query.eq('subscription_id', subscriptionId)
    }
    
    const { data: history, error } = await query
    
    if (error) {
      console.error('History fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
    }
    
    return NextResponse.json({ history })
    
  } catch (error) {
    console.error('History endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const body = await request.json()
    const {
      user_id,
      subscription_id,
      event_type,
      previous_tier,
      new_tier,
      amount,
      currency,
      payment_method,
      metadata
    } = body
    
    if (!user_id || !event_type) {
      return NextResponse.json({ error: 'User ID and event type required' }, { status: 400 })
    }
    
    const adminSupabase = createAdminClient()
    
    const historyEntry = {
      user_id,
      subscription_id,
      event_type,
      previous_tier,
      new_tier,
      amount,
      currency: currency || 'EUR',
      payment_method,
      metadata: {
        ...metadata,
        created_by: user.id,
        created_by_admin: true
      }
    }
    
    const { data: newEntry, error } = await adminSupabase
      .from('subscription_history')
      .insert(historyEntry)
      .select()
      .single()
    
    if (error) {
      console.error('History insert error:', error)
      return NextResponse.json({ error: 'Failed to create history entry' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      entry: newEntry 
    })
    
  } catch (error) {
    console.error('History create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}