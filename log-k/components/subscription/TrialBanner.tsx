'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Zap, AlertTriangle } from 'lucide-react'

interface TrialBannerProps {
  daysRemaining: number
  onDismiss?: () => void
}

export default function TrialBanner({ daysRemaining, onDismiss }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Determine urgency level
  const urgencyLevel = daysRemaining <= 3 ? 'critical' : 
                       daysRemaining <= 7 ? 'urgent' : 
                       daysRemaining <= 14 ? 'warning' : 
                       'info'

  // Don't show if dismissed
  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    // Store dismissal in sessionStorage (reappears on next session)
    sessionStorage.setItem('trial-banner-dismissed', 'true')
    onDismiss?.()
  }

  // Check if previously dismissed in this session
  useEffect(() => {
    if (sessionStorage.getItem('trial-banner-dismissed') === 'true') {
      setIsDismissed(true)
    }
  }, [])

  // Style based on urgency
  const styles = {
    critical: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-900',
      subtext: 'text-red-700',
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 text-white'
    },
    urgent: {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-900',
      subtext: 'text-orange-700',
      icon: 'text-orange-500',
      button: 'bg-orange-600 hover:bg-orange-700 text-white'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-900',
      subtext: 'text-yellow-700',
      icon: 'text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      subtext: 'text-blue-700',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }[urgencyLevel]

  // Message based on days remaining
  const getMessage = () => {
    if (daysRemaining <= 0) {
      return {
        title: 'Trial Expired',
        subtitle: 'Your trial has ended. Upgrade now to continue using Log-K.',
        cta: 'Upgrade Now'
      }
    } else if (daysRemaining === 1) {
      return {
        title: 'Last Day of Trial!',
        subtitle: 'Your trial expires tomorrow. Don\'t lose access to your flight data!',
        cta: 'Upgrade Now'
      }
    } else if (daysRemaining <= 3) {
      return {
        title: `Only ${daysRemaining} Days Left!`,
        subtitle: 'Your trial is about to expire. Upgrade now and save 20%!',
        cta: 'Upgrade & Save 20%'
      }
    } else if (daysRemaining <= 7) {
      return {
        title: `${daysRemaining} Days Remaining`,
        subtitle: 'Your trial ends soon. Upgrade early for a special discount!',
        cta: 'Get Early Bird Discount'
      }
    } else if (daysRemaining <= 14) {
      return {
        title: `Trial: ${daysRemaining} Days Left`,
        subtitle: 'Enjoying Log-K? Upgrade anytime to unlock all features.',
        cta: 'View Plans'
      }
    } else {
      return {
        title: `Trial Version (${daysRemaining} days)`,
        subtitle: 'You\'re using the trial version of Log-K.',
        cta: 'View Plans'
      }
    }
  }

  const message = getMessage()
  const Icon = urgencyLevel === 'critical' ? AlertTriangle : 
                urgencyLevel === 'urgent' ? Clock : 
                Zap

  return (
    <div className={`${styles.bg} border rounded-lg p-3 sm:p-4 mb-4 relative`}>
      <div className="flex items-start sm:items-center">
        <Icon className={`${styles.icon} h-5 w-5 mr-3 flex-shrink-0 mt-0.5 sm:mt-0`} />
        <div className="flex-1 min-w-0">
          <p className={`${styles.text} font-semibold text-sm sm:text-base`}>
            {message.title}
          </p>
          <p className={`${styles.subtext} text-xs sm:text-sm mt-0.5`}>
            {message.subtitle}
          </p>
        </div>
        <div className="flex items-center ml-4 space-x-2">
          <a
            href="/subscription/choose"
            className={`${styles.button} px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition whitespace-nowrap inline-block text-center`}
          >
            {message.cta}
          </a>
          {daysRemaining > 7 && (
            <button
              onClick={handleDismiss}
              className={`${styles.subtext} hover:${styles.text} p-1`}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Special offers for different stages */}
      {daysRemaining > 7 && daysRemaining <= 14 && (
        <div className="mt-3 pt-3 border-t border-current opacity-30">
          <p className={`${styles.subtext} text-xs`}>
            💡 Tip: Users who upgrade in the first 2 weeks save an average of 20% with our early bird discount.
          </p>
        </div>
      )}
    </div>
  )
}