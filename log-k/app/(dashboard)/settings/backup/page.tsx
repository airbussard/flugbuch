import { Metadata } from 'next'
import ExportBackup from '@/components/backup/ExportBackup'
import ImportBackup from '@/components/backup/ImportBackup'
import { Database, Shield, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Backup & Restore | Log-K',
  description: 'Backup and restore your flight data',
}

export default function BackupPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Backup & Restore</h1>
        </div>
        <p className="text-gray-600">
          Manage your flight data backups. Export your data for safekeeping or import from a previous backup.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">Your Data Security</h3>
            <p className="text-sm text-blue-700">
              All backups are created locally and downloaded directly to your device. 
              Your sensitive profile information and license data are never included in backups for security reasons.
              Keep your backup files secure as they contain your flight history.
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <section>
        <ExportBackup />
      </section>

      {/* Import Section */}
      <section>
        <ImportBackup />
      </section>

      {/* Best Practices */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-gray-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Backup Best Practices</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Regular Backups</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Create backups monthly or after significant data changes</li>
                  <li>• Keep multiple backup versions with dates</li>
                  <li>• Store backups in multiple secure locations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Before Major Changes</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Always backup before importing large datasets</li>
                  <li>• Create a backup before app updates</li>
                  <li>• Export data before account changes</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Backup files contain your flight data in JSON format. 
                They can be opened with any text editor but should not be manually edited as this may cause import failures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Information */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Backup File Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
          <div>
            <span className="font-medium">Format:</span> JSON
          </div>
          <div>
            <span className="font-medium">Max Size:</span> 50MB
          </div>
          <div>
            <span className="font-medium">Version:</span> 1.0
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Backup files are compatible with all future versions of Log-K.
        </p>
      </div>
    </div>
  )
}