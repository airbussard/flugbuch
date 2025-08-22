'use client'

import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { useCookieConsentOptional } from '@/providers/CookieConsentProvider'

export default function Footer() {
  // Use optional hook that returns null if provider is not available
  const consent = useCookieConsentOptional()
  const openSettings = consent?.openSettings || null

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Log-K
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional Pilot Logbook mit EASA/FAA Compliance
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link 
                  href="/imprint" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cookie-Richtlinie
                </Link>
              </li>
            </ul>
          </div>

          {/* Cookie Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Datenschutz
            </h3>
            {openSettings ? (
              <button
                onClick={openSettings}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Cookie className="h-4 w-4" />
                Cookie-Einstellungen
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium opacity-50"
              >
                <Cookie className="h-4 w-4" />
                Cookie-Einstellungen
              </button>
            )}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              Wir respektieren Ihre Privatsphäre und geben Ihnen die volle Kontrolle über Ihre Daten.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Log-K. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}