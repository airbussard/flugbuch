'use client'

import { useState, useRef } from 'react'
import { Upload, FileJson, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

interface BackupPreview {
  valid: boolean
  backup: {
    version: string
    exportDate: string
    userEmail: string
    metadata?: any
  }
  content: {
    flights: number
    aircrafts: number
    crew_members: number
    flight_roles: number
  }
  potential_duplicates: {
    aircrafts: number
    crew_members: number
    flights: number
  }
  file_size: number
  file_name: string
}

interface ImportResult {
  success: boolean
  backupDate: string
  backupEmail: string
  results: {
    aircrafts: { imported: number; skipped: number; updated: number; errors: string[] }
    crew_members: { imported: number; skipped: number; updated: number; errors: string[] }
    flights: { imported: number; skipped: number; updated: number; errors: string[] }
    flight_roles: { imported: number; skipped: number; updated: number; errors: string[] }
  }
  totals: {
    imported: number
    updated: number
    skipped: number
    errors: number
  }
}

type ImportStrategy = 'skip' | 'overwrite' | 'merge'

export default function ImportBackup() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<BackupPreview | null>(null)
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>('skip')
  const [isValidating, setIsValidating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreview(null)
    setImportResult(null)
    setError(null)

    // Validate the file
    setIsValidating(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/backup/import', {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Validation failed')
      }

      const previewData = await response.json()
      setPreview(previewData)
      
    } catch (error) {
      console.error('Validation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to validate backup file')
      setSelectedFile(null)
    } finally {
      setIsValidating(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile || !preview) return

    setIsImporting(true)
    setError(null)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('strategy', importStrategy)
      
      const response = await fetch('/api/backup/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Import failed')
      }

      const result = await response.json()
      setImportResult(result)
      
      // Clear file selection after successful import
      setSelectedFile(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Import error:', error)
      setError(error instanceof Error ? error.message : 'Failed to import backup')
    } finally {
      setIsImporting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Backup</h3>
        <p className="text-sm text-gray-600">
          Restore your flight data from a previously exported backup file.
        </p>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label
          htmlFor="backup-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">JSON backup file (max 50MB)</p>
          </div>
          <input
            ref={fileInputRef}
            id="backup-file"
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isValidating || isImporting}
          />
        </label>
      </div>

      {/* Validation Loading */}
      {isValidating && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Validating backup file...</span>
        </div>
      )}

      {/* File Preview */}
      {preview && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <FileJson className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{preview.file_name}</p>
                <p className="text-xs text-gray-500">
                  Size: {formatFileSize(preview.file_size)} • 
                  Version: {preview.backup.version} • 
                  Exported: {formatDate(preview.backup.exportDate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From: {preview.backup.userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Content Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{preview.content.flights}</p>
              <p className="text-xs text-blue-600">Flights</p>
              {preview.potential_duplicates.flights > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  ~{preview.potential_duplicates.flights} duplicates
                </p>
              )}
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{preview.content.aircrafts}</p>
              <p className="text-xs text-green-600">Aircraft</p>
              {preview.potential_duplicates.aircrafts > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {preview.potential_duplicates.aircrafts} duplicates
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-700">{preview.content.crew_members}</p>
              <p className="text-xs text-purple-600">Crew</p>
              {preview.potential_duplicates.crew_members > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {preview.potential_duplicates.crew_members} duplicates
                </p>
              )}
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-700">{preview.content.flight_roles}</p>
              <p className="text-xs text-yellow-600">Assignments</p>
            </div>
          </div>

          {/* Import Strategy */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              How should duplicates be handled?
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="skip"
                  checked={importStrategy === 'skip'}
                  onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Skip Duplicates</p>
                  <p className="text-xs text-gray-500">Keep existing data, only import new records</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="overwrite"
                  checked={importStrategy === 'overwrite'}
                  onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Overwrite</p>
                  <p className="text-xs text-gray-500">Replace existing data with backup data</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="merge"
                  checked={importStrategy === 'merge'}
                  onChange={(e) => setImportStrategy(e.target.value as ImportStrategy)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Merge</p>
                  <p className="text-xs text-gray-500">Keep existing data, fill in missing fields</p>
                </div>
              </label>
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Import Backup
              </>
            )}
          </button>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Import Completed Successfully!</p>
                <p className="text-xs text-green-700 mt-1">
                  Backup from {formatDate(importResult.backupDate)} has been imported
                </p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">{importResult.totals.imported}</p>
              <p className="text-xs text-green-600">Imported</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{importResult.totals.updated}</p>
              <p className="text-xs text-blue-600">Updated</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-700">{importResult.totals.skipped}</p>
              <p className="text-xs text-gray-600">Skipped</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-700">{importResult.totals.errors}</p>
              <p className="text-xs text-red-600">Errors</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-2">
            <details className="p-3 bg-gray-50 rounded-lg">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                Detailed Import Results
              </summary>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Aircraft:</span> {importResult.results.aircrafts.imported} imported, {importResult.results.aircrafts.updated} updated, {importResult.results.aircrafts.skipped} skipped
                </div>
                <div>
                  <span className="font-medium">Crew:</span> {importResult.results.crew_members.imported} imported, {importResult.results.crew_members.updated} updated, {importResult.results.crew_members.skipped} skipped
                </div>
                <div>
                  <span className="font-medium">Flights:</span> {importResult.results.flights.imported} imported, {importResult.results.flights.updated} updated, {importResult.results.flights.skipped} skipped
                </div>
                <div>
                  <span className="font-medium">Assignments:</span> {importResult.results.flight_roles.imported} imported, {importResult.results.flight_roles.skipped} skipped
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Import Failed</p>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-amber-900 mb-2">Important Notes</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Only import backup files created by Log-K</li>
              <li>• Backup files must be in JSON format</li>
              <li>• Maximum file size is 50MB</li>
              <li>• Imported data will be associated with your account</li>
              <li>• Duplicate detection is based on date, registration, and airports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}