import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj)
  } catch (error) {
    return 'Invalid date'
  }
}

// Re-export time formatting from centralized module
export { formatMinutesToTime as formatTime } from './utils/time'

export function calculateBlockTime(departure: string, arrival: string): number {
  const dep = new Date(departure)
  const arr = new Date(arrival)
  return (arr.getTime() - dep.getTime()) / 3600000 // Convert to hours
}