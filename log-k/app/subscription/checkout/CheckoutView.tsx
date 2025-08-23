'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, ArrowLeft, Shield, Zap, Clock, CreditCard, Info } from 'lucide-react'
import { SubscriptionTier, TIER_PRICES, TIER_DISPLAY_NAMES } from '@/lib/subscription/types'

interface CheckoutViewProps {
  userId: string
  userEmail: string
  selectedPlan: 'basic' | 'premium'
  currentTier: SubscriptionTier
  isTrialActive: boolean
  trialDaysRemaining: number | null
  redirectTo: string
}

export default function CheckoutView({
  userId,
  userEmail,
  selectedPlan,
  currentTier,
  isTrialActive,
  trialDaysRemaining,
  redirectTo
}: CheckoutViewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planDetails = {
    basic: {
      name: 'Basic',
      price: TIER_PRICES.basic.price,
      period: TIER_PRICES.basic.period,
      monthlyPrice: TIER_PRICES.basic.monthlyPrice,
      color: 'blue',
      features: [
        'Weather & METAR/TAF access',
        'Complete airport database',
        'Account management',
        'Email support',
        'Mobile app access'
      ],
      notIncluded: [
        'Cloud sync & backup',
        'Flight logging',
        'Analytics & statistics',
        'Fleet & crew management',
        'PDF export'
      ]
    },
    premium: {
      name: 'Pro',
      price: TIER_PRICES.premium.price,
      period: TIER_PRICES.premium.period,
      monthlyPrice: TIER_PRICES.premium.monthlyPrice,
      color: 'violet',
      features: [
        'Everything in Basic',
        'Unlimited flight logging',
        'Advanced analytics',
        'Fleet & crew management',
        'Cloud sync across devices',
        'PDF logbook export',
        'Priority 24/7 support'
      ],
      notIncluded: []
    }
  }

  const plan = planDetails[selectedPlan]
  const otherPlan = selectedPlan === 'basic' ? 'premium' : 'basic'

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedPlan,
          userId,
          returnUrl: window.location.origin + redirectTo,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        // Stripe not yet configured
        setError(data.message || 'Payment system coming soon. Please subscribe via the iOS app or check back later.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrial = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        router.push(redirectTo)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to start trial')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link 
        href="/#pricing" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to pricing
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Complete Your Subscription
        </h1>
        <p className="text-xl text-gray-600">
          You're about to subscribe to Log-K {plan.name}
        </p>
      </div>

      {/* Trial Status Banner */}
      {isTrialActive && trialDaysRemaining !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-blue-900 font-medium">
                You have {trialDaysRemaining} days left in your free trial
              </p>
              <p className="text-blue-700 text-sm mt-1">
                You can continue using all Pro features until your trial expires, or subscribe now to ensure uninterrupted access.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Selected Plan Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 border-${plan.color}-500`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Log-K {plan.name}
                </h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                {plan.monthlyPrice && (
                  <p className="text-sm text-gray-500 mt-1">
                    Only {plan.monthlyPrice}
                  </p>
                )}
              </div>
              <Link
                href={`/subscription/checkout?plan=${otherPlan}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Switch to {planDetails[otherPlan].name}
              </Link>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Included features:
                </h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.notIncluded.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Not included:
                  </h3>
                  <ul className="space-y-2">
                    {plan.notIncluded.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/subscription/checkout?plan=premium"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-3"
                  >
                    Upgrade to Pro for all features
                    <Zap className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Security & Trust */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Secure & Trusted
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Secure payment processing via Stripe</li>
                  <li>• Cancel anytime from your account settings</li>
                  <li>• Your data is always yours to export</li>
                  <li>• GDPR compliant & encrypted storage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">
                  Log-K {plan.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium text-gray-900">
                  Yearly
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900 text-sm">
                  {userEmail}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-gray-900">
                    {plan.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  per year, incl. VAT
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center ${
                  selectedPlan === 'premium'
                    ? 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </>
                )}
              </button>

              {currentTier === 'none' && !isTrialActive && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleStartTrial}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-semibold transition border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Start 4-Week Free Trial Instead
                  </button>
                </>
              )}
            </div>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 text-center mb-3">
                Secure payment via
              </p>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-gray-400 font-semibold">Stripe</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400 text-sm">Coming Soon</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Also available via iOS in-app purchase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}