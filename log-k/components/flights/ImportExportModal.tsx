'use client'

import { useState, useRef } from 'react'
import { X, Upload, Download, FileText, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseCSVFile, exportFlightsToCSV, downloadCSV } from '@/lib/csv/flight-csv'
import { ExportPDFButton } from '@/lib/pdf/logbook-export'
import { createClient } from '@/lib/supabase/client'

interface ImportExportModalProps {
  isOpen: boolean
  onClose: () => void
  flights: any[]
  onImportSuccess?: () => void
}

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  flights,
  onImportSuccess 
}: ImportExportModalProps) {
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  if (!isOpen) return null

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportStatus('Parsing CSV file...')

    try {
      const csvFlights = await parseCSVFile(file)
      setImportStatus(`Found ${csvFlights.length} flights. Importing...`)

      const { data: { user } } = await supabase.auth.getUser()
      
      // Import flights to database
      const flightsToImport = csvFlights.map(flight => ({
        ...flight,
        user_id: user?.id,
        deleted: false
      }))

      const { error } = await supabase
        .from('flights')
        .insert(flightsToImport)

      if (error) throw error

      setImportStatus(`✅ Successfully imported ${csvFlights.length} flights!`)
      
      setTimeout(() => {
        onImportSuccess?.()
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Import error:', error)
      setImportStatus(`❌ Import failed: ${error}`)
    } finally {
      setImporting(false)
    }
  }

  const handleCSVExport = () => {
    const csv = exportFlightsToCSV(flights)
    const filename = `flights_export_${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csv, filename)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import/Export Flights</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Import Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Import Flights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Upload a CSV file with your flight data
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="w-full"
            >
              {importing ? 'Importing...' : 'Select CSV File'}
            </Button>
            {importStatus && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {importStatus}
              </p>
            )}
          </div>

          {/* Export Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Flights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Download your flight data in various formats
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleCSVExport}
                variant="outline"
                className="w-full justify-start"
              >
                <Table className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <div className="w-full">
                <ExportPDFButton flights={flights} />
              </div>
            </div>
          </div>

          {/* Template Download */}
          <div className="text-center">
            <a
              href="/easa_compliant_logbook_template.csv"
              download
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Download CSV Template
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}