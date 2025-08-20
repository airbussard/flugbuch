'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { debounce } from 'lodash'

export default function AirportSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setIsSearching(false)
      const params = new URLSearchParams(searchParams)
      if (searchQuery) {
        params.set('q', searchQuery)
        params.set('page', '1') // Reset to first page on new search
      } else {
        params.delete('q')
      }
      router.push(`/airports?${params.toString()}`)
    }, 500),
    [searchParams, router]
  )

  const handleSearch = (value: string) => {
    setQuery(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value.toUpperCase())}
          placeholder="Search by ICAO, IATA, name, or city..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        <QuickSearchButton code="EDDF" label="Frankfurt" />
        <QuickSearchButton code="KJFK" label="New York JFK" />
        <QuickSearchButton code="EGLL" label="London Heathrow" />
        <QuickSearchButton code="OMDB" label="Dubai" />
        <QuickSearchButton code="RJTT" label="Tokyo Narita" />
      </div>
    </div>
  )
}

function QuickSearchButton({ code, label }: { code: string; label: string }) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(`/airports?q=${code}`)
  }
  
  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      {code} • {label}
    </button>
  )
}