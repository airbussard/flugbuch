import Link from 'next/link'
import { Building, Mail, Phone, Globe, Scale, FileText, AlertCircle, Shield } from 'lucide-react'

export default function ImprintPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Impressum</h1>
        <p className="text-gray-600 mb-8">Angaben gemäß § 5 TMG</p>

        {/* Anbieter */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Building className="h-6 w-6 text-blue-500 mr-2" />
            Anbieter
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold text-lg mb-2">Fa. Oscar Knabe</p>
            <p className="text-gray-700">Einzelunternehmen</p>
            <p className="text-gray-700">Steinstraße 71</p>
            <p className="text-gray-700">52249 Eschweiler</p>
            <p className="text-gray-700">Deutschland</p>
          </div>
        </section>

        {/* Kontakt */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            Kontakt
          </h2>
          <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-2">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">Telefon: Auf Anfrage</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">E-Mail: oscar.knabe@knmail.de</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">Website: https://log-k.com</span>
            </div>
          </div>
        </section>

        {/* Umsatzsteuer-ID */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-2" />
            Umsatzsteuer-ID
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <p className="text-gray-700">
              <strong>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</strong><br />
              DE346449523
            </p>
            <p className="text-gray-700 mt-3">
              <strong>Steuernummer:</strong><br />
              220/5202/3200
            </p>
          </div>
        </section>

        {/* Verantwortlich für den Inhalt */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">Oscar Knabe</p>
            <p className="text-gray-700">Steinstraße 71</p>
            <p className="text-gray-700">52249 Eschweiler</p>
            <p className="text-gray-700">Deutschland</p>
          </div>
        </section>

        {/* EU-Streitschlichtung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Scale className="h-6 w-6 text-blue-500 mr-2" />
            EU-Streitschlichtung
          </h2>
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-gray-700 mb-3">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <a 
              href="https://ec.europa.eu/consumers/odr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <p className="text-gray-700 mt-3">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>
        </section>

        {/* Verbraucherstreitbeilegung */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Verbraucherstreitbeilegung/Universalschlichtungsstelle
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
            <p className="text-gray-700">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        {/* Haftung für Inhalte */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 text-blue-500 mr-2" />
            Haftung für Inhalte
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
              Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
              der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </div>
        </section>

        {/* Haftung für Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Haftung für Links
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
              Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht 
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </div>
        </section>

        {/* Urheberrecht */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            Urheberrecht
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
              Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
            </p>
            <p>
              Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen 
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte 
              umgehend entfernen.
            </p>
          </div>
        </section>

        {/* Datenschutz */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Datenschutz
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-3">
              Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. 
              Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) 
              erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne 
              Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
            </p>
            <p className="text-gray-700 mb-3">
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) 
              Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist 
              nicht möglich.
            </p>
            <p className="text-gray-700">
              Weitere Informationen zum Datenschutz finden Sie in unserer{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Datenschutzerklärung
              </Link>.
            </p>
          </div>
        </section>

        {/* Hinweis zur App */}
        <section className="mb-10">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Hinweis zur App</h2>
            <p className="text-gray-700">
              Log-K ist eine professionelle Flugbuch-Applikation für Piloten. Die App dient der digitalen 
              Erfassung und Verwaltung von Flugdaten gemäß EASA und FAA Regularien. Sie ersetzt nicht die 
              gesetzlich vorgeschriebene papierbasierte Logbuchführung. Nutzer sind selbst für die Einhaltung 
              aller luftfahrtrechtlichen Vorschriften verantwortlich.
            </p>
          </div>
        </section>

        {/* Kontaktaufnahme */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 text-blue-500 mr-2" />
            Kontaktaufnahme
          </h2>
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <p className="text-gray-700 mb-3">
              Bei Fragen oder Anliegen zum Impressum oder zur App kontaktieren Sie uns bitte unter:
            </p>
            <p className="text-gray-700">
              <strong>E-Mail:</strong> oscar.knabe@knmail.de<br />
              <strong>Betreff:</strong> Impressum Log-K
            </p>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t pt-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Startseite</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Datenschutz</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">AGB</Link>
            <Link href="/cookie-policy" className="text-gray-600 hover:text-gray-900">Cookie-Richtlinie</Link>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Stand: Januar 2025
          </p>
        </div>
      </div>
    </div>
  )
}