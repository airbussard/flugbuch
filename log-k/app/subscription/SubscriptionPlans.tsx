'use client'

import { useState } from 'react'
import { Check, X, Loader2, Star } from 'lucide-react'
import { 
  SubscriptionTier, 
  TIER_DISPLAY_NAMES, 
  TIER_PRICES,
  AppFeature,
  FEATURE_ACCESS 
} from '@/lib/subscription/types'

interface SubscriptionPlansProps {
  userId: string
  currentTier: SubscriptionTier
  returnTo?: string
  highlightFeature?: string
}

export default function SubscriptionPlans({
  userId,
  currentTier,
  returnTo,
  highlightFeature
}: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    setLoading(tier)
    setError(null)

    try {
      if (tier === 'trial') {
        // Start free trial
        const response = await fetch('/api/subscription/start-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })

        if (response.ok) {
          window.location.href = returnTo || '/dashboard'
        } else {
          const data = await response.json()
          setError(data.error || 'Failed to start trial')
        }
      } else {
        // Redirect to Stripe checkout (prepared for later)
        const response = await fetch('/api/subscription/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tier,
            userId,
            returnUrl: window.location.origin + (returnTo || '/dashboard'),
            cancelUrl: window.location.href
          })
        })

        if (response.ok) {
          const { url } = await response.json()
          if (url) {
            window.location.href = url
          } else {
            setError('Stripe integration coming soon. Please subscribe via the iOS app for now.')
          }
        } else {
          const data = await response.json()
          setError(data.error || 'Failed to create checkout session')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      tier: 'trial' as SubscriptionTier,
      name: 'Free Trial',
      price: '0€',
      period: '4 weeks',
      description: 'Try all Pro features for 4 weeks',
      features: FEATURE_ACCESS.trial,
      popular: false,
      available: currentTier === 'none', // Only if never had subscription
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gray-800 hover:bg-gray-900 text-white'
    },
    {
      tier: 'basic' as SubscriptionTier,
      name: 'Basic',
      price: '19,99€',
      period: 'per year',
      monthlyPrice: '1,67€/month',
      description: 'Essential features for casual pilots',
      features: FEATURE_ACCESS.basic,
      popular: false,
      available: true,
      buttonText: 'Choose Basic',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      tier: 'premium' as SubscriptionTier,
      name: 'Pro',
      price: '27,99€',
      period: 'per year',
      monthlyPrice: '2,33€/month',
      description: 'Complete solution for professional pilots',
      features: FEATURE_ACCESS.premium,
      popular: true,
      available: true,
      buttonText: 'Choose Pro',
      buttonStyle: 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
    }
  ]

  const allFeatures: { key: AppFeature; label: string }[] = [
    { key: 'weather', label: 'Weather & METAR/TAF' },
    { key: 'airports', label: 'Airport Database' },
    { key: 'settings', label: 'Account Settings' },
    { key: 'flights', label: 'Flight Logging' },
    { key: 'analytics', label: 'Analytics & Statistics' },
    { key: 'fleet', label: 'Fleet Management' },
    { key: 'crew', label: 'Crew Management' },
    { key: 'export', label: 'PDF Export' },
    { key: 'sync', label: 'Cloud Sync & Backup' }
  ]

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative bg-white rounded-2xl shadow-lg p-8 ${
              plan.popular ? 'ring-2 ring-violet-500' : ''
            } ${!plan.available ? 'opacity-60' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-2">/{plan.period}</span>
              </div>
              {plan.monthlyPrice && (
                <p className="text-sm text-gray-500 mt-1">
                  {plan.monthlyPrice}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {allFeatures.map((feature) => {
                const included = plan.features.includes(feature.key)
                const isHighlighted = feature.key === highlightFeature
                return (
                  <li
                    key={feature.key}
                    className={`flex items-start ${
                      isHighlighted ? 'bg-yellow-50 -mx-2 px-2 py-1 rounded' : ''
                    }`}
                  >
                    {included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={included ? 'text-gray-900' : 'text-gray-400'}>
                      {feature.label}
                      {isHighlighted && (
                        <span className="ml-2 text-xs text-yellow-700 font-medium">
                          Required
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>

            <button
              onClick={() => plan.available && handleSelectPlan(plan.tier)}
              disabled={!plan.available || loading !== null || currentTier === plan.tier}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center ${
                plan.buttonStyle
              } ${
                !plan.available || currentTier === plan.tier
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {loading === plan.tier ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : currentTier === plan.tier ? (
                'Current Plan'
              ) : !plan.available ? (
                'Not Available'
              ) : (
                plan.buttonText
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Note */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-2">
          All plans include:
        </h3>
        <ul className="text-gray-600 space-y-1">
          <li>• EASA & FAA compliance</li>
          <li>• Unlimited flight entries</li>
          <li>• Mobile app access</li>
          <li>• Regular updates</li>
          <li>• Email support</li>
        </ul>
      </div>
    </div>
  )
}