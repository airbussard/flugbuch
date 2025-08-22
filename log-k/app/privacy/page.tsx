import Link from 'next/link'
import { Shield, Lock, Database, Globe, Mail, FileText, AlertCircle, CheckCircle } from 'lucide-react'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
        <p className="text-gray-600 mb-8">Stand: Januar 2025</p>

        {/* Verantwortlicher */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            1. Verantwortlicher
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold">Fa. Oscar Knabe</p>
            <p>Steinstraße 71</p>
            <p>52249 Eschweiler</p>
            <p>Deutschland</p>
            <p className="mt-2">E-Mail: oscar.knabe@knmail.de</p>
            <p>USt-IdNr.: DE346449523</p>
            <p>Steuernummer: 220/5202/3200</p>
          </div>
        </section>

        {/* Übersicht der Verarbeitungen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Übersicht der Verarbeitungen</h2>
          <p className="text-gray-700 mb-4">
            Log-K ist ein digitales Flugbuch für professionelle Piloten. Diese Datenschutzerklärung informiert Sie über die Art, 
            den Umfang und die Zwecke der Erhebung und Verwendung personenbezogener Daten.
          </p>
        </section>

        {/* Rechtsgrundlagen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Rechtsgrundlagen</h2>
          <p className="text-gray-700 mb-4">Die Verarbeitung personenbezogener Daten erfolgt auf Basis folgender Rechtsgrundlagen:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung der betroffenen Person</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Erfüllung eines Vertrags</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Erfüllung rechtlicher Verpflichtungen</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700"><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Wahrung berechtigter Interessen</span>
            </li>
          </ul>
        </section>

        {/* Welche Daten werden verarbeitet */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="h-6 w-6 text-blue-500 mr-2" />
            4. Welche Daten werden verarbeitet?
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.1 Benutzerkontodaten</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Name und Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Pilotenlizenz-Informationen</li>
                <li>Benutzername (optional)</li>
                <li>Profilbild (optional)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.2 Flugdaten</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Flugdatum und -zeiten</li>
                <li>Start- und Zielflughafen</li>
                <li>Flugzeugtyp und Registrierung</li>
                <li>Flugstunden und Landungen</li>
                <li>Crew-Informationen</li>
                <li>Wetterdaten (METAR/TAF)</li>
                <li>Anflugarten und IFR/VFR-Informationen</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.3 Technische Daten</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Geräte-ID (anonymisiert)</li>
                <li>App-Version</li>
                <li>iOS-Version</li>
                <li>Zeitstempel von Synchronisierungen</li>
                <li>IP-Adresse (nur während der Übertragung)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Zweck der Datenverarbeitung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Zweck der Datenverarbeitung</h2>
          <p className="text-gray-700 mb-4">Ihre Daten werden ausschließlich zu folgenden Zwecken verarbeitet:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
            <li>Bereitstellung der App-Funktionalitäten</li>
            <li>Verwaltung Ihres digitalen Flugbuchs</li>
            <li>Synchronisation zwischen Geräten</li>
            <li>Erstellung von Berichten und Statistiken</li>
            <li>Einhaltung gesetzlicher Aufbewahrungspflichten (EASA/FAA)</li>
            <li>Kundenservice und Support</li>
            <li>Verbesserung der App-Qualität</li>
          </ul>
        </section>

        {/* Datenspeicherung und -sicherheit */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="h-6 w-6 text-blue-500 mr-2" />
            6. Datenspeicherung und -sicherheit
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">6.1 Lokale Speicherung</h3>
              <p className="text-gray-600">
                Ihre Flugdaten werden primär lokal auf Ihrem iOS-Gerät in einer verschlüsselten Core Data Datenbank gespeichert.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">6.2 Cloud-Synchronisation (Supabase)</h3>
              <p className="text-gray-600 mb-3">Bei aktivierter Cloud-Synchronisation werden Ihre Daten zusätzlich bei unserem Dienstleister Supabase gespeichert:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Server-Standort: EU (Frankfurt)</li>
                <li>Verschlüsselung: TLS 1.3 bei Übertragung, AES-256 bei Speicherung</li>
                <li>Row-Level Security (RLS) für Datenisolierung</li>
                <li>Regelmäßige Backups</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">6.3 Apple CloudKit (optional)</h3>
              <p className="text-gray-600">
                Bei Nutzung der iCloud-Synchronisation werden Daten gemäß Apples Datenschutzrichtlinien verarbeitet.
              </p>
            </div>
          </div>
        </section>

        {/* Datenübermittlung an Dritte */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Globe className="h-6 w-6 text-blue-500 mr-2" />
            7. Datenübermittlung an Dritte
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">7.1 Dienstleister</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>Supabase Inc.:</strong> Cloud-Datenbank und Authentifizierung (EU-Server)</li>
                <li><strong>Apple Inc.:</strong> App-Distribution und optionale iCloud-Synchronisation</li>
                <li><strong>NOAA Weather Service:</strong> Abruf von Wetterdaten (nur ICAO-Codes übermittelt)</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="text-xl font-medium text-gray-700 mb-2">7.2 Keine Weitergabe zu Werbezwecken</h3>
              <p className="text-gray-600">
                Ihre personenbezogenen Daten werden niemals zu Werbezwecken an Dritte verkauft oder weitergegeben.
              </p>
            </div>
          </div>
        </section>

        {/* Speicherdauer */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Speicherdauer</h2>
          <ul className="space-y-2">
            <li className="text-gray-700"><strong>Flugdaten:</strong> Gemäß gesetzlicher Aufbewahrungspflichten (EASA: 36 Monate, FAA: 60 Monate)</li>
            <li className="text-gray-700"><strong>Kontodaten:</strong> Bis zur Löschung des Benutzerkontos</li>
            <li className="text-gray-700"><strong>Technische Logs:</strong> Maximal 30 Tage</li>
            <li className="text-gray-700"><strong>Backups:</strong> 90 Tage nach Erstellung</li>
          </ul>
        </section>

        {/* Ihre Rechte */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-2" />
            9. Ihre Rechte
          </h2>
          <p className="text-gray-700 mb-4">Nach der DSGVO stehen Ihnen folgende Rechte zu:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Auskunftsrecht (Art. 15 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können Auskunft über Ihre verarbeiteten Daten verlangen</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Berichtigungsrecht (Art. 16 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können die Berichtigung unrichtiger Daten verlangen</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Löschungsrecht (Art. 17 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können die Löschung Ihrer Daten verlangen</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Einschränkungsrecht (Art. 18 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können die Einschränkung der Verarbeitung verlangen</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Datenübertragbarkeit (Art. 20 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können Ihre Daten in einem strukturierten Format erhalten</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h4>
              <p className="text-gray-600 text-sm">Sie können der Verarbeitung widersprechen</p>
            </div>
          </div>
        </section>

        {/* Weitere wichtige Informationen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Weitere wichtige Informationen</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">Datenexport und -löschung in der App</h3>
              <p className="text-gray-600 mb-2">Sie können jederzeit:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Ihre Flugdaten als CSV oder PDF exportieren</li>
                <li>Einzelne Flüge oder Datensätze löschen</li>
                <li>Ihr gesamtes Konto inkl. aller Daten löschen</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">Minderjährigenschutz</h3>
              <p className="text-gray-600">
                Die App richtet sich an professionelle Piloten und ist nicht für Personen unter 16 Jahren bestimmt.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">Cookies und Tracking</h3>
              <p className="text-gray-600">
                Die iOS-App verwendet keine Cookies oder Tracking-Technologien. Es werden keine Werbe-IDs erfasst oder Nutzerverhalten zu Werbezwecken analysiert.
              </p>
            </div>
          </div>
        </section>

        {/* Beschwerderecht */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 text-blue-500 mr-2" />
            11. Beschwerderecht
          </h2>
          <p className="text-gray-700 mb-4">Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren:</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold">Landesbeauftragte für Datenschutz und Informationsfreiheit NRW</p>
            <p>Postfach 20 04 44</p>
            <p>40102 Düsseldorf</p>
            <p className="mt-2">Tel.: 0211/38424-0</p>
            <p>E-Mail: poststelle@ldi.nrw.de</p>
          </div>
        </section>

        {/* Kontakt */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            12. Kontakt
          </h2>
          <p className="text-gray-700 mb-4">Bei Fragen zum Datenschutz wenden Sie sich bitte an:</p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700">E-Mail: oscar.knabe@knmail.de</p>
            <p className="text-gray-700">Betreff: Datenschutz Log-K</p>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Startseite</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">AGB</Link>
            <Link href="/imprint" className="text-gray-600 hover:text-gray-900">Impressum</Link>
            <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900">Cookie-Richtlinie</Link>
          </div>
        </div>
      </div>
    </div>
  )
}