'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Calendar, Plane, AlertTriangle, Check, Loader2, Info } from 'lucide-react'
import Link from 'next/link'
import { extractTextFromPDF } from '@/lib/pdf-client-parser'

interface DutyPlanFlight {
  date: string
  flightNumber: string
  departure: string
  arrival: string
  scheduledDep: string
  scheduledArr: string
  blockTime: number
  aircraftType?: string
}

interface ParseResult {
  flights: DutyPlanFlight[]
  period: { start: string; end: string }
  duplicates: string[]
  totalFlights: number
  newFlights: number
  errors: string[]
}

interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  total: number
  period: { start: string; end: string }
  warnings: string[]
  errors?: string[]
}

export default function DutyPlanImportPage() {
  const router = useRouter()
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [pdfText, setPdfText] = useState<string>('')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      setError('Bitte wählen Sie eine gültige PDF-Datei')
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
      
      const response = await fetch('/api/flights/import-duty-plan', {
        method: 'PUT',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Parsen der PDF')
      }
      
      setParseResult(result)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Parsen der Duty Plan PDF')
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
      
      const response = await fetch('/api/flights/import-duty-plan', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Importieren der Flüge')
      }
      
      const result = await response.json()
      setImportResult(result)
      
      // Redirect after successful import
      if (result.success) {
        setTimeout(() => {
          router.push('/flights')
        }, 5000)
      }
    } catch (err) {
      setError('Fehler beim Importieren der Flüge')
      console.error(err)
    } finally {
      setIsImporting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/flights"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zu Flügen
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">Duty Plan Import</h1>
        <p className="text-gray-600 mt-2">
          Importieren Sie Ihren Eurowings Duty Plan (nur EW Flüge, keine Deadheads)
        </p>
      </div>

      {/* Upload Section */}
      {!parseResult && !importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Duty Plan PDF hochladen</h2>
              <p className="text-gray-600 mb-6">
                Laden Sie Ihre DP.pdf aus NetLine/Crew hoch
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
                      {isParsing ? 'PDF wird analysiert...' : 'Klicken Sie hier um eine PDF hochzuladen'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">PDF bis zu 10MB</p>
                </div>
              </div>
            </label>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Wichtiger Hinweis</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Dieser Import erstellt nur die Grunddaten der Flüge. Sie müssen später noch ergänzen:
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-700 mt-2">
                    <li>Flugzeug-Registrierung</li>
                    <li>Crew-Zuordnungen</li>
                    <li>Tatsächliche Off/On Zeiten</li>
                    <li>PIC/SIC Zeiten</li>
                  </ul>
                </div>
              </div>
            </div>
            
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
                  <p className="text-sm font-medium text-gray-600">Zeitraum</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(parseResult.period.start)} - {formatDate(parseResult.period.end)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gefundene Flüge</p>
                  <p className="text-2xl font-bold text-gray-900">{parseResult.totalFlights}</p>
                  <p className="text-sm text-green-600">{parseResult.newFlights} neu</p>
                </div>
                <Plane className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Duplikate</p>
                  <p className="text-2xl font-bold text-gray-900">{parseResult.duplicates.length}</p>
                  <p className="text-sm text-gray-500">werden übersprungen</p>
                </div>
                <Info className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Flight Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Flug-Vorschau</h3>
              <p className="text-sm text-gray-600 mt-1">Alle EW Flüge aus dem Duty Plan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Datum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flugnummer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STD - STA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parseResult.flights.map((flight, index) => {
                    const isDuplicate = parseResult.duplicates.includes(
                      `${flight.date} ${flight.flightNumber}`
                    )
                    return (
                      <tr key={index} className={isDuplicate ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(flight.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {flight.flightNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.departure} → {flight.arrival}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.scheduledDep} - {flight.scheduledArr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flight.blockTime.toFixed(2)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isDuplicate ? (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              Duplikat
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Neu
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-900">Nach dem Import erforderlich</h3>
                <p className="text-yellow-800 mt-2">
                  Die importierten Flüge enthalten nur Grunddaten aus dem Duty Plan. Bitte ergänzen Sie:
                </p>
                <ul className="list-disc list-inside text-yellow-800 mt-2 space-y-1">
                  <li>Tatsächliche Flugzeug-Registrierung (momentan als "TBD" gesetzt)</li>
                  <li>Crew-Mitglieder (PIC, SIC)</li>
                  <li>Tatsächliche Takeoff/Landing Zeiten</li>
                  <li>PIC/SIC Zeit-Aufteilung</li>
                  <li>Tag/Nacht Landungen</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setParseResult(null)
                setPdfText('')
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting || parseResult.newFlights === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importiere...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {parseResult.newFlights} Flüge importieren
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import erfolgreich!</h2>
                <p className="text-gray-600 mb-6">
                  {importResult.imported} Flüge wurden erfolgreich importiert
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import fehlgeschlagen</h2>
                <p className="text-gray-600 mb-6">
                  Es gab einen Fehler beim Importieren der Flüge
                </p>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.imported}</p>
                <p className="text-sm text-gray-600">Importiert</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{importResult.skipped}</p>
                <p className="text-sm text-gray-600">Übersprungen</p>
              </div>
            </div>
            
            {importResult.warnings && importResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-yellow-900 mb-2">Nächste Schritte:</h3>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  {importResult.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {importResult.errors && importResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-red-900 mb-2">Fehler:</h3>
                <ul className="list-disc list-inside text-sm text-red-800">
                  {importResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Weiterleitung zum Fluglogbuch in 5 Sekunden...
            </p>
            
            <Link
              href="/flights"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Zum Fluglogbuch
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}