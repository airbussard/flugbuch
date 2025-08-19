import packageJson from '@/package.json'

export default function VersionFooter() {
  const version = packageJson.version || '0.1.000'
  const buildDate = new Date().toLocaleDateString('de-DE')
  
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          Log-K Pilot Logbook
        </div>
        <div className="flex items-center space-x-4">
          <span>Version {version}</span>
          <span>•</span>
          <span>Build {buildDate}</span>
        </div>
      </div>
    </footer>
  )
}