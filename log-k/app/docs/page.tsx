import Link from 'next/link'
import { Monitor, Smartphone, Zap, Cloud, Shield, BarChart3, FileText, Users, Globe, Check } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Log-K Documentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to know about using Log-K, the professional digital pilot logbook for EASA & FAA compliance
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Link href="/docs/web" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Web Application</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Access your logbook from any browser with full functionality including flight management, analytics, and real-time sync.
            </p>
            <div className="text-blue-600 font-medium group-hover:text-blue-700">
              View Web Documentation →
            </div>
          </div>
        </Link>

        <Link href="/docs/ios" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-violet-100 rounded-lg">
                <Smartphone className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">iOS Application</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Native iOS app with offline support, optimized for pilots on the go with quick entry and smart defaults.
            </p>
            <div className="text-violet-600 font-medium group-hover:text-violet-700">
              View iOS Documentation →
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Start Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started with Web</h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">1.</span>
                <span>Create your account or sign in at log-k.com</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">2.</span>
                <span>Add your aircraft to the fleet</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">3.</span>
                <span>Log your first flight</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-blue-600 mr-2">4.</span>
                <span>View analytics and export your logbook</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started with iOS</h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="font-medium text-violet-600 mr-2">1.</span>
                <span>Download Log-K from the App Store</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-violet-600 mr-2">2.</span>
                <span>Sign in with your account</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-violet-600 mr-2">3.</span>
                <span>Enable sync for multi-device access</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-violet-600 mr-2">4.</span>
                <span>Start logging flights on the go</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Cloud className="h-6 w-6 text-blue-500" />}
            title="Cloud Sync"
            description="Real-time synchronization across all your devices"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-green-500" />}
            title="EASA & FAA Compliant"
            description="Automatic compliance calculations for regulations"
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-violet-500" />}
            title="Advanced Analytics"
            description="Detailed statistics and insights about your flying"
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-orange-500" />}
            title="PDF Export"
            description="Generate official logbook PDFs for authorities"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-indigo-500" />}
            title="Crew Management"
            description="Track crew assignments and roles"
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-teal-500" />}
            title="Weather Integration"
            description="METAR/TAF decoder and weather planning"
          />
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Free Trial</h3>
            <p className="text-sm text-gray-600 mb-4">4 weeks of full access</p>
            <ul className="space-y-2">
              <FeatureItem included={true} text="All Pro features" />
              <FeatureItem included={true} text="Unlimited flights" />
              <FeatureItem included={true} text="Cloud sync" />
              <FeatureItem included={true} text="PDF export" />
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Basic</h3>
            <p className="text-sm text-gray-600 mb-4">€19.99/year</p>
            <ul className="space-y-2">
              <FeatureItem included={true} text="Weather & METAR/TAF" />
              <FeatureItem included={true} text="Airport database" />
              <FeatureItem included={true} text="Account settings" />
              <FeatureItem included={false} text="Cloud sync" />
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 ring-2 ring-violet-500">
            <h3 className="font-semibold text-gray-900 mb-3">Pro</h3>
            <p className="text-sm text-gray-600 mb-4">€27.99/year</p>
            <ul className="space-y-2">
              <FeatureItem included={true} text="Everything in Basic" />
              <FeatureItem included={true} text="Unlimited flights" />
              <FeatureItem included={true} text="Cloud sync" />
              <FeatureItem included={true} text="Analytics & PDF export" />
            </ul>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-6">
          If you can't find what you're looking for in the documentation, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Contact Support
          </Link>
          <Link 
            href="https://github.com/yourusername/log-k/issues" 
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function FeatureItem({ included, text }: { included: boolean, text: string }) {
  return (
    <li className="flex items-center text-sm">
      {included ? (
        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <span className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0">✕</span>
      )}
      <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </li>
  )
}