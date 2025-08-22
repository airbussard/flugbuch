/**
 * UTC Time Formatting Utilities
 * All times in the database are stored in UTC and should be displayed in UTC
 * without any timezone conversions.
 */

/**
 * Format a UTC datetime string to display time only in HH:MM format
 * @param datetime - ISO datetime string from database
 * @returns Time string in HH:MM format (UTC)
 */
export function formatUTCTime(datetime: string | Date | null | undefined): string {
  if (!datetime) return '--:--'
  
  try {
    const date = typeof datetime === 'string' ? new Date(datetime) : datetime
    if (isNaN(date.getTime())) return '--:--'
    
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return '--:--'
  }
}

/**
 * Format a UTC date to display in DD.MM.YYYY format
 * @param date - Date string or Date object
 * @returns Date string in DD.MM.YYYY format
 */
export function formatUTCDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    
    const day = dateObj.getUTCDate().toString().padStart(2, '0')
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getUTCFullYear()
    
    return `${day}.${month}.${year}`
  } catch {
    return 'Invalid date'
  }
}

/**
 * Format a UTC datetime to display both date and time
 * @param datetime - ISO datetime string from database
 * @returns DateTime string in DD.MM.YYYY HH:MM format (UTC)
 */
export function formatUTCDateTime(datetime: string | Date | null | undefined): string {
  if (!datetime) return 'N/A'
  
  const date = formatUTCDate(datetime)
  const time = formatUTCTime(datetime)
  
  if (date === 'Invalid date' || time === '--:--') {
    return 'Invalid datetime'
  }
  
  return `${date} ${time}`
}

/**
 * Convert a date and time input to UTC timestamp for database storage
 * @param date - Date in YYYY-MM-DD format
 * @param time - Time in HH:MM format
 * @returns ISO string timestamp in UTC
 */
export function parseTimeToUTC(date: string, time: string): string {
  // Combine date and time and treat as UTC
  // Important: We append 'Z' to indicate this is UTC time
  return `${date}T${time}:00Z`
}

/**
 * Extract time in HH:MM format from a UTC datetime
 * @param datetime - ISO datetime string from database
 * @returns Time string in HH:MM format for form inputs
 */
export function extractUTCTime(datetime: string | Date | null | undefined): string {
  if (!datetime) return ''
  
  try {
    const date = typeof datetime === 'string' ? new Date(datetime) : datetime
    if (isNaN(date.getTime())) return ''
    
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return ''
  }
}

/**
 * Extract date in YYYY-MM-DD format from a UTC datetime
 * @param datetime - ISO datetime string from database
 * @returns Date string in YYYY-MM-DD format for form inputs
 */
export function extractUTCDate(datetime: string | Date | null | undefined): string {
  if (!datetime) return ''
  
  try {
    const date = typeof datetime === 'string' ? new Date(datetime) : datetime
    if (isNaN(date.getTime())) return ''
    
    const year = date.getUTCFullYear()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = date.getUTCDate().toString().padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}