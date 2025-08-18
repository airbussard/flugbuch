'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Plane, Users, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'flight' | 'aircraft' | 'crew'
  id: string
  title: string
  subtitle: string
  url: string
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      // Simulate search - in production this would query the database
      const mockResults: SearchResult[] = [
        {
          type: 'flight',
          id: '1',
          title: 'EDDL → EDDF',
          subtitle: '2025-01-15',
          url: '/flights/1'
        },
        {
          type: 'aircraft',
          id: '2',
          title: 'D-ABCD',
          subtitle: 'Cessna 172',
          url: '/fleet/2'
        }
      ]
      setResults(mockResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      ))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    setQuery('')
    setIsOpen(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />
      case 'aircraft': return <Settings className="h-4 w-4" />
      case 'crew': return <Users className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div ref={searchRef} className="relative w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search flights, aircraft, crew..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-left"
            >
              <div className="text-gray-400">
                {getIcon(result.type)}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}