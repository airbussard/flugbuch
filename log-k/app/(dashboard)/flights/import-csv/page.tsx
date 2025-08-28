import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileSpreadsheet } from 'lucide-react'
import CSVImporter from '@/components/flights/CSVImporter'

export default async function ImportCSVPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/flights" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Link>
        
        <div className="flex items-center">
          <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import Flights from CSV</h1>
            <p className="text-gray-600 mt-1">
              Upload your EASA-compliant logbook data to import multiple flights at once
            </p>
          </div>
        </div>
      </div>

      {/* Import Component */}
      <div className="bg-white rounded-lg shadow p-6">
        <CSVImporter />
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">CSV Format Requirements</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Your CSV file should include the following columns:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong>Date:</strong> Flight date (YYYY-MM-DD format)</li>
            <li><strong>Flight Number:</strong> Optional flight number</li>
            <li><strong>Departure/Arrival:</strong> IATA or ICAO airport codes</li>
            <li><strong>Times:</strong> Dep Time, Arr Time, Takeoff Time, Landing Time (HH:MM format)</li>
            <li><strong>Aircraft Registration:</strong> Aircraft registration (e.g., D-ABCD)</li>
            <li><strong>Aircraft Type:</strong> Aircraft model (e.g., A320, B737)</li>
            <li><strong>Position:</strong> PIC, SIC, or INSTRUCTOR</li>
            <li><strong>Flight Times:</strong> Block, PIC, SIC, IFR, VFR, Night, etc. (decimal hours)</li>
            <li><strong>Landings:</strong> Day and Night landings (numbers)</li>
            <li><strong>Pilot Flying:</strong> YES or NO</li>
            <li><strong>Notes:</strong> Optional remarks</li>
          </ul>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Download our template CSV file to see the exact format required. 
            The template includes example flights to help you format your data correctly.
          </p>
        </div>
      </div>
    </div>
  )
}