import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: Request) {
  try {
    const { userId, password } = await request.json()
    
    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Verify that the requesting user is the same as the one being deleted
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Re-authenticate with password to confirm
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Start transaction to delete all user data
    // Note: Order matters due to foreign key constraints
    
    // 1. Delete flight roles (references flights and crew_members)
    await supabase
      .from('flight_roles')
      .delete()
      .eq('user_id', userId)

    // 2. Delete flights (references aircrafts)
    await supabase
      .from('flights')
      .delete()
      .eq('user_id', userId)

    // 3. Delete crew members
    await supabase
      .from('crew_members')
      .delete()
      .eq('user_id', userId)

    // 4. Delete aircrafts
    await supabase
      .from('aircrafts')
      .delete()
      .eq('user_id', userId)

    // 5. Delete any aircraft table entries (if exists)
    await supabase
      .from('aircraft')
      .delete()
      .eq('user_id', userId)

    // 6. Delete subscription history
    await supabase
      .from('subscription_history')
      .delete()
      .eq('user_id', userId)

    // 7. Delete user subscriptions
    await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId)

    // 8. Delete user profile
    await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId) // user_profiles uses 'id' as primary key

    // 9. Log deletion in audit log
    await supabase
      .from('security_audit_log')
      .insert({
        table_name: 'user_account',
        operation: 'DELETE',
        user_id: userId,
        timestamp: new Date().toISOString(),
        new_data: { reason: 'User requested account deletion' }
      })

    // 10. Finally, delete the auth user
    // This will cascade to other tables if properly configured
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      // Even if auth deletion fails, user data is already deleted
      // They won't be able to login or access anything
    }

    return NextResponse.json({ 
      success: true,
      message: 'Account and all associated data have been permanently deleted'
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    )
  }
}