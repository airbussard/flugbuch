'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Plane, Users, Settings, MapPin, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchResult {
  type: 'flight' | 'aircraft' | 'crew' | 'airport'
  id: string
  title: string
  subtitle: string
  url: string
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const debouncedQuery = useDebounce(query, 300)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setQuery('')
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        setQuery('')
        inputRef.current?.blur()
        break
    }
  }, [isOpen, results, selectedIndex])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />
      case 'aircraft': return <Settings className="h-4 w-4" />
      case 'crew': return <Users className="h-4 w-4" />
      case 'airport': return <MapPin className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flight': return 'Flug'
      case 'aircraft': return 'Flugzeug'
      case 'crew': return 'Crew'
      case 'airport': return 'Flughafen'
      default: return type
    }
  }

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        <span key={i} className="font-semibold text-violet-600 dark:text-violet-400">{part}</span> : 
        part
    )
  }

  return (
    <div ref={searchRef} className="relative w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Suche Flüge, Flugzeuge, Crew, Flughäfen..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type}>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {getTypeLabel(type)}
                  </p>
                </div>
                {typeResults.map((result, index) => {
                  const globalIndex = results.indexOf(result)
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                                ${selectedIndex === globalIndex 
                                  ? 'bg-violet-50 dark:bg-violet-900/20' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <div className={`${selectedIndex === globalIndex ? 'text-violet-500' : 'text-gray-400'}`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {highlightMatch(result.title)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {highlightMatch(result.subtitle)}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {debouncedQuery.length >= 2 
                  ? 'Keine Ergebnisse gefunden' 
                  : 'Mindestens 2 Zeichen eingeben...'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}