'use client'

import { Calendar } from 'lucide-react'

interface YearFilterProps {
  years: number[]
  selectedYear: number | null
  onYearChange: (year: number | null) => void
}

export default function YearFilter({ years, selectedYear, onYearChange }: YearFilterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      <select
        value={selectedYear || ''}
        onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : null)}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                 bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
      >
        <option value="">All Years</option>
        <option value={currentYear}>Current Year ({currentYear})</option>
        {years.filter(y => y !== currentYear).map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}