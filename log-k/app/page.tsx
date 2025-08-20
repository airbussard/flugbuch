import Link from 'next/link'
import Image from 'next/image'
import { Plane, Shield, Cloud, BarChart3, Users, Globe, Check, Star, Zap, Lock, Smartphone, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="Log-K Logo" 
              width={48} 
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Log-K</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-violet-600 transition font-medium shadow-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-violet-200">
            <Star className="h-4 w-4 mr-1" />
            4 Weeks Free Trial - No Credit Card Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Digital<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">
              Pilot Logbook
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            EASA & FAA compliant flight logging with real-time sync, advanced analytics, and seamless multi-device access
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition shadow-md">
              Start 4-Week Free Trial
            </Link>
            <Link href="#pricing" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-gray-600">Active Pilots</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50k+</div>
              <div className="text-gray-600">Flights Logged</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-gray-600">EASA/FAA Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            From flight logging to compliance tracking, we've got you covered
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-violet-500" />}
              title="EASA & FAA Compliant"
              description="Fully compliant with international aviation regulations for professional pilots"
            />
            <FeatureCard
              icon={<Cloud className="h-12 w-12 text-blue-500" />}
              title="Cloud Sync"
              description="Access your logbook from any device with real-time synchronization"
            />
            <FeatureCard
              icon={<BarChart3 className="h-12 w-12 text-violet-500" />}
              title="Advanced Analytics"
              description="Track your progress with detailed statistics and visualizations"
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-blue-500" />}
              title="Crew Management"
              description="Manage crew assignments and collaborate with your team"
            />
            <FeatureCard
              icon={<Globe className="h-12 w-12 text-violet-500" />}
              title="Weather Integration"
              description="Real-time METAR/TAF data and route weather planning"
            />
            <FeatureCard
              icon={<Plane className="h-12 w-12 text-blue-500" />}
              title="Fleet Tracking"
              description="Manage multiple aircraft with detailed performance tracking"
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 4-week free trial.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <PricingCard
              title="Free Trial"
              price="0€"
              period="4 weeks"
              description="Perfect for trying out Log-K"
              features={[
                { text: "Full app access for 4 weeks", included: true },
                { text: "Local device storage", included: true },
                { text: "Basic flight logging", included: true },
                { text: "EASA/FAA compliance", included: true },
                { text: "Cloud sync", included: false },
                { text: "Web dashboard access", included: false },
                { text: "Multi-device sync", included: false },
                { text: "Priority support", included: false }
              ]}
              buttonText="Start Free Trial"
              buttonHref="/register"
              buttonStyle="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            />

            {/* Basic Pack */}
            <PricingCard
              title="Basic Pack"
              price="49,99€"
              period="3 years"
              monthlyPrice="1,39€/month"
              description="Essential features for casual pilots"
              features={[
                { text: "Everything in Free Trial", included: true },
                { text: "Extended local storage", included: true },
                { text: "Web account management", included: true },
                { text: "CSV import/export", included: true },
                { text: "Basic analytics", included: true },
                { text: "Email support", included: true },
                { text: "Cloud sync & backup", included: false },
                { text: "Priority support", included: false }
              ]}
              buttonText="Choose Basic"
              buttonHref="/register"
              buttonStyle="bg-gray-800 text-white hover:bg-gray-900"
            />

            {/* Pro Pack */}
            <PricingCard
              title="Pro Pack"
              price="69,99€"
              period="3 years"
              monthlyPrice="1,94€/month"
              description="Complete solution for professional pilots"
              popular={true}
              features={[
                { text: "Everything in Basic", included: true },
                { text: "Cloud sync & backup", included: true },
                { text: "Full web dashboard access", included: true },
                { text: "Unlimited devices", included: true },
                { text: "Advanced analytics", included: true },
                { text: "PDF logbook export", included: true },
                { text: "Weather integration", included: true },
                { text: "Priority 24/7 support", included: true }
              ]}
              buttonText="Choose Pro"
              buttonHref="/register"
              buttonStyle="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 shadow-lg"
            />
          </div>

          {/* Comparison Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              <Lock className="inline h-4 w-4 mr-1" />
              All plans include secure data encryption and automatic backups
            </p>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Log-K?
              </h3>
              <div className="space-y-4">
                <BenefitItem
                  icon={<Zap className="h-5 w-5 text-sky-500" />}
                  text="Lightning-fast sync across all devices"
                />
                <BenefitItem
                  icon={<Shield className="h-5 w-5 text-sky-500" />}
                  text="Bank-level security with encrypted backups"
                />
                <BenefitItem
                  icon={<Smartphone className="h-5 w-5 text-sky-500" />}
                  text="Native iOS app with offline support"
                />
                <BenefitItem
                  icon={<FileText className="h-5 w-5 text-sky-500" />}
                  text="Generate official logbook PDFs instantly"
                />
                <BenefitItem
                  icon={<Globe className="h-5 w-5 text-sky-500" />}
                  text="Access from anywhere via web dashboard"
                />
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-xl text-gray-600 mb-4">Customer Satisfaction</div>
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 italic">
                  "Log-K has completely transformed how I manage my flight records. 
                  The sync feature alone is worth every penny!"
                </blockquote>
                <cite className="text-sm text-gray-500 mt-2 block">
                  - Captain Sarah M., A320
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-500 to-violet-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Your Logbook Digital?
          </h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professional pilots who trust Log-K with their flight records
          </p>
          <Link href="/register" className="bg-white text-violet-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-violet-50 transition shadow-lg inline-block">
            Start Your 4-Week Free Trial
          </Link>
          <p className="text-violet-100 mt-4 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/logo.png" 
                  alt="Log-K Logo" 
                  width={40} 
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Log-K</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional pilot logbook trusted by aviators worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/imprint" className="hover:text-white transition">Imprint</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Log-K. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">
                Terms
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
    <div className="p-6 rounded-xl bg-white border border-gray-200 hover:border-sky-200 hover:shadow-lg transition-all duration-200">
      <div className="mb-4 p-3 bg-sky-50 rounded-lg inline-block">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface PricingFeature {
  text: string
  included: boolean
}

function PricingCard({ 
  title, 
  price, 
  period, 
  monthlyPrice,
  description, 
  features, 
  buttonText, 
  buttonHref,
  buttonStyle,
  popular = false 
}: { 
  title: string
  price: string
  period: string
  monthlyPrice?: string
  description: string
  features: PricingFeature[]
  buttonText: string
  buttonHref: string
  buttonStyle: string
  popular?: boolean
}) {
  return (
    <div className={`relative bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-sky-500 shadow-xl' : 'border border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600 ml-2">/ {period}</span>
        </div>
        {monthlyPrice && (
          <p className="text-sm text-sky-600 font-medium">{monthlyPrice}</p>
        )}
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <span className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5">✕</span>
            )}
            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <Link 
        href={buttonHref} 
        className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${buttonStyle}`}
      >
        {buttonText}
      </Link>
    </div>
  )
}

function BenefitItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-gray-700">{text}</span>
    </div>
  )
}