'use client'

import { useState, useEffect } from 'react'
import { useCookieConsent, CookieConsent } from '@/providers/CookieConsentProvider'
import { X, Shield, Settings, BarChart3, Megaphone, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CookieCategory {
  id: keyof CookieConsent
  name: string
  description: string
  icon: React.ReactNode
  required: boolean
  cookies: { name: string; purpose: string; duration: string }[]
}

const categories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Notwendige Cookies',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    icon: <Shield className="h-5 w-5" />,
    required: true,
    cookies: [
      { name: 'sb-auth-token', purpose: 'Authentifizierung und Sitzungsverwaltung', duration: '7 Tage' },
      { name: 'sb-refresh-token', purpose: 'Sitzungserneuerung', duration: '30 Tage' },
      { name: 'cookie-consent', purpose: 'Speichert Ihre Cookie-Einstellungen', duration: '1 Jahr' },
    ]
  },
  {
    id: 'functional',
    name: 'Funktionale Cookies',
    description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
    icon: <Settings className="h-5 w-5" />,
    required: false,
    cookies: [
      { name: 'theme', purpose: 'Speichert Ihre Theme-Präferenz (Hell/Dunkel)', duration: '1 Jahr' },
      { name: 'language', purpose: 'Speichert Ihre Spracheinstellung', duration: '1 Jahr' },
      { name: 'sidebar-state', purpose: 'Speichert den Zustand der Seitenleiste', duration: '30 Tage' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analyse-Cookies',
    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
    icon: <BarChart3 className="h-5 w-5" />,
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Google Analytics - Unterscheidung von Besuchern', duration: '2 Jahre' },
      { name: '_ga_*', purpose: 'Google Analytics - Sitzungs- und Kampagnen-Daten', duration: '2 Jahre' },
      { name: '_gid', purpose: 'Google Analytics - Unterscheidung von Besuchern', duration: '24 Stunden' },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing-Cookies',
    description: 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu machen.',
    icon: <Megaphone className="h-5 w-5" />,
    required: false,
    cookies: [
      { name: 'fbp', purpose: 'Facebook Pixel - Tracking für Werbezwecke', duration: '90 Tage' },
      { name: 'fr', purpose: 'Facebook - Anzeigenrelevanz', duration: '90 Tage' },
    ]
  }
]

export default function CookieSettings() {
  const { 
    showSettings, 
    consent, 
    updateConsent, 
    closeSettings,
    acceptAll,
    acceptNecessaryOnly 
  } = useCookieConsent()
  
  const [localConsent, setLocalConsent] = useState(consent)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  useEffect(() => {
    setLocalConsent(consent)
  }, [consent])

  const handleToggle = (category: keyof CookieConsent) => {
    if (category === 'necessary') return // Can't toggle necessary cookies
    
    setLocalConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleSave = () => {
    updateConsent(localConsent)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cookie-Einstellungen
                  </h2>
                  <button
                    onClick={closeSettings}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Schließen"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Hier können Sie Ihre Cookie-Einstellungen verwalten. Wir respektieren Ihre Privatsphäre 
                    und geben Ihnen die volle Kontrolle über Ihre Daten.
                  </p>

                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="flex-1 flex items-center space-x-3 text-left"
                            >
                              <div className={`p-2 rounded-lg ${
                                localConsent[category.id]
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {category.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {category.description}
                                </p>
                              </div>
                            </button>
                            
                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleToggle(category.id)}
                              disabled={category.required}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                category.required
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              } ${
                                localConsent[category.id]
                                  ? 'bg-blue-600'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                              aria-label={`${category.name} ${localConsent[category.id] ? 'deaktivieren' : 'aktivieren'}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  localConsent[category.id] ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Cookie Details (Expandable) */}
                          {expandedCategories.includes(category.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Verwendete Cookies:
                              </h4>
                              <div className="space-y-2">
                                {category.cookies.map((cookie, index) => (
                                  <div
                                    key={index}
                                    className="bg-white dark:bg-gray-900 rounded-lg p-3 text-sm"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {cookie.name}
                                        </span>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                                          {cookie.purpose}
                                        </p>
                                      </div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                        {cookie.duration}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        acceptAll()
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                    >
                      Alle aktivieren
                    </button>
                    
                    <button
                      onClick={() => {
                        acceptNecessaryOnly()
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                    >
                      Nur notwendige
                    </button>
                    
                    <button
                      onClick={handleSave}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Auswahl speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}