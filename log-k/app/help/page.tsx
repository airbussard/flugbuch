import Link from 'next/link'
import { FileText, Headphones, ArrowRight } from 'lucide-react'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Wie können wir Ihnen helfen?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Documentation - Active */}
          <Link 
            href="/docs"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Documentation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Umfassende Anleitungen und Informationen zu allen Funktionen von Log-K
            </p>
            <div className="mt-4">
              <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                Zur Dokumentation →
              </span>
            </div>
          </Link>

          {/* Support System - Disabled */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Headphones className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Support System
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Direkter Support durch unser Expertenteam. Ticket-System und Live-Chat.
              </p>
              <div className="mt-4">
                <span className="text-gray-400 dark:text-gray-500 font-medium">
                  Demnächst verfügbar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Häufige Themen
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/docs#erste-schritte"
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Erste Schritte
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Konto einrichten und erste Flüge eintragen
              </p>
            </Link>
            <Link 
              href="/docs/web#synchronisation"
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Synchronisation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daten zwischen Geräten synchronisieren
              </p>
            </Link>
            <Link 
              href="/docs#subscription-plans"
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Abonnements
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preise und Funktionen der verschiedenen Pläne
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}