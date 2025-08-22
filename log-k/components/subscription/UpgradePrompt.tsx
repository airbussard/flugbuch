'use client'

import { Lock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AppFeature, TIER_PRICES } from '@/lib/subscription/types'

interface UpgradePromptProps {
  feature: AppFeature
  currentTier?: string
  className?: string
}

const FEATURE_NAMES: Record<AppFeature, string> = {
  weather: 'Weather & METAR/TAF',
  airports: 'Airport Database',
  settings: 'Account Settings',
  flights: 'Flight Logging',
  analytics: 'Analytics & Statistics',
  fleet: 'Fleet Management',
  crew: 'Crew Management',
  export: 'PDF Export',
  sync: 'Cloud Sync & Backup',
  admin: 'Admin Dashboard'
}

const FEATURE_DESCRIPTIONS: Record<AppFeature, string> = {
  weather: 'Access real-time weather data, METAR/TAF reports, and weather maps',
  airports: 'Browse comprehensive airport information and runway details',
  settings: 'Manage your account settings and preferences',
  flights: 'Log and track all your flights with detailed information',
  analytics: 'View detailed statistics and insights about your flying',
  fleet: 'Manage multiple aircraft with performance tracking',
  crew: 'Track crew members and flight assignments',
  export: 'Export your logbook as PDF for official use',
  sync: 'Sync your data across all devices with cloud backup',
  admin: 'Access administrative features and user management'
}

export default function UpgradePrompt({ 
  feature, 
  currentTier = 'none',
  className = ''
}: UpgradePromptProps) {
  const featureName = FEATURE_NAMES[feature] || feature
  const featureDescription = FEATURE_DESCRIPTIONS[feature] || ''
  
  // Determine which plan is needed for this feature
  const requiredPlan = feature === 'weather' || feature === 'airports' ? 'basic' : 'premium'
  const planName = requiredPlan === 'basic' ? 'Basic' : 'Pro'
  const planPrice = requiredPlan === 'basic' ? TIER_PRICES.basic : TIER_PRICES.premium

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mb-6">
          <Lock className="h-8 w-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {featureName} is a {planName} Feature
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          {featureDescription}
        </p>

        {/* Pricing Info */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {planPrice.price}
            </span>
            <span className="text-gray-600 ml-2">/{planPrice.period}</span>
          </div>
          {planPrice.monthlyPrice && (
            <p className="text-sm text-gray-500">
              Only {planPrice.monthlyPrice}
            </p>
          )}
        </div>

        {/* Benefits List */}
        <div className="text-left inline-block mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            Upgrade to {planName} and get:
          </h3>
          <ul className="space-y-2">
            {requiredPlan === 'basic' ? (
              <>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Weather & METAR/TAF access</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Complete airport database</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Account management</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Everything in Basic</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited flight logging</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Fleet & crew management</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cloud sync across devices</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">PDF logbook export</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/subscription/choose?feature=${feature}`}
            className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition ${
              requiredPlan === 'basic'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white'
            }`}
          >
            Upgrade to {planName}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          
          {currentTier === 'none' && (
            <Link
              href="/subscription/choose"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              View All Plans
            </Link>
          )}
        </div>

        {/* iOS Note */}
        <p className="text-sm text-gray-500 mt-6">
          Also available through iOS in-app purchase
        </p>
      </div>
    </div>
  )
}