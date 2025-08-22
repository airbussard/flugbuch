import { createClient } from '@/lib/supabase/server'
import { createAdminClient, hasAdminAccess } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import SubscriptionManagement from './SubscriptionManagement'

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }

  // Check if we have admin access configured
  if (!hasAdminAccess()) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800">Admin Configuration Required</h2>
          <p className="text-yellow-700 mt-2">
            Service role key is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.
          </p>
        </div>
      </div>
    )
  }

  // Use admin client to get all subscriptions with user data
  const adminSupabase = createAdminClient()
  
  // Fetch all subscriptions with user profiles
  const { data: subscriptions } = await adminSupabase
    .from('user_subscriptions')
    .select(`
      *,
      user_profiles!user_subscriptions_user_id_fkey (
        id,
        first_name,
        last_name,
        email,
        username
      )
    `)
    .order('created_at', { ascending: false })
  
  // Calculate statistics
  const now = new Date()
  const activeTrialSubs = subscriptions?.filter(s => {
    const validUntil = new Date(s.valid_until)
    return validUntil > now && s.subscription_tier === 'trial'
  }) || []
  
  const stats = {
    totalSubscriptions: subscriptions?.length || 0,
    activeSubscriptions: subscriptions?.filter(s => {
      const validUntil = new Date(s.valid_until)
      return validUntil > now && s.subscription_tier !== 'none'
    }).length || 0,
    expiringSubscriptions: subscriptions?.filter(s => {
      const validUntil = new Date(s.valid_until)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return validUntil > now && validUntil <= thirtyDaysFromNow && s.subscription_tier !== 'trial'
    }).length || 0,
    activeTrials: activeTrialSubs.length,
    expiringTrials: activeTrialSubs.filter(s => {
      const validUntil = new Date(s.valid_until)
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      return validUntil <= threeDaysFromNow
    }).length,
    tierBreakdown: {
      none: subscriptions?.filter(s => s.subscription_tier === 'none').length || 0,
      trial: subscriptions?.filter(s => s.subscription_tier === 'trial').length || 0,
      basic: subscriptions?.filter(s => s.subscription_tier === 'basic').length || 0,
      premium: subscriptions?.filter(s => s.subscription_tier === 'premium').length || 0,
      enterprise: subscriptions?.filter(s => s.subscription_tier === 'enterprise').length || 0,
    },
    sourceBreakdown: {
      apple: subscriptions?.filter(s => s.subscription_source === 'apple').length || 0,
      stripe: subscriptions?.filter(s => s.subscription_source === 'stripe').length || 0,
      promo: subscriptions?.filter(s => s.subscription_source === 'promo').length || 0,
      admin: subscriptions?.filter(s => s.subscription_source === 'admin').length || 0,
      trial: subscriptions?.filter(s => s.subscription_source === 'trial').length || 0,
    }
  }
  
  return <SubscriptionManagement subscriptions={subscriptions || []} stats={stats} />
}