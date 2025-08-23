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
  
  // Fetch all subscriptions first
  const { data: subscriptions, error: subscriptionsError } = await adminSupabase
    .from('user_subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (subscriptionsError) {
    console.error('Error fetching subscriptions:', subscriptionsError)
  }
  
  // Also fetch active trials from user_trial_status table
  const { data: trialStatus, error: trialError } = await adminSupabase
    .from('user_trial_status')
    .select('*')
    .eq('trial_status', 'active_trial')
  
  if (trialError) {
    console.error('Error fetching trial status:', trialError)
  }
  
  // Fetch user profiles for all unique user IDs
  const allUserIds = new Set<string>()
  subscriptions?.forEach(s => allUserIds.add(s.user_id))
  trialStatus?.forEach(t => allUserIds.add(t.user_id))
  
  // Only fetch profiles if there are user IDs
  let userProfilesMap = new Map()
  if (allUserIds.size > 0) {
    const { data: userProfiles } = await adminSupabase
      .from('user_profiles')
      .select('id, first_name, last_name, email, username')
      .in('id', Array.from(allUserIds))
    
    // Create a map for easy lookup
    userProfilesMap = new Map(
      userProfiles?.map(profile => [profile.id, profile]) || []
    )
  }
  
  // Debug logging
  console.log('Subscriptions fetched:', subscriptions?.length || 0)
  console.log('Trial status fetched:', trialStatus?.length || 0)
  console.log('User profiles fetched:', userProfilesMap.size)
  
  // Convert trial status to subscription format with user profiles
  const trialSubscriptions = trialStatus?.map(trial => ({
    id: `trial_${trial.user_id}`, // Use user_id as unique identifier
    user_id: trial.user_id,
    subscription_tier: 'trial' as const,
    subscription_source: 'trial' as const,
    activated_at: trial.trial_started || new Date().toISOString(),
    valid_until: trial.trial_ends || new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // Default to 28 days if not set
    apple_transaction_id: null,
    apple_original_transaction_id: null,
    stripe_subscription_id: null,
    stripe_customer_id: null,
    promo_code: null,
    notes: 'Trial from user_trial_status table',
    created_at: trial.trial_started || new Date().toISOString(), // Use trial_started as created_at
    updated_at: trial.trial_started || new Date().toISOString(), // Use trial_started as updated_at
    user_profiles: userProfilesMap.get(trial.user_id) || {
      id: trial.user_id,
      email: trial.email || 'Unknown',
      first_name: null,
      last_name: null,
      username: null
    }
  })) || []
  
  // Add user profiles to subscriptions
  const subscriptionsWithProfiles = subscriptions?.map(sub => ({
    ...sub,
    user_profiles: userProfilesMap.get(sub.user_id) || {
      id: sub.user_id,
      email: 'Unknown',
      first_name: null,
      last_name: null,
      username: null
    }
  })) || []
  
  // Merge subscriptions, removing duplicates (trial status takes priority)
  const userIdsWithTrials = new Set(trialSubscriptions.map(t => t.user_id))
  const regularSubscriptions = subscriptionsWithProfiles.filter(s => !userIdsWithTrials.has(s.user_id))
  const allSubscriptions = [...regularSubscriptions, ...trialSubscriptions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  
  // Calculate statistics using merged data
  const now = new Date()
  const activeTrialSubs = allSubscriptions.filter(s => {
    const validUntil = new Date(s.valid_until)
    return validUntil > now && s.subscription_tier === 'trial'
  })
  
  const stats = {
    totalSubscriptions: allSubscriptions.length,
    activeSubscriptions: allSubscriptions.filter(s => {
      const validUntil = new Date(s.valid_until)
      return validUntil > now && s.subscription_tier !== 'none'
    }).length,
    expiringSubscriptions: allSubscriptions.filter(s => {
      const validUntil = new Date(s.valid_until)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return validUntil > now && validUntil <= thirtyDaysFromNow && s.subscription_tier !== 'trial'
    }).length,
    activeTrials: activeTrialSubs.length,
    expiringTrials: activeTrialSubs.filter(s => {
      const validUntil = new Date(s.valid_until)
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      return validUntil <= threeDaysFromNow
    }).length,
    tierBreakdown: {
      none: allSubscriptions.filter(s => s.subscription_tier === 'none').length,
      trial: allSubscriptions.filter(s => s.subscription_tier === 'trial').length,
      basic: allSubscriptions.filter(s => s.subscription_tier === 'basic').length,
      pro: allSubscriptions.filter(s => s.subscription_tier === 'pro').length,
      premium: allSubscriptions.filter(s => s.subscription_tier === 'premium').length,
      enterprise: allSubscriptions.filter(s => s.subscription_tier === 'enterprise').length,
    },
    sourceBreakdown: {
      apple: allSubscriptions.filter(s => s.subscription_source === 'apple').length,
      stripe: allSubscriptions.filter(s => s.subscription_source === 'stripe').length,
      promo: allSubscriptions.filter(s => s.subscription_source === 'promo').length,
      admin: allSubscriptions.filter(s => s.subscription_source === 'admin').length,
      trial: allSubscriptions.filter(s => s.subscription_source === 'trial').length,
    }
  }
  
  // Show errors if any
  if (subscriptionsError || trialError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-red-800">Error Loading Data</h2>
          {subscriptionsError && (
            <p className="text-red-700 mt-2">
              Subscriptions Error: {subscriptionsError.message}
            </p>
          )}
          {trialError && (
            <p className="text-red-700 mt-2">
              Trial Status Error: {trialError.message}
            </p>
          )}
        </div>
        <SubscriptionManagement subscriptions={allSubscriptions} stats={stats} />
      </div>
    )
  }
  
  return <SubscriptionManagement subscriptions={allSubscriptions} stats={stats} />
}