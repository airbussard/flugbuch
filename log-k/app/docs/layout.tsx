import Link from 'next/link'
import { Book, Monitor, Smartphone, ArrowLeft } from 'lucide-react'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Log-K</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <Link 
              href="/docs" 
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
            >
              <Book className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link 
              href="/docs/web" 
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
            >
              <Monitor className="h-4 w-4" />
              <span>Web App</span>
            </Link>
            <Link 
              href="/docs/ios" 
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
            >
              <Smartphone className="h-4 w-4" />
              <span>iOS App</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}