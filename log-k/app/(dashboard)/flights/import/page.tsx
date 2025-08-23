'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, Plane, Users, Check, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { extractTextFromPDF } from '@/lib/pdf-client-parser'

interface ParsedFlight {
  date: string
  flightNumber?: string
  aircraftId: string
  aircraftType: string
  from: string
  to: string
  totalTime: number
  picCrew?: string
  sicCrew?: string
  dayLandings: number
  nightLandings: number
}

interface ParseResult {
  flights: ParsedFlight[]
  newAircraft: { registration: string; type: string }[]
  newCrew: string[]
  existingAircraft: string[]
  existingCrew: string[]
  errors: string[]
}

interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  total: number
  newAircraft: number
  newCrew: number
  errors?: string[]
}

export default function LogTenImportPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [pdfText, setPdfText] = useState<string>('')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file')
      return
    }

    setError('')
    setIsParsing(true)
    setParseResult(null)
    setImportResult(null)

    try {
      // Extract text from PDF using pdf.js
      const extractedText = await extractTextFromPDF(file)
      setPdfText(extractedText)
      
      // Send to API for parsing
      const formData = new FormData()
      formData.append('pdfText', extractedText)
      
      const response = await fetch('/api/flights/import-logten', {
        method: 'PUT',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to parse PDF')
      }
      
      const result = await response.json()
      setParseResult(result)
    } catch (err) {
      setError('Failed to parse PDF file')
      console.error(err)
    } finally {
      setIsParsing(false)
    }
  }, [])

  const handleImport = async () => {
    if (!pdfText || !parseResult) return
    
    setIsImporting(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('pdfText', pdfText)
      
      const response = await fetch('/api/flights/import-logten', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to import flights')
      }
      
      const result = await response.json()
      setImportResult(result)
      
      // Redirect after successful import
      if (result.success) {
        setTimeout(() => {
          router.push('/flights')
        }, 3000)
      }
    } catch (err) {
      setError('Failed to import flights')
      console.error(err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/flights"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Flights
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">Import from LogTen</h1>
        <p className="text-gray-600 mt-2">
          Import your flight history from LogTen Pro X PDF export
        </p>
      </div>

      {/* Upload Section */}
      {!parseResult && !importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Upload LogTen Export</h2>
              <p className="text-gray-600 mb-6">
                Export your flights from LogTen as PDF and upload the file here
              </p>
            </div>
            
            <label className="block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isParsing}
                className="sr-only"
              />
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 cursor-pointer transition-colors">
                <div className="space-y-1 text-center">
                  {isParsing ? (
                    <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <span className="relative font-medium text-blue-600 hover:text-blue-500">
                      {isParsing ? 'Parsing PDF...' : 'Click to upload PDF'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            </label>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parse Results */}
      {parseResult && !importResult && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flights Found</p>
                  <p className="text-2xl font-bold text-gray-900">{parseResult.flights.length}</p>
                </div>
                <Plane className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Aircraft</p>
                  <p className="text-2xl font-bold text-gray-900">{parseResult.newAircraft.length}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Crew</p>
                  <p className="text-2xl font-bold text-gray-900">{parseResult.newCrew.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Flight Preview</h3>
              <p className="text-sm text-gray-600 mt-1">
                {parseResult.flights.length > 0 
                  ? `First ${Math.min(10, parseResult.flights.length)} flights to be imported`
                  : 'No flights found in the PDF'}
              </p>
            </div>
            {parseResult.flights.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aircraft
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crew (PIC / SIC)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parseResult.flights.slice(0, 10).map((flight, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {flight.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-medium">{flight.aircraftId}</span>
                            {flight.aircraftType && (
                              <span className="text-gray-500 ml-1">({flight.aircraftType})</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-mono">{flight.from}</span>
                            <span className="mx-1">→</span>
                            <span className="font-mono">{flight.to}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {flight.totalTime.toFixed(1)}h
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>
                              {flight.picCrew || flight.sicCrew ? (
                                <>
                                  {flight.picCrew && (
                                    <span className="text-blue-600">{flight.picCrew}</span>
                                  )}
                                  {flight.picCrew && flight.sicCrew && (
                                    <span className="mx-1 text-gray-400">/</span>
                                  )}
                                  {flight.sicCrew && (
                                    <span className="text-green-600">{flight.sicCrew}</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400 italic">No crew data</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parseResult.flights.length > 10 && (
                  <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
                    ... and {parseResult.flights.length - 10} more flights
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No flights could be parsed from the PDF.</p>
                <p className="text-sm mt-2">Please check if the PDF is a valid LogTen export.</p>
              </div>
            )}
          </div>

          {/* Debug Information */}
          {parseResult.errors && parseResult.errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Parser Warnings
              </h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                {parseResult.errors.map((error, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Items */}
          {(parseResult.newAircraft.length > 0 || parseResult.newCrew.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                New items to be created
              </h3>
              
              {parseResult.newAircraft.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Aircraft:</h4>
                  <div className="flex flex-wrap gap-2">
                    {parseResult.newAircraft.map((aircraft, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-sm">
                        {aircraft.registration} ({aircraft.type})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {parseResult.newCrew.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Crew Members:</h4>
                  <div className="flex flex-wrap gap-2">
                    {parseResult.newCrew.map((crew, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-sm">
                        {crew}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setParseResult(null)
                setPdfText('')
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import {parseResult.flights.length} Flights
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            {importResult.success ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Successfully imported {importResult.imported} flights
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Failed</h2>
                <p className="text-gray-600 mb-6">
                  There was an error importing your flights
                </p>
              </>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.imported}</p>
                <p className="text-sm text-gray-600">Imported</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.skipped}</p>
                <p className="text-sm text-gray-600">Skipped</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.newAircraft}</p>
                <p className="text-sm text-gray-600">New Aircraft</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.newCrew}</p>
                <p className="text-sm text-gray-600">New Crew</p>
              </div>
            </div>
            
            {importResult.errors && importResult.errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-yellow-900 mb-2">Warnings:</h3>
                <ul className="list-disc list-inside text-sm text-yellow-800">
                  {importResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Redirecting to flights page...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}