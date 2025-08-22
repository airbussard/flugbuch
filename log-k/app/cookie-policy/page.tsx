import { Cookie, Shield, Settings, Database, Globe, AlertCircle, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Log-K
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
                Login
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-5 py-2 rounded-lg hover:from-blue-600 hover:to-violet-600 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie-Richtlinie</h1>
        <p className="text-gray-600 mb-8">Stand: Januar 2025</p>

        {/* iOS App Info */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
            <Shield className="h-6 w-6 text-green-500 mr-2" />
            iOS App - Keine Cookies
          </h2>
          <p className="text-gray-700">
            <strong>Die Log-K iOS App verwendet KEINE Cookies oder ähnliche Tracking-Technologien.</strong> 
            Alle Daten werden lokal auf Ihrem Gerät oder in Ihrer gesicherten Cloud gespeichert. 
            Es findet kein webbasiertes Tracking statt.
          </p>
        </div>

        {/* Was sind Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Cookie className="h-6 w-6 text-blue-500 mr-2" />
            1. Was sind Cookies?
          </h2>
          <p className="text-gray-700 mb-4">
            Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie Websites besuchen. 
            Sie werden verwendet, um Ihre Präferenzen zu speichern und die Benutzererfahrung zu verbessern.
          </p>
        </section>

        {/* Cookie-Nutzung in der iOS App */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Cookie-Nutzung in der Log-K iOS App</h2>
          <p className="text-gray-700 mb-4">
            Die Log-K iOS App ist eine native Applikation und verwendet keine Cookies im herkömmlichen Sinne. Stattdessen nutzen wir:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Database className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Core Data:</strong> Lokale Datenbank auf Ihrem iOS-Gerät</span>
            </li>
            <li className="flex items-start">
              <Settings className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>UserDefaults:</strong> Speicherung von App-Einstellungen</span>
            </li>
            <li className="flex items-start">
              <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Keychain:</strong> Sichere Speicherung von Anmeldedaten</span>
            </li>
            <li className="flex items-start">
              <Globe className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>CloudKit:</strong> Optionale iCloud-Synchronisation (nur bei Aktivierung)</span>
            </li>
          </ul>
        </section>

        {/* Website-Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Website-Cookies (log-k.com)</h2>
          <p className="text-gray-700 mb-4">Wenn Sie unsere Website besuchen, verwenden wir folgende Cookie-Arten:</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">3.1 Notwendige Cookies</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie-Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zweck</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speicherdauer</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">session_id</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Aufrechterhaltung der Benutzersitzung</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Sitzung</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">auth_token</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Authentifizierung angemeldeter Nutzer</td>
                      <td className="px-6 py-4 text-sm text-gray-700">7 Tage</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">cookie_consent</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Speicherung Ihrer Cookie-Einstellungen</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1 Jahr</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">language_preference</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Ihre bevorzugte Sprache</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1 Jahr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">3.2 Funktionale Cookies</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie-Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zweck</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speicherdauer</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">timezone</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Anzeige von Zeiten in UTC</td>
                      <td className="px-6 py-4 text-sm text-gray-700">30 Tage</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">display_mode</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Hell/Dunkel-Modus Präferenz</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1 Jahr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Drittanbieter-Dienste */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Drittanbieter-Dienste</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">4.1 Supabase (Authentifizierung & Datenbank)</h3>
              <p className="text-gray-600 mb-2">Supabase setzt technisch notwendige Cookies für die Authentifizierung:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>sb-access-token:</strong> Zugriffstoken für API-Anfragen</li>
                <li><strong>sb-refresh-token:</strong> Token zur Erneuerung der Sitzung</li>
              </ul>
              <p className="text-gray-600 mt-2">Diese Cookies sind essentiell für die Funktionalität der Cloud-Synchronisation.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">4.2 Apple (App Store & iCloud)</h3>
              <p className="text-gray-600">
                Bei der Nutzung von Apple-Diensten gelten die Cookie-Richtlinien von Apple. 
                Weitere Informationen: <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apple Datenschutz</a>
              </p>
            </div>
          </div>
        </section>

        {/* Keine Werbe-Cookies */}
        <section className="mb-10">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Keine Werbe-Cookies oder Tracking</h2>
            <p className="text-gray-700 mb-3 font-semibold">Wir verwenden KEINE:</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">Google Analytics oder andere Analyse-Tools</span>
              </li>
              <li className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">Facebook Pixel oder Social Media Tracking</span>
              </li>
              <li className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">Werbe-Cookies oder Retargeting</span>
              </li>
              <li className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">Cross-Site-Tracking</span>
              </li>
              <li className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-gray-700">Fingerprinting-Technologien</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Kontrolle über Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="h-6 w-6 text-blue-500 mr-2" />
            6. Ihre Kontrolle über Cookies
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">6.1 In der iOS App</h3>
              <p className="text-gray-600">Da die App keine Cookies verwendet, sind keine speziellen Einstellungen erforderlich.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">6.2 Auf der Website</h3>
              <p className="text-gray-600 mb-2">Sie können Cookies auf verschiedene Arten kontrollieren:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>Browser-Einstellungen:</strong> Blockieren Sie alle oder bestimmte Cookies</li>
                <li><strong>Cookie-Banner:</strong> Wählen Sie Ihre Präferenzen beim ersten Besuch</li>
                <li><strong>Löschen:</strong> Entfernen Sie vorhandene Cookies über Ihre Browser-Einstellungen</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">6.3 Browser-Anleitungen</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">Safari</a>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">Chrome</a>
                <a href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">Firefox</a>
                <a href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-löschen-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                   target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Edge</a>
              </div>
            </div>
          </div>
        </section>

        {/* Lokale Speicherung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Lokale Speicherung (Local Storage)</h2>
          <p className="text-gray-700 mb-3">Zusätzlich zu Cookies nutzt die Website möglicherweise Local Storage für:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
            <li>Temporäre Formulardaten</li>
            <li>UI-Präferenzen</li>
            <li>Offline-Funktionalität</li>
          </ul>
          <p className="text-gray-700 mt-3">Diese Daten bleiben auf Ihrem Gerät und werden nicht an Server übertragen.</p>
        </section>

        {/* Auswirkungen der Cookie-Deaktivierung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Auswirkungen der Cookie-Deaktivierung</h2>
          <p className="text-gray-700 mb-3">Wenn Sie Cookies deaktivieren:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Die iOS App funktioniert weiterhin normal</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Auf der Website können Sie sich möglicherweise nicht anmelden</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Ihre Präferenzen werden nicht gespeichert</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Einige Funktionen sind möglicherweise eingeschränkt</span>
            </li>
          </ul>
        </section>

        {/* Änderungen dieser Cookie-Richtlinie */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Änderungen dieser Cookie-Richtlinie</h2>
          <p className="text-gray-700">
            Wir können diese Cookie-Richtlinie gelegentlich aktualisieren. Wesentliche Änderungen werden auf der Website angekündigt. 
            Das Datum der letzten Aktualisierung finden Sie am Anfang dieses Dokuments.
          </p>
        </section>

        {/* Kontakt */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Kontakt bei Fragen</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-3">Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns bitte:</p>
            <p className="font-semibold">Fa. Oscar Knabe</p>
            <p className="text-gray-700">E-Mail: oscar.knabe@knmail.de</p>
            <p className="text-gray-700">Betreff: Cookie-Richtlinie Log-K</p>
          </div>
        </section>

        {/* Rechtsgrundlage */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Rechtsgrundlage</h2>
          <p className="text-gray-700 mb-3">Die Verwendung von Cookies erfolgt auf Basis von:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Ihre Einwilligung (für optionale Cookies)</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigtes Interesse (für notwendige Cookies)</li>
            <li><strong>§ 25 TTDSG:</strong> Telekommunikation-Telemedien-Datenschutz-Gesetz</li>
          </ul>
        </section>

        {/* Weitere Informationen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Weitere Informationen</h2>
          <p className="text-gray-700">
            Weitere Informationen zum Datenschutz finden Sie in unserer{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Datenschutzerklärung</Link>.
          </p>
          <p className="text-gray-700 mt-2">
            Allgemeine Informationen über Cookies:{' '}
            <a href="https://www.allaboutcookies.org/de/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              www.allaboutcookies.org
            </a>
          </p>
        </section>

        {/* Footer Links */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Startseite</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Datenschutz</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">AGB</Link>
            <Link href="/imprint" className="text-gray-600 hover:text-gray-900">Impressum</Link>
          </div>
        </div>
      </div>
    </div>
  )
}