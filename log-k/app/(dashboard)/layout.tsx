import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import DebugPanel from '@/components/debug/DebugPanel'
import VersionFooter from '@/components/dashboard/VersionFooter'
import TrialBanner from '@/components/subscription/TrialBanner'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n/translations'
import { subDays } from 'date-fns'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for TopBar and language preference
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Check subscription status for trial banner
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_tier, subscription_source, valid_until')
    .eq('user_id', user.id)
    .gte('valid_until', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Calculate days remaining if trial
  // Note: Trials have subscription_tier='trial' with subscription_source='promo'
  let trialDaysRemaining = null
  if (subscription?.subscription_tier === 'trial') {
    const validUntil = new Date(subscription.valid_until)
    const now = new Date()
    const daysRemaining = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    trialDaysRemaining = Math.max(0, daysRemaining)
  }
  
  // Get user's language preference or default to 'en'
  const userLanguage: Language = (userProfile?.language && ['en', 'de', 'fr', 'es'].includes(userProfile.language)) 
    ? userProfile.language as Language 
    : 'en'

  // Calculate recent landings (last 90 days)
  const ninetyDaysAgo = subDays(new Date(), 90).toISOString()
  
  const { data: recentFlights } = await supabase
    .from('flights')
    .select('landings_day, landings_night')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .gte('flight_date', ninetyDaysAgo)

  const recentLandings = {
    dayLandings: recentFlights?.reduce((sum, f) => sum + (f.landings_day || 0), 0) || 0,
    nightLandings: recentFlights?.reduce((sum, f) => sum + (f.landings_night || 0), 0) || 0,
    totalLandings: 0
  }
  recentLandings.totalLandings = recentLandings.dayLandings + recentLandings.nightLandings

  return (
    <LanguageProvider initialLanguage={userLanguage} userId={user.id}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar 
            user={user} 
            userProfile={userProfile}
            recentLandings={recentLandings}
          />
          <main className="flex-1 p-6">
            {trialDaysRemaining !== null && (
              <TrialBanner daysRemaining={trialDaysRemaining} />
            )}
            {children}
          </main>
          <VersionFooter />
        </div>
        <DebugPanel />
      </div>
    </LanguageProvider>
  )
}