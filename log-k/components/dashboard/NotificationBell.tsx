'use client'

import { Bell, AlertTriangle, Calendar, Plane, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { format, differenceInDays, subDays } from 'date-fns'

interface NotificationBellProps {
  userProfile: {
    license_expiry?: string | null
    medical_expiry?: string | null
    line_check_expiry?: string | null
    opch_expiry?: string | null
    opca_expiry?: string | null
  }
  recentLandings: {
    dayLandings: number
    nightLandings: number
    totalLandings: number
  }
}

export default function NotificationBell({ userProfile, recentLandings }: NotificationBellProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [hasWarnings, setHasWarnings] = useState(false)

  useEffect(() => {
    const warnings: any[] = []
    const today = new Date()
    const ninetyDaysAgo = subDays(today, 90)

    // Check license expiry
    if (userProfile.license_expiry) {
      const expiryDate = new Date(userProfile.license_expiry)
      const daysUntilExpiry = differenceInDays(expiryDate, today)
      
      if (daysUntilExpiry <= 0) {
        warnings.push({
          type: 'error',
          icon: AlertTriangle,
          title: 'License Expired',
          message: `Your license expired ${Math.abs(daysUntilExpiry)} days ago`,
          date: userProfile.license_expiry
        })
      } else if (daysUntilExpiry <= 30) {
        warnings.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'License Expiring Soon',
          message: `Your license expires in ${daysUntilExpiry} days`,
          date: userProfile.license_expiry
        })
      }
    }

    // Check medical expiry
    if (userProfile.medical_expiry) {
      const expiryDate = new Date(userProfile.medical_expiry)
      const daysUntilExpiry = differenceInDays(expiryDate, today)
      
      if (daysUntilExpiry <= 0) {
        warnings.push({
          type: 'error',
          icon: AlertTriangle,
          title: 'Medical Expired',
          message: `Your medical expired ${Math.abs(daysUntilExpiry)} days ago`,
          date: userProfile.medical_expiry
        })
      } else if (daysUntilExpiry <= 30) {
        warnings.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Medical Expiring Soon',
          message: `Your medical expires in ${daysUntilExpiry} days`,
          date: userProfile.medical_expiry
        })
      }
    }

    // Check line check expiry
    if (userProfile.line_check_expiry) {
      const expiryDate = new Date(userProfile.line_check_expiry)
      const daysUntilExpiry = differenceInDays(expiryDate, today)
      
      if (daysUntilExpiry <= 0) {
        warnings.push({
          type: 'error',
          icon: AlertTriangle,
          title: 'Line Check Expired',
          message: `Your line check expired ${Math.abs(daysUntilExpiry)} days ago`,
          date: userProfile.line_check_expiry
        })
      } else if (daysUntilExpiry <= 30) {
        warnings.push({
          type: 'warning',
          icon: Calendar,
          title: 'Line Check Due',
          message: `Your line check expires in ${daysUntilExpiry} days`,
          date: userProfile.line_check_expiry
        })
      }
    }

    // Check recent landings (regulatory requirement: 3 landings in 90 days)
    if (recentLandings.totalLandings < 3) {
      warnings.push({
        type: 'warning',
        icon: Plane,
        title: 'Landing Currency',
        message: `Only ${recentLandings.totalLandings} landing${recentLandings.totalLandings !== 1 ? 's' : ''} in last 90 days (3 required)`,
        details: `Day: ${recentLandings.dayLandings}, Night: ${recentLandings.nightLandings}`
      })
    }

    // Add normal status items
    const statusItems = []

    // License status
    if (userProfile.license_expiry) {
      const expiryDate = new Date(userProfile.license_expiry)
      const daysUntilExpiry = differenceInDays(expiryDate, today)
      if (daysUntilExpiry > 30) {
        statusItems.push({
          type: 'info',
          icon: CheckCircle,
          title: 'License',
          message: `Valid until ${format(expiryDate, 'dd MMM yyyy')}`,
          date: userProfile.license_expiry
        })
      }
    }

    // Medical status
    if (userProfile.medical_expiry) {
      const expiryDate = new Date(userProfile.medical_expiry)
      const daysUntilExpiry = differenceInDays(expiryDate, today)
      if (daysUntilExpiry > 30) {
        statusItems.push({
          type: 'info',
          icon: CheckCircle,
          title: 'Medical',
          message: `Valid until ${format(expiryDate, 'dd MMM yyyy')}`,
          date: userProfile.medical_expiry
        })
      }
    }

    // Landing currency status
    if (recentLandings.totalLandings >= 3) {
      statusItems.push({
        type: 'success',
        icon: Plane,
        title: 'Landing Currency',
        message: `${recentLandings.totalLandings} landings in last 90 days`,
        details: `Day: ${recentLandings.dayLandings}, Night: ${recentLandings.nightLandings}`
      })
    }

    setNotifications([...warnings, ...statusItems])
    setHasWarnings(warnings.length > 0)
  }, [userProfile, recentLandings])

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
      >
        <Bell className="h-6 w-6" />
        {hasWarnings && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications & Status</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification, index) => {
                const Icon = notification.icon
                return (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        notification.type === 'error' ? 'text-red-500' :
                        notification.type === 'warning' ? 'text-amber-500' :
                        notification.type === 'success' ? 'text-green-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        {notification.details && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/settings"
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              Update expiry dates in Settings →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}