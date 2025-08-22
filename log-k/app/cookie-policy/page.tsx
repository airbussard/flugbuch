import { Metadata } from 'next'
import { Cookie, Shield, Settings, BarChart3, Megaphone, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie-Richtlinie - Log-K',
  description: 'Informationen über die Verwendung von Cookies auf unserer Website',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück zur Startseite
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cookie-Richtlinie
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Was sind Cookies?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies sind kleine Textdateien, die auf Ihrem Computer oder mobilen Gerät gespeichert werden, 
              wenn Sie unsere Website besuchen. Sie helfen uns dabei, Ihre Präferenzen zu speichern, 
              die Website-Funktionalität zu verbessern und Ihr Nutzererlebnis zu personalisieren.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Cookie-Kategorien</h2>
            
            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Notwendige Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Diese Cookies sind für die Grundfunktionen der Website unerlässlich. 
                      Ohne sie kann die Website nicht ordnungsgemäß funktionieren.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">sb-auth-token</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Authentifizierung und Sitzungsverwaltung
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Gültigkeit: 7 Tage
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">cookie-consent</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Speichert Ihre Cookie-Einstellungen
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Gültigkeit: 1 Jahr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Funktionale Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung, 
                      wie z.B. das Speichern Ihrer Präferenzen.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">theme</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Speichert Ihre Theme-Präferenz (Hell/Dunkel)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Gültigkeit: 1 Jahr
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">language</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Speichert Ihre Spracheinstellung
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Gültigkeit: 1 Jahr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Analyse-Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                      indem sie Informationen anonym sammeln und melden.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Google Analytics</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Sammelt anonyme Statistiken über Website-Besuche
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Gültigkeit: 2 Jahre
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Megaphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Marketing-Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Diese Cookies werden verwendet, um Werbung zu liefern, 
                      die für Sie und Ihre Interessen relevanter ist.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Derzeit verwenden wir keine Marketing-Cookies auf unserer Website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Ihre Rechte</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie haben das Recht:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  Ihre Einwilligung jederzeit zu widerrufen
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  Cookies in Ihrem Browser zu blockieren oder zu löschen
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  Detaillierte Informationen über die von uns verwendeten Cookies zu erhalten
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  Ihre Cookie-Präferenzen anzupassen
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cookie-Einstellungen verwalten</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie auf den Button 
              "Cookie-Einstellungen" in der Fußzeile unserer Website klicken oder die 
              Cookie-Einstellungen in Ihrem Browser anpassen.
            </p>
            <button
              onClick={() => {
                // This will be handled by the cookie consent manager
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-cookie-settings'))
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Cookie className="h-5 w-5" />
              Cookie-Einstellungen öffnen
            </button>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Bei Fragen zu unserer Cookie-Richtlinie können Sie uns kontaktieren:
            </p>
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-Mail:</strong> privacy@log-k.com<br />
                <strong>Adresse:</strong> Log-K GmbH, Musterstraße 1, 12345 Berlin
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Änderungen dieser Richtlinie</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren. 
              Die aktuelle Version ist immer auf dieser Seite verfügbar. 
              Bei wesentlichen Änderungen werden wir Sie über eine Benachrichtigung 
              auf unserer Website informieren.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}