'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp?: string
  version?: string
}

interface CookieConsentContextType {
  consent: CookieConsent
  hasUserConsented: boolean
  showBanner: boolean
  showSettings: boolean
  acceptAll: () => void
  acceptNecessaryOnly: () => void
  updateConsent: (consent: Partial<CookieConsent>) => void
  openSettings: () => void
  closeSettings: () => void
  closeBanner: () => void
  revokeConsent: () => void
  checkConsent: (category: CookieCategory) => boolean
}

const defaultConsent: CookieConsent = {
  necessary: true, // Always true as these are required
  functional: false,
  analytics: false,
  marketing: false,
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const CONSENT_KEY = 'cookie-consent'
const CONSENT_VERSION = '1.0.0'

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent)
  const [hasUserConsented, setHasUserConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Load consent from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem(CONSENT_KEY)
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsent
        // Check if consent version matches
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed)
          setHasUserConsented(true)
          applyConsent(parsed)
        } else {
          // Version mismatch, show banner again
          setShowBanner(true)
        }
      } catch (error) {
        console.error('Failed to parse cookie consent:', error)
        setShowBanner(true)
      }
    } else {
      // No consent stored, show banner
      setShowBanner(true)
    }
  }, [])

  // Apply consent settings (block/allow scripts)
  const applyConsent = (newConsent: CookieConsent) => {
    // This is where you would enable/disable tracking scripts
    if (typeof window !== 'undefined') {
      // Example: Google Analytics
      if (newConsent.analytics) {
        // Enable GA
        (window as any).gtag?.('consent', 'update', {
          'analytics_storage': 'granted'
        })
      } else {
        // Disable GA
        (window as any).gtag?.('consent', 'update', {
          'analytics_storage': 'denied'
        })
      }

      // Example: Marketing/Advertising
      if (newConsent.marketing) {
        (window as any).gtag?.('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        })
      } else {
        (window as any).gtag?.('consent', 'update', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        })
      }
    }
  }

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithMeta = {
      ...newConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    }
    
    setConsent(consentWithMeta)
    setHasUserConsented(true)
    setShowBanner(false)
    setShowSettings(false)
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithMeta))
    applyConsent(consentWithMeta)
  }

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(fullConsent)
  }

  const acceptNecessaryOnly = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    saveConsent(minimalConsent)
  }

  const updateConsent = (partialConsent: Partial<CookieConsent>) => {
    const newConsent = {
      ...consent,
      ...partialConsent,
      necessary: true, // Always keep necessary cookies
    }
    saveConsent(newConsent)
  }

  const openSettings = () => {
    setShowSettings(true)
    setShowBanner(false)
  }

  const closeSettings = () => {
    setShowSettings(false)
    if (!hasUserConsented) {
      setShowBanner(true)
    }
  }

  const closeBanner = () => {
    setShowBanner(false)
  }

  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY)
    setConsent(defaultConsent)
    setHasUserConsented(false)
    setShowBanner(true)
    applyConsent(defaultConsent)
  }

  const checkConsent = (category: CookieCategory): boolean => {
    return consent[category] || false
  }

  if (!isClient) {
    return <>{children}</>
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasUserConsented,
        showBanner,
        showSettings,
        acceptAll,
        acceptNecessaryOnly,
        updateConsent,
        openSettings,
        closeSettings,
        closeBanner,
        revokeConsent,
        checkConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}

// Optional hook that returns null if provider is not available
export function useCookieConsentOptional() {
  const context = useContext(CookieConsentContext)
  return context
}