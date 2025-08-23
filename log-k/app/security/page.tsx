import { Shield, Lock, Key, Database, Cloud, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sicherheit & Datenschutz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Ihre Daten sind bei uns sicher. Wir setzen modernste Sicherheitsstandards ein, 
            um Ihre persönlichen Informationen und Flugdaten zu schützen.
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ende-zu-Ende Verschlüsselung
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Alle Datenübertragungen sind mit TLS 1.3 verschlüsselt. Ihre Daten sind während der Übertragung vollständig geschützt.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <Key className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sichere Authentifizierung
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Multi-Faktor-Authentifizierung und sichere Session-Verwaltung schützen Ihr Konto vor unbefugtem Zugriff.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Datenisolierung
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Row-Level Security stellt sicher, dass nur Sie auf Ihre eigenen Daten zugreifen können.
            </p>
          </div>
        </div>

        {/* Detailed Security Measures */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Unsere Sicherheitsmaßnahmen im Detail
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Datenverschlüsselung
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>TLS 1.3 Verschlüsselung für alle Datenübertragungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verschlüsselte Datenspeicherung in der Cloud-Infrastruktur</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sichere API-Kommunikation mit JWT-Token-Authentifizierung</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Zugriffskontrollen
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Row-Level Security (RLS) für strikte Datenisolierung zwischen Benutzern</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Rollenbasierte Zugriffskontrolle (RBAC) für administrative Funktionen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Automatische Session-Timeouts bei Inaktivität</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Infrastruktur-Sicherheit
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Hosting in ISO 27001 zertifizierten Rechenzentren</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Regelmäßige automatische Backups mit Point-in-Time Recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>DDoS-Schutz und Web Application Firewall (WAF)</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Anwendungssicherheit
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Parameterisierte SQL-Abfragen zum Schutz vor SQL-Injection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Input-Validierung und Sanitization aller Benutzereingaben</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Content Security Policy (CSP) zum Schutz vor XSS-Angriffen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection Principles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Datenschutzgrundsätze
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Datensparsamkeit
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Wir erheben nur die Daten, die für den Betrieb des Dienstes notwendig sind.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Datenhoheit
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sie behalten die volle Kontrolle über Ihre Daten und können diese jederzeit exportieren oder löschen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Transparenz
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vollständige Transparenz über die Verarbeitung Ihrer Daten gemäß DSGVO.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Zweckbindung
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ihre Daten werden ausschließlich für den angegebenen Zweck verwendet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Compliance & Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Wir erfüllen folgende Standards:
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>DSGVO / GDPR konform</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>ISO 27001 Standards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>SOC 2 Type II Compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>OWASP Security Guidelines</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Regelmäßige Überprüfungen:
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Jährliche Sicherheitsaudits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Penetrationstests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Code-Reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Vulnerability Scanning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Incident Response */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Sicherheitsvorfälle
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Im unwahrscheinlichen Fall eines Sicherheitsvorfalls:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Sofortige Benachrichtigung betroffener Nutzer innerhalb von 72 Stunden</li>
                <li>• Transparente Kommunikation über Art und Umfang des Vorfalls</li>
                <li>• Umgehende Einleitung von Gegenmaßnahmen</li>
                <li>• Vollständige Dokumentation und Meldung an Aufsichtsbehörden</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}