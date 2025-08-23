// Eurowings Duty Plan Parser
import { Database } from '@/types/supabase'

type Flight = Database['public']['Tables']['flights']['Row']

export interface DutyPlanFlight {
  date: string           // ISO format: "2025-07-23"
  flightNumber: string   // e.g. "EW 582"
  departure: string      // e.g. "CGN"
  arrival: string        // e.g. "PMI"
  scheduledDep: string   // e.g. "03:30"
  scheduledArr: string   // e.g. "05:50"
  blockTime: number      // in hours
  aircraftType?: string  // e.g. "320" for A320
  isDutyPlan: boolean    // Flag to identify duty plan imports
}

export interface DutyPlanImportResult {
  flights: DutyPlanFlight[]
  period: { start: string; end: string }
  errors: string[]
}

// Month mapping for German abbreviations
const MONTH_MAP: { [key: string]: string } = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

// Convert time from HHMM to HH:MM format
function formatTime(time: string): string {
  if (time.length !== 4) return '00:00'
  return `${time.substring(0, 2)}:${time.substring(2, 4)}`
}

// Calculate block time in hours from two time strings
function calculateBlockTime(dep: string, arr: string): number {
  const [depHour, depMin] = dep.split(':').map(Number)
  const [arrHour, arrMin] = arr.split(':').map(Number)
  
  let depMinutes = depHour * 60 + depMin
  let arrMinutes = arrHour * 60 + arrMin
  
  // Handle overnight flights
  if (arrMinutes < depMinutes) {
    arrMinutes += 24 * 60
  }
  
  const blockMinutes = arrMinutes - depMinutes
  return Math.round((blockMinutes / 60) * 100) / 100 // Round to 2 decimals
}

// Extract year and month from header
function extractPeriodInfo(text: string): { year: string; month: string } | null {
  // Look for patterns like "Period: 31Jul25" or similar
  const periodMatch = text.match(/Period:\s*\d{1,2}([A-Z][a-z]{2})(\d{2})/i)
  if (periodMatch) {
    const month = periodMatch[1]
    const yearShort = periodMatch[2]
    const year = parseInt(yearShort) < 50 ? `20${yearShort}` : `19${yearShort}`
    return { year, month }
  }
  
  // Alternative: Look for month and year in different format
  const dateMatch = text.match(/(\d{1,2})([A-Z][a-z]{2})(\d{2})/i)
  if (dateMatch) {
    const month = dateMatch[2]
    const yearShort = dateMatch[3]
    const year = parseInt(yearShort) < 50 ? `20${yearShort}` : `19${yearShort}`
    return { year, month }
  }
  
  return null
}

// Parse date from day indicator (e.g., "Wed23")
function parseDate(dayStr: string, month: string, year: string): string | null {
  const dayMatch = dayStr.match(/([A-Z][a-z]{2})(\d{1,2})/i)
  if (!dayMatch) return null
  
  const day = dayMatch[2].padStart(2, '0')
  const monthNum = MONTH_MAP[month] || '01'
  
  return `${year}-${monthNum}-${day}`
}

// Parse EW flight from line
function parseFlightLine(line: string): { 
  flightNumber: string; 
  departure: string; 
  scheduledDep: string; 
  scheduledArr: string; 
  arrival: string;
  aircraftType?: string;
} | null {
  // Pattern: EW [flight_num] [DEP] [dep_time] [arr_time] [ARR] [optional_aircraft]
  // Example: "EW 582 CGN 0330 0550 PMI 320"
  const flightPattern = /EW\s+(\d+)\s+([A-Z]{3})\s+(\d{4})\s+(\d{4})\s+([A-Z]{3})(?:\s+(\d{3}))?/
  const match = line.match(flightPattern)
  
  if (!match) return null
  
  // Check for DH (Deadhead) indicator - these should be skipped
  if (line.includes('DH')) return null
  
  return {
    flightNumber: `EW ${match[1]}`,
    departure: match[2],
    scheduledDep: formatTime(match[3]),
    scheduledArr: formatTime(match[4]),
    arrival: match[5],
    aircraftType: match[6] || undefined
  }
}

// Main parser function
export function parseDutyPlanPDF(pdfText: string): DutyPlanImportResult {
  const lines = pdfText.split('\n')
  const flights: DutyPlanFlight[] = []
  const errors: string[] = []
  
  // Extract period information
  const periodInfo = extractPeriodInfo(pdfText)
  if (!periodInfo) {
    errors.push('Could not extract period information from PDF')
    return { flights: [], period: { start: '', end: '' }, errors }
  }
  
  const { year, month } = periodInfo
  
  let currentDate: string | null = null
  let periodStart = ''
  let periodEnd = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) continue
    
    // Check for date indicator (e.g., "Wed23")
    const dateMatch = line.match(/^([A-Z][a-z]{2}\d{1,2})\s/)
    if (dateMatch) {
      const parsedDate = parseDate(dateMatch[1], month, year)
      if (parsedDate) {
        currentDate = parsedDate
        if (!periodStart) periodStart = parsedDate
        periodEnd = parsedDate
      }
    }
    
    // Look for EW flights
    if (line.includes('EW ') && currentDate) {
      const flightData = parseFlightLine(line)
      
      if (flightData && !flightData.flightNumber.includes('DH')) {
        const blockTime = calculateBlockTime(
          flightData.scheduledDep,
          flightData.scheduledArr
        )
        
        flights.push({
          date: currentDate,
          flightNumber: flightData.flightNumber,
          departure: flightData.departure,
          arrival: flightData.arrival,
          scheduledDep: flightData.scheduledDep,
          scheduledArr: flightData.scheduledArr,
          blockTime,
          aircraftType: flightData.aircraftType,
          isDutyPlan: true
        })
      }
    }
  }
  
  // Sort flights by date and time
  flights.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.scheduledDep.localeCompare(b.scheduledDep)
  })
  
  return {
    flights,
    period: { start: periodStart, end: periodEnd },
    errors
  }
}

// Convert duty plan flight to database format
export function convertDutyPlanToDbFlight(
  dutyFlight: DutyPlanFlight,
  userId: string
): Omit<Flight, 'id' | 'created_at' | 'updated_at'> {
  // Create datetime strings for scheduled times
  const offBlock = `${dutyFlight.date}T${dutyFlight.scheduledDep}:00`
  const onBlock = `${dutyFlight.date}T${dutyFlight.scheduledArr}:00`
  
  // Adjust onBlock for overnight flights
  let onBlockDate = dutyFlight.date
  if (dutyFlight.scheduledArr < dutyFlight.scheduledDep) {
    const nextDay = new Date(dutyFlight.date)
    nextDay.setDate(nextDay.getDate() + 1)
    onBlockDate = nextDay.toISOString().split('T')[0]
  }
  const onBlockAdjusted = `${onBlockDate}T${dutyFlight.scheduledArr}:00`
  
  // Default aircraft type for Eurowings
  const aircraftType = dutyFlight.aircraftType 
    ? `A${dutyFlight.aircraftType}` 
    : 'A320'
  
  return {
    user_id: userId,
    flight_date: dutyFlight.date,
    departure_airport: dutyFlight.departure,
    arrival_airport: dutyFlight.arrival,
    off_block: offBlock,
    takeoff: null, // Will be filled later
    landing: null, // Will be filled later
    on_block: onBlockAdjusted,
    aircraft_id: null, // To be assigned later
    aircraft_type: aircraftType,
    registration: 'TBD', // To be filled later
    flight_number: dutyFlight.flightNumber,
    pic_time: 0, // To be filled later
    sic_time: 0, // To be filled later
    block_time: dutyFlight.blockTime,
    night_time: 0, // To be calculated later
    ifr_time: dutyFlight.blockTime, // Assume IFR for airline ops
    vfr_time: 0,
    multi_pilot_time: dutyFlight.blockTime, // Airline ops are multi-pilot
    cross_country_time: dutyFlight.blockTime, // All airline flights are XC
    dual_given_time: 0,
    dual_received_time: 0,
    landings_day: null, // To be filled later
    landings_night: null, // To be filled later
    remarks: 'Imported from Duty Plan - Please update aircraft and times',
    deleted: false,
    deleted_at: null
  }
}