import Link from 'next/link'
import { FileText, Shield, CreditCard, AlertTriangle, Users, Scale, Mail, CheckCircle } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-gray-600 mb-8">Stand: Januar 2025</p>

        {/* § 1 Geltungsbereich */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Scale className="h-6 w-6 text-blue-500 mr-2" />
            § 1 Geltungsbereich
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge zwischen:</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold">Fa. Oscar Knabe (nachfolgend "Anbieter")</p>
              <p>Steinstraße 71</p>
              <p>52249 Eschweiler</p>
              <p>Deutschland</p>
              <p className="mt-2">E-Mail: oscar.knabe@knmail.de</p>
              <p>USt-IdNr.: DE346449523</p>
              <p>Steuernummer: 220/5202/3200</p>
            </div>
            <p>und den Nutzern (nachfolgend "Kunde") der mobilen Applikation "Log-K" sowie der Website log-k.com.</p>
            <p>(2) Die App ist ein digitales Flugbuch für professionelle Piloten zur Erfassung, Verwaltung und Auswertung von Flugdaten gemäß EASA und FAA Regularien.</p>
            <p>(3) Abweichende, entgegenstehende oder ergänzende AGB werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.</p>
          </div>
        </section>

        {/* § 2 Vertragsschluss */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 2 Vertragsschluss</h2>
          <div className="space-y-4 text-gray-700">
            <p>(1) Die Darstellung der App im Apple App Store sowie auf der Website stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar.</p>
            <p>(2) Der Vertrag kommt durch Download und Installation der App sowie Akzeptierung dieser AGB oder durch Registrierung auf der Website zustande.</p>
            <p>(3) Für kostenpflichtige Abonnements erfolgt der Vertragsschluss mit Bestätigung der Zahlung über Apple In-App-Purchase oder über die Website.</p>
            <p>(4) Die Vertragssprache ist Deutsch. Der Vertragstext wird vom Anbieter gespeichert und kann vom Kunden jederzeit eingesehen werden.</p>
          </div>
        </section>

        {/* § 3 Leistungsumfang */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-2" />
            § 3 Leistungsumfang
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">3.1 Kostenlose Testphase</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-gray-700">(1) Neue Nutzer erhalten eine 4-wöchige kostenlose Testphase mit vollem Funktionsumfang.</p>
                <p className="text-gray-700">(2) Nach Ablauf der Testphase wird der Zugang auf die Basisfunktionen beschränkt, sofern kein kostenpflichtiges Abonnement abgeschlossen wird.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">3.2 Funktionsumfang</h3>
              <p className="text-gray-700 mb-3">Die App bietet folgende Hauptfunktionen:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Erfassung und Verwaltung von Flugdaten</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">EASA/FAA-konforme Logbuchführung</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Verwaltung von Flugzeugen und Crew</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Wetterinformationen (METAR/TAF)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Statistiken und Auswertungen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">PDF-Export von Logbüchern</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cloud-Synchronisation (bei Abonnement)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Multi-Device-Support (bei Abonnement)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">3.3 Verfügbarkeit</h3>
              <p className="text-gray-700">(1) Der Anbieter bemüht sich um eine Verfügbarkeit der Cloud-Dienste von 99% im Jahresmittel.</p>
              <p className="text-gray-700">(2) Hiervon ausgenommen sind Ausfallzeiten durch Wartungsarbeiten (mit Vorankündigung) sowie höhere Gewalt.</p>
            </div>
          </div>
        </section>

        {/* § 4 Preise und Zahlungsbedingungen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
            § 4 Preise und Zahlungsbedingungen
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.1 Abonnement-Modelle</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-800">Basic Pack</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">19,99 € / Jahr</p>
                  <p className="text-gray-600 text-sm mt-1">Erweiterte Funktionen ohne Cloud-Sync</p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                  <h4 className="font-semibold text-gray-800">Pro Pack</h4>
                  <p className="text-2xl font-bold text-violet-600 mt-2">27,99 € / Jahr</p>
                  <p className="text-gray-600 text-sm mt-1">Vollzugriff inkl. Cloud-Synchronisation</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">(2) Alle Preise verstehen sich als Bruttopreise inklusive der gesetzlichen Mehrwertsteuer.</p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.2 Zahlungsabwicklung</h3>
              <p className="text-gray-700">(1) Die Zahlung erfolgt über Apple In-App-Purchase oder über die auf der Website angebotenen Zahlungsmethoden.</p>
              <p className="text-gray-700">(2) Die Abrechnung erfolgt über das hinterlegte Zahlungsmittel.</p>
              <p className="text-gray-700">(3) Die Abbuchung erfolgt bei Abschluss des Abonnements für die gesamte Laufzeit im Voraus.</p>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">4.3 Verlängerung und Kündigung</h3>
              <p className="text-gray-700">(1) Abonnements verlängern sich automatisch um die gewählte Laufzeit, sofern nicht mindestens 24 Stunden vor Ablauf gekündigt wird.</p>
              <p className="text-gray-700">(2) Die Kündigung erfolgt über die Abonnement-Verwaltung im Apple App Store oder über die Kontoeinstellungen auf der Website.</p>
              <p className="text-gray-700">(3) Bei Kündigung bleibt der Zugang bis zum Ende der bezahlten Periode bestehen.</p>
            </div>
          </div>
        </section>

        {/* § 5 Nutzungsrechte */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            § 5 Nutzungsrechte
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Mit Vertragsschluss erhält der Kunde ein einfaches, nicht übertragbares Nutzungsrecht an der App und den Website-Diensten.</p>
            <p>(2) Die Nutzung ist auf die beim Kauf angegebene Apple-ID bzw. das registrierte Benutzerkonto beschränkt.</p>
            <p>(3) Eine gewerbliche Weitervermietung oder Unterlizenzierung ist untersagt.</p>
            <p>(4) Reverse Engineering, Dekompilierung oder Disassemblierung der App sind verboten.</p>
          </div>
        </section>

        {/* § 6 Pflichten des Kunden */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            § 6 Pflichten des Kunden
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>(1) Der Kunde ist verpflichtet:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Wahrheitsgemäße Angaben bei der Registrierung zu machen</li>
              <li>Zugangsdaten vertraulich zu behandeln</li>
              <li>Die App nur für legale Zwecke zu nutzen</li>
              <li>Keine falschen oder irreführenden Flugdaten einzugeben</li>
              <li>Regelmäßige Backups seiner Daten durchzuführen</li>
            </ul>
            <p>(2) Der Kunde haftet für alle Aktivitäten, die unter seinem Account erfolgen.</p>
            <p>(3) Bei Verstoß gegen diese Pflichten ist der Anbieter berechtigt, den Zugang zu sperren.</p>
          </div>
        </section>

        {/* § 7 Gewährleistung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 7 Gewährleistung</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Es gelten die gesetzlichen Gewährleistungsrechte.</p>
            <p>(2) Der Anbieter gewährleistet nicht, dass die App auf allen Geräten und iOS-Versionen fehlerfrei läuft.</p>
            <p>(3) Mängel sind unverzüglich unter genauer Beschreibung an oscar.knabe@knmail.de zu melden.</p>
            <p>(4) Der Anbieter wird gemeldete Mängel im Rahmen der technischen Möglichkeiten beheben.</p>
          </div>
        </section>

        {/* § 8 Haftung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
            § 8 Haftung
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>(1) Der Anbieter haftet unbeschränkt:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Bei Vorsatz und grober Fahrlässigkeit</li>
              <li>Bei Verletzung von Leben, Körper oder Gesundheit</li>
              <li>Nach dem Produkthaftungsgesetz</li>
            </ul>
            
            <p>(2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.</p>
            
            <p>(3) Die Haftung für Datenverlust ist auf den typischen Wiederherstellungsaufwand beschränkt, der bei regelmäßiger Datensicherung eingetreten wäre.</p>
            
            <p>(4) Der Anbieter haftet nicht für:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Schäden durch unsachgemäße Nutzung der App</li>
              <li>Fehlerhafte Eingaben des Nutzers</li>
              <li>Schäden durch Drittanbieter-Dienste</li>
              <li>Internetausfälle oder Serverprobleme</li>
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
              <p className="font-semibold text-gray-800">Wichtiger Hinweis:</p>
              <p>Die App ersetzt nicht die gesetzlich vorgeschriebene papierbasierte Logbuchführung. Der Nutzer ist selbst für die Einhaltung aller luftfahrtrechtlichen Vorschriften verantwortlich.</p>
            </div>
          </div>
        </section>

        {/* § 9 Datenschutz */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 9 Datenschutz</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <Link href="/privacy" className="text-blue-600 hover:underline">Datenschutzerklärung</Link>.</p>
            <p>(2) Der Kunde stimmt der Verarbeitung seiner Daten zur Vertragserfüllung zu.</p>
            <p>(3) Details zur Datenverarbeitung finden sich in der separaten Datenschutzerklärung.</p>
          </div>
        </section>

        {/* § 10 Änderungen der AGB */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 10 Änderungen der AGB</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Der Anbieter behält sich vor, diese AGB zu ändern, soweit dies zur Anpassung an geänderte Rechtslagen oder zur Erweiterung des Leistungsumfangs erforderlich ist.</p>
            <p>(2) Änderungen werden dem Kunden mindestens 30 Tage vor Inkrafttreten per E-Mail mitgeteilt.</p>
            <p>(3) Widerspricht der Kunde nicht innerhalb von 30 Tagen nach Zugang der Änderungsmitteilung, gelten die geänderten AGB als angenommen.</p>
          </div>
        </section>

        {/* § 11 Kündigung und Accountlöschung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 11 Kündigung und Accountlöschung</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Der Kunde kann sein Konto jederzeit in den App-Einstellungen oder über die Website löschen.</p>
            <p>(2) Mit der Löschung werden alle personenbezogenen Daten unwiderruflich gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
            <p>(3) Der Anbieter kann das Vertragsverhältnis bei Verstoß gegen diese AGB fristlos kündigen.</p>
          </div>
        </section>

        {/* § 12 Streitbeilegung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 12 Streitbeilegung</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://ec.europa.eu/consumers/odr</a></p>
            <p>(2) Der Anbieter ist nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>
        </section>

        {/* § 13 Schlussbestimmungen */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">§ 13 Schlussbestimmungen</h2>
          <div className="space-y-3 text-gray-700">
            <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
            <p>(2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand Aachen.</p>
            <p>(3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
            <p>(4) Änderungen oder Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für die Aufhebung dieser Schriftformklausel.</p>
          </div>
        </section>

        {/* Kontakt */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            Kontakt
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700">Bei Fragen zu diesen AGB wenden Sie sich bitte an:</p>
            <p className="text-gray-700 mt-2">E-Mail: oscar.knabe@knmail.de</p>
            <p className="text-gray-700">Betreff: AGB Log-K</p>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Startseite</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Datenschutz</Link>
            <Link href="/imprint" className="text-gray-600 hover:text-gray-900">Impressum</Link>
            <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900">Cookie-Richtlinie</Link>
          </div>
        </div>
      </div>
    </div>
  )
}