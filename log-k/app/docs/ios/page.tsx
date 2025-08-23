import Link from 'next/link'
import { 
  Smartphone, Download, LogIn, Book, Plane, Users, Cloud, 
  Settings, FileText, Upload, Camera, Moon, Globe, BarChart3,
  Shield, AlertTriangle, CheckCircle, Info
} from 'lucide-react'

export default function IOSDocsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <Smartphone className="h-8 w-8 text-violet-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">iOS Application Documentation</h1>
        </div>
        <p className="text-xl text-gray-600">
          Complete guide to using Log-K on your iPhone and iPad
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contents</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li><a href="#installation" className="text-violet-600 hover:text-violet-700">Installation & Setup</a></li>
            <li><a href="#navigation" className="text-violet-600 hover:text-violet-700">Tab Navigation</a></li>
            <li><a href="#logbook" className="text-violet-600 hover:text-violet-700">Logbook</a></li>
            <li><a href="#flight-entry" className="text-violet-600 hover:text-violet-700">Flight Entry</a></li>
            <li><a href="#fleet" className="text-violet-600 hover:text-violet-700">Fleet Management</a></li>
          </ul>
          <ul className="space-y-2">
            <li><a href="#crew" className="text-violet-600 hover:text-violet-700">Crew Management</a></li>
            <li><a href="#weather" className="text-violet-600 hover:text-violet-700">Weather Module</a></li>
            <li><a href="#profile" className="text-violet-600 hover:text-violet-700">Profile & Settings</a></li>
            <li><a href="#sync" className="text-violet-600 hover:text-violet-700">Cloud Sync</a></li>
            <li><a href="#import-export" className="text-violet-600 hover:text-violet-700">Import & Export</a></li>
          </ul>
        </div>
      </div>

      {/* Installation & Setup */}
      <section id="installation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Download className="h-6 w-6 mr-2" />
          Installation & Setup
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting the App</h3>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">1.</span>
              <div>
                <strong>App Store:</strong> Search for "Log-K" or "Pilotenflugbuch" in the App Store
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">2.</span>
              <div>
                <strong>Download:</strong> Tap "Get" to download the app (free with in-app purchases)
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">3.</span>
              <div>
                <strong>Open:</strong> Launch the app after installation
              </div>
            </li>
          </ol>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-4">First Launch</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <LogIn className="h-5 w-5 text-violet-500 mr-3 mt-0.5" />
              <div>
                <strong>Sign In:</strong> Use your existing Log-K account or create a new one
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-violet-500 mr-3 mt-0.5" />
              <div>
                <strong>Apple Sign-In:</strong> Quick login with Face ID/Touch ID
              </div>
            </div>
            <div className="flex items-start">
              <Cloud className="h-5 w-5 text-violet-500 mr-3 mt-0.5" />
              <div>
                <strong>Enable Sync:</strong> Turn on cloud sync to access data across devices
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-violet-900">
              <strong>Tip:</strong> The app works offline. All data is stored locally and syncs when connected.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section id="navigation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tab Navigation</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            The app uses a tab bar at the bottom for main navigation:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Book className="h-4 w-4 mr-2" />
                Logbook
              </h4>
              <p className="text-sm text-gray-600">View and manage all your flights</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Plane className="h-4 w-4 mr-2" />
                Fleet
              </h4>
              <p className="text-sm text-gray-600">Manage your aircraft</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Crew
              </h4>
              <p className="text-sm text-gray-600">Crew members and assignments</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Cloud className="h-4 w-4 mr-2" />
                Weather
              </h4>
              <p className="text-sm text-gray-600">METAR/TAF/SNOWTAM decoder</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </h4>
              <p className="text-sm text-gray-600">Settings and account management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logbook */}
      <section id="logbook" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Book className="h-6 w-6 mr-2" />
          Logbook
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Logbook Features</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Chronological flight list with key details</li>
            <li>• Search by airport, aircraft, or date</li>
            <li>• Filter by aircraft type or time period</li>
            <li>• Statistics footer showing totals</li>
            <li>• Pull-to-refresh for sync updates</li>
            <li>• Swipe actions for quick edit/delete</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4">Statistics Footer</h3>
          <p className="text-gray-600 mb-4">
            The bottom of the logbook shows:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Total flight hours (including prior experience)</li>
            <li>• Total landings (day/night)</li>
            <li>• IFR/VFR breakdown</li>
            <li>• Multi-pilot time</li>
            <li>• Cross-country time</li>
          </ul>
        </div>
      </section>

      {/* Flight Entry */}
      <section id="flight-entry" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Plane className="h-6 w-6 mr-2" />
          Flight Entry
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Adding a New Flight</h3>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">1.</span>
              <div>
                <strong>Basic Info:</strong> Date, departure/arrival airports (ICAO/IATA)
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">2.</span>
              <div>
                <strong>Times:</strong> Off block, takeoff, landing, on block
                <p className="text-sm text-gray-500 mt-1">Smart time pickers auto-calculate durations</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">3.</span>
              <div>
                <strong>Aircraft:</strong> Select from fleet or add new
                <p className="text-sm text-gray-500 mt-1">Aircraft defaults auto-fill conditions</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">4.</span>
              <div>
                <strong>Crew:</strong> Assign crew members and roles
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">5.</span>
              <div>
                <strong>Conditions:</strong> IFR/VFR, night time, approaches
              </div>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-violet-600 mr-3">6.</span>
              <div>
                <strong>Additional:</strong> Remarks, photo attachments
              </div>
            </li>
          </ol>

          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Moon className="h-5 w-5 mr-2" />
            Overnight Flights
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-2">
              The app automatically handles overnight flights:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Detects when landing is next day</li>
              <li>• Properly calculates flight time across midnight</li>
              <li>• Handles timezone differences</li>
              <li>• Shows visual indicator for overnight flights</li>
            </ul>
          </div>

          <h3 className="font-semibold text-gray-900 mb-4">Compliance Calculations</h3>
          <p className="text-gray-600 mb-4">
            Based on your settings (EASA/FAA), the app automatically calculates:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Multi-pilot time (when ≥2 crew)</li>
            <li>• Cross-country time (departure ≠ arrival)</li>
            <li>• Night time (manual entry validated)</li>
            <li>• IFR/VFR time based on conditions</li>
          </ul>
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fleet Management</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Aircraft Management</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Add aircraft with registration and type</li>
            <li>• Set aircraft class (SEP, MEP, SET, MET)</li>
            <li>• Define default conditions (IFR/VFR)</li>
            <li>• Mark as complex or high-performance</li>
            <li>• Track total time per aircraft</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Smart Defaults:</strong> Set default IFR/VFR for each aircraft. 
              When you select this aircraft for a flight, conditions are pre-filled.
            </p>
          </div>
        </div>
      </section>

      {/* Crew */}
      <section id="crew" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Crew Management
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Managing Crew</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Add crew members with contact details</li>
            <li>• Assign to flights with specific roles</li>
            <li>• Available roles: PIC, SIC, Instructor, Student, Safety Pilot</li>
            <li>• View flight count per crew member</li>
            <li>• Quick assignment from flight entry</li>
          </ul>

          <p className="text-gray-600">
            Crew assignments affect compliance calculations, especially multi-pilot time.
          </p>
        </div>
      </section>

      {/* Weather Module */}
      <section id="weather" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Cloud className="h-6 w-6 mr-2" />
          Weather Module
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Weather Features</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">METAR</h4>
              <p className="text-sm text-gray-600">Current weather observations with decoding</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">TAF</h4>
              <p className="text-sm text-gray-600">Terminal forecasts with trend analysis</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">SNOWTAM</h4>
              <p className="text-sm text-gray-600">Runway contamination reports</p>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-4">Using Weather</h3>
          <ol className="space-y-2 text-gray-600">
            <li>1. Enter ICAO code(s) in search field</li>
            <li>2. Tap to fetch weather data</li>
            <li>3. View raw and decoded information</li>
            <li>4. Save favorites for quick access</li>
          </ol>
        </div>
      </section>

      {/* Profile & Settings */}
      <section id="profile" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          Profile & Settings
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Personal information and license details</li>
            <li>• Prior experience (hours before Log-K)</li>
            <li>• Compliance mode selection (EASA/FAA/None)</li>
            <li>• Module toggles (Weather, Simulator, etc.)</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4">App Settings</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Sync configuration</li>
            <li>• Default units (metric/imperial)</li>
            <li>• Notification preferences</li>
            <li>• Subscription management</li>
            <li>• Account deletion</li>
          </ul>
        </div>
      </section>

      {/* Cloud Sync */}
      <section id="sync" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Cloud className="h-6 w-6 mr-2" />
          Cloud Sync
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Sync Features</h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• Automatic background sync when online</li>
            <li>• Manual sync with pull-to-refresh</li>
            <li>• Conflict resolution (server wins)</li>
            <li>• Sync status indicators</li>
            <li>• Works across iOS and web</li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              <strong>Offline Mode:</strong> All features work offline. 
              Changes sync automatically when connection is restored.
            </p>
          </div>
        </div>
      </section>

      {/* Import & Export */}
      <section id="import-export" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Import & Export</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Import Options
          </h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• <strong>PDF Import:</strong> Duty plans and flight records (beta)</li>
            <li>• <strong>CSV Import:</strong> Bulk flight import from other logbooks</li>
            <li>• <strong>Photo Import:</strong> Attach images to flights</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Export Options
          </h3>
          <ul className="space-y-2 text-gray-600 mb-6">
            <li>• <strong>PDF Export:</strong> Official logbook format for authorities</li>
            <li>• <strong>CSV Export:</strong> Data backup and migration</li>
            <li>• <strong>Share:</strong> Send individual flight details</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>PDF Import Note:</strong> Currently supports select airline formats. 
              Check compatibility before importing large documents.
            </p>
          </div>
        </div>
      </section>

      {/* Tips & Tricks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips & Tricks</h2>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Use 3D Touch/Haptic Touch for quick actions on flights</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Swipe left on a flight for quick edit/delete options</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Pull down to refresh syncs latest changes from cloud</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Long press on time fields for quick entry options</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Enable Face ID/Touch ID for quick app access</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Use aircraft defaults to speed up flight entry</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-600 mr-2">💡</span>
              <span>Weather module works offline with cached data</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Subscription Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            Log-K offers in-app purchases through the App Store:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic (€19.99/year)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Weather module</li>
                <li>• Airport database</li>
                <li>• Basic features</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pro (€27.99/year)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All features</li>
                <li>• Cloud sync</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Subscriptions sync between iOS app and web automatically.
          </p>
        </div>
      </section>
    </div>
  )
}