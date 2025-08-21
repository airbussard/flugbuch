/**
 * Central time formatting utilities for consistent HH:MM display
 * All flight times are stored in minutes in the database
 */

/**
 * Format minutes to HH:MM format
 * @param minutes - Time in minutes
 * @returns Formatted time string in HH:MM format
 */
export function formatMinutesToTime(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return '0:00'
  
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

/**
 * Format hours (decimal) to HH:MM format
 * Used for legacy code that might pass hours instead of minutes
 * @param hours - Time in decimal hours (e.g., 1.5 for 1 hour 30 minutes)
 * @returns Formatted time string in HH:MM format
 */
export function formatHoursToTime(hours: number | null | undefined): string {
  if (!hours || hours === 0) return '0:00'
  
  const totalMinutes = Math.round(hours * 60)
  return formatMinutesToTime(totalMinutes)
}

/**
 * Legacy compatibility - redirect to formatMinutesToTime
 * @deprecated Use formatMinutesToTime instead
 */
export function formatTime(minutes: number | null | undefined): string {
  return formatMinutesToTime(minutes)
}

/**
 * Parse HH:MM string to minutes
 * @param timeString - Time in HH:MM format
 * @returns Time in minutes
 */
export function parseTimeToMinutes(timeString: string): number {
  if (!timeString) return 0
  
  const parts = timeString.split(':')
  if (parts.length !== 2) return 0
  
  const hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  
  return hours * 60 + minutes
}