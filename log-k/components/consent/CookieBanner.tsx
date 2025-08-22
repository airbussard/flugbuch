'use client'

import { useCookieConsentOptional } from '@/providers/CookieConsentProvider'
import { Cookie, Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const consent = useCookieConsentOptional()
  
  // Return null if provider is not available
  if (!consent) {
    return null
  }
  
  const { 
    showBanner, 
    acceptAll, 
    acceptNecessaryOnly, 
    openSettings,
    closeBanner 
  } = consent

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
              {/* Decorative gradient */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                        <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Wir verwenden Cookies
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Für ein optimales Erlebnis auf unserer Website
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeBanner}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Banner schließen"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="prose prose-sm text-gray-600 dark:text-gray-300 mb-6">
                  <p>
                    Wir nutzen Cookies und ähnliche Technologien, um unsere Website zu betreiben, 
                    Ihre Präferenzen zu speichern und unsere Dienste zu verbessern. Einige Cookies 
                    sind technisch notwendig, während andere uns helfen, Ihr Nutzererlebnis zu 
                    personalisieren und zu analysieren.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    Alle akzeptieren
                  </button>
                  
                  <button
                    onClick={acceptNecessaryOnly}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all transform hover:scale-[1.02]"
                  >
                    Nur notwendige
                  </button>
                  
                  <button
                    onClick={openSettings}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Einstellungen
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <a 
                    href="/privacy" 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                  >
                    Datenschutzerklärung
                  </a>
                  <a 
                    href="/cookie-policy" 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                  >
                    Cookie-Richtlinie
                  </a>
                  <a 
                    href="/imprint" 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                  >
                    Impressum
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}