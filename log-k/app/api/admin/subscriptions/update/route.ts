import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(request: NextRequest) {
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
      subscriptionId, 
      subscription_tier,
      subscription_source,
      valid_until,
      promo_code,
      notes,
      apple_transaction_id,
      apple_original_transaction_id,
      stripe_subscription_id,
      stripe_customer_id
    } = body
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }
    
    const adminSupabase = createAdminClient()
    
    // Get current subscription data for history
    const { data: currentSubscription } = await adminSupabase
      .from('user_subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single()
    
    if (!currentSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }
    
    // Update subscription
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (subscription_tier !== undefined) updateData.subscription_tier = subscription_tier
    if (subscription_source !== undefined) updateData.subscription_source = subscription_source
    if (valid_until !== undefined) updateData.valid_until = valid_until
    if (promo_code !== undefined) updateData.promo_code = promo_code
    if (notes !== undefined) updateData.notes = notes
    if (apple_transaction_id !== undefined) updateData.apple_transaction_id = apple_transaction_id
    if (apple_original_transaction_id !== undefined) updateData.apple_original_transaction_id = apple_original_transaction_id
    if (stripe_subscription_id !== undefined) updateData.stripe_subscription_id = stripe_subscription_id
    if (stripe_customer_id !== undefined) updateData.stripe_customer_id = stripe_customer_id
    
    const { data: updatedSubscription, error: updateError } = await adminSupabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }
    
    // Create history entry if tier changed
    if (subscription_tier && subscription_tier !== currentSubscription.subscription_tier) {
      const historyEntry = {
        user_id: currentSubscription.user_id,
        subscription_id: subscriptionId,
        event_type: subscription_tier === 'none' ? 'cancellation' : 
                   (currentSubscription.subscription_tier === 'none' ? 'activation' :
                   (subscription_tier > currentSubscription.subscription_tier ? 'upgrade' : 'downgrade')),
        previous_tier: currentSubscription.subscription_tier,
        new_tier: subscription_tier,
        metadata: {
          changed_by: user.id,
          changed_by_admin: true,
          reason: 'Admin manual update'
        }
      }
      
      await adminSupabase
        .from('subscription_history')
        .insert(historyEntry)
    }
    
    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription 
    })
    
  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}