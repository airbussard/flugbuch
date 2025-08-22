import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionPlans from '../SubscriptionPlans'
import { getUserSubscriptionStatus } from '@/lib/subscription/service'

export default async function SubscriptionChoosePage({
  searchParams
}: {
  searchParams: { feature?: string; return_to?: string; expired?: string }
}) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get current subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(user.id)

  // If user has active subscription, redirect to dashboard or return URL
  if (subscriptionStatus.isActive && subscriptionStatus.tier !== 'none') {
    const returnTo = searchParams.return_to || '/dashboard'
    redirect(returnTo)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          {searchParams.expired === 'true' ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Trial Has Expired
              </h1>
              <p className="text-xl text-gray-600">
                Choose a plan to continue using Log-K
              </p>
            </>
          ) : searchParams.feature ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Upgrade to Access This Feature
              </h1>
              <p className="text-xl text-gray-600">
                The {searchParams.feature} feature requires a subscription
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600">
                Select the plan that fits your needs
              </p>
            </>
          )}
        </div>

        {/* Subscription Plans Component */}
        <SubscriptionPlans 
          userId={user.id}
          currentTier={subscriptionStatus.tier}
          returnTo={searchParams.return_to}
          highlightFeature={searchParams.feature}
        />

        {/* iOS Subscription Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Already subscribed via iOS?
          </h3>
          <p className="text-blue-700 mb-4">
            If you purchased a subscription through the iOS app, your subscription is already active.
            Simply log in with the same account on both platforms.
          </p>
          <button
            className="text-blue-600 hover:text-blue-800 font-medium underline"
            onClick={() => window.location.href = '/api/subscription/sync-ios'}
          >
            Sync iOS Subscription
          </button>
        </div>

        {/* Return to Settings */}
        <div className="mt-8 text-center">
          <a
            href="/settings"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Return to Settings
          </a>
        </div>
      </div>
    </div>
  )
}