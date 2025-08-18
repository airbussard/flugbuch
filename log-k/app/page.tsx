import Link from 'next/link'
import { Plane, Shield, Cloud, BarChart3, Users, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">Log-K</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-white hover:text-purple-200 transition">
              Login
            </Link>
            <Link href="/register" className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Pilot Logbook
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Digital flight logging with EASA & FAA compliance, real-time sync, and advanced analytics
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="bg-white text-purple-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-50 transition shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition">
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything You Need in One Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-purple-600" />}
              title="EASA & FAA Compliant"
              description="Fully compliant with international aviation regulations for professional pilots"
            />
            <FeatureCard
              icon={<Cloud className="h-12 w-12 text-purple-600" />}
              title="Cloud Sync"
              description="Access your logbook from any device with real-time synchronization"
            />
            <FeatureCard
              icon={<BarChart3 className="h-12 w-12 text-purple-600" />}
              title="Advanced Analytics"
              description="Track your progress with detailed statistics and visualizations"
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-purple-600" />}
              title="Crew Management"
              description="Manage crew assignments and collaborate with your team"
            />
            <FeatureCard
              icon={<Globe className="h-12 w-12 text-purple-600" />}
              title="Weather Integration"
              description="Real-time METAR/TAF data and route weather planning"
            />
            <FeatureCard
              icon={<Plane className="h-12 w-12 text-purple-600" />}
              title="Fleet Tracking"
              description="Manage multiple aircraft with detailed performance tracking"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Take Off?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professional pilots already using Log-K
          </p>
          <Link href="/register" className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg inline-block">
            Start Your Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <p>&copy; 2025 Log-K. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-purple-400 transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-purple-400 transition">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-purple-400 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}