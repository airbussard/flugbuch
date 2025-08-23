import Link from 'next/link'
import { 
  Monitor, Home, Plane, Users, BarChart3, Cloud, Globe, Settings, 
  CreditCard, FileText, Upload, Download, Shield, Zap, AlertCircle 
} from 'lucide-react'

export default function WebDocsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <Monitor className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Web Application Documentation</h1>
        </div>
        <p className="text-xl text-gray-600">
          Complete guide to using Log-K in your web browser
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contents</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li><a href="#getting-started" className="text-blue-600 hover:text-blue-700">Getting Started</a></li>
            <li><a href="#dashboard" className="text-blue-600 hover:text-blue-700">Dashboard</a></li>
            <li><a href="#flights" className="text-blue-600 hover:text-blue-700">Flight Management</a></li>
            <li><a href="#fleet" className="text-blue-600 hover:text-blue-700">Fleet Management</a></li>
            <li><a href="#crew" className="text-blue-600 hover:text-blue-700">Crew Management</a></li>
          </ul>
          <ul className="space-y-2">
            <li><a href="#analytics" className="text-blue-600 hover:text-blue-700">Analytics</a></li>
            <li><a href="#weather" className="text-blue-600 hover:text-blue-700">Weather</a></li>
            <li><a href="#airports" className="text-blue-600 hover:text-blue-700">Airports</a></li>
            <li><a href="#settings" className="text-blue-600 hover:text-blue-700">Settings</a></li>
            <li><a href="#subscription" className="text-blue-600 hover:text-blue-700">Subscription</a></li>
          </ul>
        </div>
      </div>

      {/* Getting Started */}
      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Creation</h3>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">1.</span>
              <div>
                <strong>Navigate to Registration:</strong> Go to <code className="bg-gray-100 px-2 py-1 rounded">log-k.com/register</code>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">2.</span>
              <div>
                <strong>Fill in Details:</strong> Enter your name, email, username, and password
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">3.</span>
              <div>
                <strong>Start Trial:</strong> Automatically receive 4 weeks free trial with all Pro features
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">4.</span>
              <div>
                <strong>Verify Email:</strong> Check your email for confirmation (if required)
              </div>
            </li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-4">First Login</h3>
          <p className="text-gray-600 mb-4">
            After registration, you'll be automatically logged in and directed to the dashboard. 
            For future logins, use your email and password at <code className="bg-gray-100 px-2 py-1 rounded">log-k.com/login</code>
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Home className="h-6 w-6 mr-2" />
          Dashboard
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            The dashboard is your central hub showing flight statistics, recent activities, and quick actions.
          </p>
          
          <h3 className="font-semibold text-gray-900 mb-3">Key Elements:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span><strong>Statistics Cards:</strong> Total hours, landings, flights, and current month activity</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span><strong>Recent Flights:</strong> Quick view of your last 5 flights</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span><strong>Quick Actions:</strong> Add new flight, view analytics, export logbook</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span><strong>Compliance Status:</strong> EASA/FAA currency and requirements</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Flight Management */}
      <section id="flights" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Plane className="h-6 w-6 mr-2" />
          Flight Management
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Adding a New Flight</h3>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">1.</span>
              <span>Click "New Flight" button in the flights section</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">2.</span>
              <span>Enter flight details: date, departure/arrival airports, times</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">3.</span>
              <span>Select aircraft from your fleet or add new one</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">4.</span>
              <span>Add crew members if applicable</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">5.</span>
              <span>Enter flight conditions (IFR/VFR, night time, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-blue-600 mr-3">6.</span>
              <span>Save flight - compliance times are calculated automatically</span>
            </li>
          </ol>

          <h3 className="font-semibold text-gray-900 mb-4">Flight List Features</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• <strong>Filtering:</strong> By date range, aircraft, airports</li>
            <li>• <strong>Sorting:</strong> By date, duration, aircraft</li>
            <li>• <strong>Search:</strong> Find flights by airport codes, registration</li>
            <li>• <strong>Bulk Actions:</strong> Export selected flights, delete multiple</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4">Import & Export</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </h4>
              <p className="text-sm text-gray-600">
                Import flights from other logbooks using CSV format. Template available for download.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </h4>
              <p className="text-sm text-gray-600">
                Generate official logbook PDFs for authorities or backup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Management */}
      <section id="fleet" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fleet Management</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            Manage your aircraft with detailed specifications and compliance settings.
          </p>
          
          <h3 className="font-semibold text-gray-900 mb-4">Aircraft Details</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Registration, type, and model</li>
            <li>• Aircraft class (SEP, MEP, SET, MET)</li>
            <li>• Default condition (IFR/VFR)</li>
            <li>• Complex aircraft and high-performance flags</li>
            <li>• MTOW and equipment details</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Set default conditions for each aircraft to speed up flight entry. 
              These defaults are automatically applied when you select the aircraft.
            </p>
          </div>
        </div>
      </section>

      {/* Crew Management */}
      <section id="crew" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Crew Management
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Managing Crew Members</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Add crew members with name, email, and license details</li>
            <li>• Assign roles: PIC, SIC, Instructor, Student, Safety Pilot</li>
            <li>• Track flight assignments and history</li>
            <li>• Automatic multi-pilot time calculation</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> When 2 or more crew members are assigned to a flight, 
              multi-pilot time is automatically calculated for EASA compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2" />
          Analytics
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Available Analytics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Flight Statistics</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total flight hours by month/year</li>
                <li>• Landing statistics</li>
                <li>• Aircraft utilization</li>
                <li>• Airport frequency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Compliance Tracking</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• IFR/VFR hours breakdown</li>
                <li>• Night flying hours</li>
                <li>• Cross-country time</li>
                <li>• Recent experience (90-day currency)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weather */}
      <section id="weather" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Cloud className="h-6 w-6 mr-2" />
          Weather
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Weather Features</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Real-time METAR retrieval</li>
            <li>• TAF forecasts</li>
            <li>• Decoded weather information</li>
            <li>• Multiple airport weather at once</li>
          </ul>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Usage:</strong> Enter ICAO codes (e.g., EDDF, KJFK) to get current weather. 
              Separate multiple airports with commas.
            </p>
          </div>
        </div>
      </section>

      {/* Airports */}
      <section id="airports" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Globe className="h-6 w-6 mr-2" />
          Airports
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Airport Database</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Comprehensive airport information</li>
            <li>• Runway details and dimensions</li>
            <li>• Radio frequencies</li>
            <li>• Location and elevation data</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4">PIREPs</h3>
          <p className="text-gray-600">
            Submit and view pilot reports for airports to help fellow pilots with current conditions and tips.
          </p>
        </div>
      </section>

      {/* Settings */}
      <section id="settings" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          Settings
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Personal information (name, email)</li>
            <li>• License details and numbers</li>
            <li>• Prior experience (hours before Log-K)</li>
            <li>• Compliance mode (EASA/FAA)</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4">Account Management</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Change password</li>
            <li>• Notification preferences</li>
            <li>• Data export options</li>
            <li>• Account deletion</li>
          </ul>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-red-900">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              <strong>Warning:</strong> Account deletion permanently removes all your data including flights, 
              aircraft, and crew information. This action cannot be undone.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section id="subscription" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          Subscription
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Subscription Tiers</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Trial</h4>
              <p className="text-sm text-gray-600 mb-2">4 weeks free</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ All Pro features</li>
                <li>✓ No credit card required</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Basic</h4>
              <p className="text-sm text-gray-600 mb-2">€19.99/year</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Weather & airports</li>
                <li>✓ Settings</li>
                <li>✗ Cloud sync</li>
              </ul>
            </div>
            
            <div className="border border-violet-500 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Pro</h4>
              <p className="text-sm text-gray-600 mb-2">€27.99/year</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ All features</li>
                <li>✓ Cloud sync</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600">
            Subscriptions can be managed in Settings. Payment processing coming soon via Stripe.
            iOS users can subscribe through in-app purchases.
          </p>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-2" />
          Tips & Best Practices
        </h2>
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <span>Set up your fleet first before logging flights to save time</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <span>Use CSV import for bulk flight entry from other logbooks</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <span>Regular PDF exports serve as backups of your logbook</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <span>Enable sync to access your logbook from multiple devices</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <span>Check analytics regularly to track currency requirements</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function Check() {
  return <span className="text-green-500">✓</span>
}