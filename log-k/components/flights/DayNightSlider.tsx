'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

interface DayNightSliderProps {
  totalMinutes: number
  dayMinutes: number
  nightMinutes: number
  onChange: (day: number, night: number) => void
  disabled?: boolean
}

export default function DayNightSlider({ 
  totalMinutes, 
  dayMinutes: initialDayMinutes, 
  nightMinutes: initialNightMinutes,
  onChange,
  disabled = false
}: DayNightSliderProps) {
  const [dayPercentage, setDayPercentage] = useState(100)

  useEffect(() => {
    if (totalMinutes > 0) {
      const percentage = (initialDayMinutes / totalMinutes) * 100
      setDayPercentage(Math.round(percentage))
    }
  }, [initialDayMinutes, totalMinutes])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseInt(e.target.value)
    setDayPercentage(percentage)
    
    const dayMins = Math.round((totalMinutes * percentage) / 100)
    const nightMins = totalMinutes - dayMins
    
    onChange(dayMins, nightMins)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  const dayMinutes = Math.round((totalMinutes * dayPercentage) / 100)
  const nightMinutes = totalMinutes - dayMinutes

  if (totalMinutes === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Bitte erst Off Block und On Block Zeiten eingeben
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tag/Nacht Aufteilung
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Gesamt: {formatTime(totalMinutes)}
        </span>
      </div>

      {/* Visual representation */}
      <div className="relative">
        <div className="flex h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center transition-all duration-200"
            style={{ width: `${dayPercentage}%` }}
          >
            {dayPercentage > 20 && (
              <div className="flex items-center text-white text-sm font-medium">
                <Sun className="h-4 w-4 mr-1" />
                {formatTime(dayMinutes)}
              </div>
            )}
          </div>
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center transition-all duration-200"
            style={{ width: `${100 - dayPercentage}%` }}
          >
            {(100 - dayPercentage) > 20 && (
              <div className="flex items-center text-white text-sm font-medium">
                <Moon className="h-4 w-4 mr-1" />
                {formatTime(nightMinutes)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={dayPercentage}
          onChange={handleSliderChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-500
                     [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
                     [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-violet-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Time display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tag</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(dayMinutes)}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {dayPercentage}% der Flugzeit
            </span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nacht</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(nightMinutes)}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {100 - dayPercentage}% der Flugzeit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}