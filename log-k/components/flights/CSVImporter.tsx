'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, X } from 'lucide-react'
import Link from 'next/link'

interface CSVRow {
  [key: string]: string
}

interface ParsedFlight {
  flight_date: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  off_block?: string
  on_block?: string
  takeoff?: string
  landing?: string
  registration: string
  aircraft_type: string
  position: string
  block_time: number
  pic_time: number
  sic_time: number
  multi_pilot_time: number
  ifr_time: number
  vfr_time: number
  night_time: number
  cross_country_time: number
  dual_given_time: number
  dual_received_time: number
  landings_day: number
  landings_night: number
  is_pilot_flying: boolean
  remarks: string
}

interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

export default function CSVImporter() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [parsedFlights, setParsedFlights] = useState<ParsedFlight[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please select a CSV file'])
      return
    }

    setFile(selectedFile)
    setErrors([])
    setImportResult(null)

    // Parse CSV
    const text = await selectedFile.text()
    const rows = parseCSV(text)
    setCsvData(rows)

    // Convert to flight format
    const flights = convertToFlights(rows)
    setParsedFlights(flights)
  }

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const rows: CSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: CSVRow = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }

    return rows
  }

  const convertToFlights = (rows: CSVRow[]): ParsedFlight[] => {
    return rows.map(row => {
      // Parse date (expecting format: YYYY-MM-DD)
      const flightDate = row['Date'] || ''
      
      // Parse times (expecting format: HH:MM)
      const depTime = row['Dep Time'] || ''
      const arrTime = row['Arr Time'] || ''
      const takeoffTime = row['Takeoff Time'] || ''
      const landingTime = row['Landing Time'] || ''

      // Convert times to timestamps if date is available
      const offBlock = flightDate && depTime ? `${flightDate}T${depTime}:00` : undefined
      const onBlock = flightDate && arrTime ? `${flightDate}T${arrTime}:00` : undefined
      const takeoff = flightDate && takeoffTime ? `${flightDate}T${takeoffTime}:00` : undefined
      const landing = flightDate && landingTime ? `${flightDate}T${landingTime}:00` : undefined

      return {
        flight_date: flightDate,
        flight_number: row['Flight Number'] || '',
        departure_airport: row['Departure'] || '',
        arrival_airport: row['Arrival'] || '',
        off_block: offBlock,
        on_block: onBlock,
        takeoff: takeoff,
        landing: landing,
        registration: row['Aircraft Registration'] || row['Aircraft'] || '',  // Support both old and new column names
        aircraft_type: row['Aircraft Type'] || row['Aircraft'] || '', // Support both old and new column names
        position: row['Position'] || 'PIC',
        block_time: parseFloat(row['Block Time'] || '0'),
        pic_time: parseFloat(row['PIC Time'] || '0'),
        sic_time: parseFloat(row['SIC Time'] || '0'),
        multi_pilot_time: parseFloat(row['Multi Pilot Time'] || '0'),
        ifr_time: parseFloat(row['IFR Time'] || '0'),
        vfr_time: parseFloat(row['VFR Time'] || '0'),
        night_time: parseFloat(row['Night Time'] || '0'),
        cross_country_time: parseFloat(row['Cross Country Time'] || '0'),
        dual_given_time: parseFloat(row['Dual Given'] || '0'),
        dual_received_time: parseFloat(row['Dual Received'] || '0'),
        landings_day: parseInt(row['Day Landings'] || '0'),
        landings_night: parseInt(row['Night Landings'] || '0'),
        is_pilot_flying: (row['Pilot Flying'] || '').toUpperCase() === 'YES',
        remarks: row['Notes'] || ''
      }
    })
  }

  const handleImport = async () => {
    if (parsedFlights.length === 0) {
      setErrors(['No flights to import'])
      return
    }

    setImporting(true)
    setErrors([])

    try {
      const response = await fetch('/api/flights/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flights: parsedFlights })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      setImportResult(result)
      if (result.success && result.errors.length === 0) {
        // Clear data after successful import
        setFile(null)
        setCsvData([])
        setParsedFlights([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error: any) {
      setErrors([error.message || 'Failed to import flights'])
    } finally {
      setImporting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      const fakeEvent = {
        target: {
          files: [droppedFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    } else {
      setErrors(['Please drop a CSV file'])
    }
  }

  return (
    <div className="space-y-6">
      {/* Download Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Download className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-1">Need a template?</h3>
            <p className="text-sm text-blue-700 mb-2">
              Download our EASA-compliant CSV template with example flights
            </p>
            <Link
              href="/easa_compliant_logbook_template.csv"
              download
              className="inline-flex items-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download Template
            </Link>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium mb-2">
            Drop CSV file here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Supports EASA-compliant logbook format
          </p>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {parsedFlights.length} flights found
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null)
              setCsvData([])
              setParsedFlights([])
              setImportResult(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Preview Table */}
      {parsedFlights.length > 0 && !importResult && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Preview (first 5 flights)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedFlights.slice(0, 5).map((flight, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{flight.flight_date}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{flight.flight_number}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {flight.departure_airport} → {flight.arrival_airport}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{flight.registration}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{flight.block_time}h</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{flight.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedFlights.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                ... and {parsedFlights.length - 5} more flights
              </p>
            )}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 mb-1">Import Errors</h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className={`border rounded-lg p-4 ${
          importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            {importResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`font-medium mb-1 ${
                importResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {importResult.success ? 'Import Successful!' : 'Import Failed'}
              </h3>
              <div className="text-sm">
                <p className={importResult.success ? 'text-green-700' : 'text-red-700'}>
                  Imported: {importResult.imported} flights
                </p>
                {importResult.skipped > 0 && (
                  <p className="text-yellow-700">Skipped: {importResult.skipped} flights</p>
                )}
                {importResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-700 font-medium">Errors:</p>
                    <ul className="list-disc list-inside text-red-600">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Button */}
      {parsedFlights.length > 0 && !importResult && (
        <div className="flex justify-end">
          <button
            onClick={handleImport}
            disabled={importing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {importing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import {parsedFlights.length} Flights
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}