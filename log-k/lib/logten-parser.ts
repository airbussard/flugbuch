// LogTen PDF Parser for Flight Import
import { Database } from '@/types/supabase'

type Flight = Database['public']['Tables']['flights']['Row']
type Aircraft = Database['public']['Tables']['aircrafts']['Row']
type CrewMember = Database['public']['Tables']['crew_members']['Row']

export interface ParsedLogTenFlight {
  date: string
  flightNumber?: string
  aircraftId: string
  aircraftType: string
  from: string
  to: string
  scheduledOut?: string
  scheduledIn?: string
  out?: string
  off?: string
  on?: string
  in?: string
  totalTime: number
  night: number
  pic: number
  p1us?: number
  xc: number
  actualInst?: number
  ifr: number
  simulator?: number
  pilotFlying?: boolean
  picCrew?: string
  sicCrew?: string
  observerCrew?: string
  dayTakeoffs: number
  dayLandings: number
  nightTakeoffs: number
  nightLandings: number
  autolands?: number
  approach1?: string
  approach2?: string
  holds?: number
  remarks?: string
}

export interface LogTenImportResult {
  flights: ParsedLogTenFlight[]
  aircraft: Set<{ registration: string; type: string }>
  crewMembers: Set<string>
  errors: string[]
}

// Convert time string "H:MM" or "HH:MM" to decimal hours
function parseTimeToDecimal(timeStr: string | undefined): number {
  if (!timeStr || timeStr.trim() === '') return 0
  
  const parts = timeStr.split(':')
  if (parts.length !== 2) return 0
  
  const hours = parseInt(parts[0]) || 0
  const minutes = parseInt(parts[1]) || 0
  
  return hours + (minutes / 60)
}

// Convert date string to ISO format
function parseDate(dateStr: string): string {
  // Expects format: "2012-01-14" 
  const parts = dateStr.split('-')
  if (parts.length !== 3) return new Date().toISOString().split('T')[0]
  
  return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
}

// Parse time in HHMM format to HH:MM
function parseTime(timeStr: string | undefined): string | null {
  if (!timeStr || timeStr.trim() === '') return null
  
  // Remove any non-numeric characters
  const clean = timeStr.replace(/\D/g, '')
  
  if (clean.length === 4) {
    return `${clean.substring(0, 2)}:${clean.substring(2, 4)}`
  } else if (clean.length === 3) {
    return `0${clean.substring(0, 1)}:${clean.substring(1, 3)}`
  }
  
  return null
}

// Parse crew name (handle special characters)
function parseCrewName(name: string | undefined): string | undefined {
  if (!name || name.trim() === '') return undefined
  
  // Clean up encoding issues (e.g., "GÃ¼nther" -> "Günther")
  return name
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¤/g, 'ä')
    .replace(/ÃŸ/g, 'ß')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ãœ/g, 'Ü')
    .replace(/Ã„/g, 'Ä')
    .trim()
}

// Parse a single line of LogTen data
function parseLogTenLine(line: string): ParsedLogTenFlight | null {
  // Split by multiple spaces (at least 2) to handle the table format
  const parts = line.split(/\s{2,}/).map(p => p.trim())
  
  if (parts.length < 10) return null
  
  // Basic structure based on the PDF format
  let index = 0
  const date = parts[index++]
  
  // Check if date is valid
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  
  // Handle optional flight number
  let flightNumber: string | undefined
  let aircraftId: string
  let aircraftType: string
  
  // Check if next field looks like a flight number (e.g., "XG2393")
  if (/^[A-Z]{2}\d+/.test(parts[index])) {
    flightNumber = parts[index++]
  }
  
  // Aircraft ID and Type
  aircraftId = parts[index++] || ''
  aircraftType = parts[index++] || ''
  
  // Skip if this is a simulator entry (FNPT 2, FFS, FSTD)
  const isSimulator = aircraftType.includes('FNPT') || 
                     aircraftType.includes('FFS') || 
                     aircraftType.includes('FSTD') ||
                     aircraftId.includes('FNPT') ||
                     aircraftId.includes('FFS')
  
  // Airports
  const from = parts[index++] || ''
  const to = parts[index++] || ''
  
  // Times - variable number of time fields
  let out: string | undefined
  let off: string | undefined
  let on: string | undefined
  let inTime: string | undefined
  
  // Look for 4-digit time patterns
  const timePattern = /^\d{4}$/
  const remainingParts = parts.slice(index)
  const times: string[] = []
  
  for (const part of remainingParts) {
    if (timePattern.test(part) && times.length < 4) {
      times.push(part)
    } else if (times.length > 0) {
      break // Stop when we hit non-time data
    }
  }
  
  if (times.length >= 2) {
    out = times[0]
    inTime = times[times.length - 1]
    if (times.length >= 4) {
      off = times[1]
      on = times[2]
    }
  }
  
  // Find the total time (format H:MM or HH:MM)
  const totalTimeMatch = line.match(/\b\d{1,2}:\d{2}\b/)
  const totalTime = totalTimeMatch ? parseTimeToDecimal(totalTimeMatch[0]) : 0
  
  // Extract crew names - look for patterns like "Ryan Crouch" or "Robin Mayer"
  const crewPattern = /([A-Z][a-zÃ¤Ã¶Ã¼ÃŸ]+(?:\s+[A-Z][a-zÃ¤Ã¶Ã¼ÃŸ]+)+)/g
  const crews = line.match(crewPattern) || []
  const picCrew = crews[0] ? parseCrewName(crews[0]) : undefined
  const sicCrew = crews[1] ? parseCrewName(crews[1]) : undefined
  
  // Extract landing counts - look for single digits at end of line
  const landingPattern = /\b(\d{1})\s+(\d{1})\s*$/
  const landingMatch = line.match(landingPattern)
  const dayLandings = landingMatch ? parseInt(landingMatch[1]) : 0
  const nightLandings = landingMatch ? parseInt(landingMatch[2]) : 0
  
  // Build the parsed flight
  const flight: ParsedLogTenFlight = {
    date: parseDate(date),
    flightNumber,
    aircraftId: isSimulator ? 'SIMULATOR' : aircraftId,
    aircraftType,
    from,
    to,
    out: parseTime(out) || undefined,
    off: parseTime(off) || undefined,
    on: parseTime(on) || undefined,
    in: parseTime(inTime) || undefined,
    totalTime,
    night: 0, // Will need to be calculated or extracted
    pic: totalTime, // Default to total time, adjust based on crew role
    xc: from !== to ? totalTime : 0, // Cross country if different airports
    ifr: 0, // Need more context to determine
    simulator: isSimulator ? totalTime : 0,
    picCrew,
    sicCrew,
    dayTakeoffs: dayLandings, // Assume takeoffs = landings
    dayLandings,
    nightTakeoffs: nightLandings,
    nightLandings,
    remarks: undefined
  }
  
  return flight
}

// Main parser function for PDF text
export function parseLogTenPDFText(pdfText: string): LogTenImportResult {
  const lines = pdfText.split('\n')
  const flights: ParsedLogTenFlight[] = []
  const aircraft = new Set<{ registration: string; type: string }>()
  const crewMembers = new Set<string>()
  const errors: string[] = []
  
  for (const line of lines) {
    // Skip header lines and empty lines
    if (!line.trim() || 
        line.includes('Date') || 
        line.includes('Flight #') ||
        line.includes('Total Time') ||
        line.includes('Aircraft ID')) {
      continue
    }
    
    try {
      const flight = parseLogTenLine(line)
      if (flight) {
        flights.push(flight)
        
        // Collect unique aircraft
        if (flight.aircraftId && flight.aircraftId !== 'SIMULATOR') {
          aircraft.add({
            registration: flight.aircraftId,
            type: flight.aircraftType
          })
        }
        
        // Collect unique crew members
        if (flight.picCrew) crewMembers.add(flight.picCrew)
        if (flight.sicCrew) crewMembers.add(flight.sicCrew)
        if (flight.observerCrew) crewMembers.add(flight.observerCrew)
      }
    } catch (error) {
      errors.push(`Error parsing line: ${line.substring(0, 50)}...`)
    }
  }
  
  return {
    flights,
    aircraft,
    crewMembers,
    errors
  }
}

// Convert parsed LogTen flight to database format
export function convertToDbFlight(
  parsed: ParsedLogTenFlight,
  userId: string,
  aircraftId?: string
): Omit<Flight, 'id' | 'created_at' | 'updated_at'> {
  // Combine date with times if available
  const flightDate = parsed.date
  
  let offBlock: string | null = null
  let takeoff: string | null = null
  let landing: string | null = null
  let onBlock: string | null = null
  
  if (parsed.out) {
    offBlock = `${flightDate}T${parsed.out}:00`
  }
  if (parsed.off) {
    takeoff = `${flightDate}T${parsed.off}:00`
  }
  if (parsed.on) {
    landing = `${flightDate}T${parsed.on}:00`
  }
  if (parsed.in) {
    onBlock = `${flightDate}T${parsed.in}:00`
  }
  
  return {
    user_id: userId,
    flight_date: flightDate,
    departure_airport: parsed.from,
    arrival_airport: parsed.to,
    off_block: offBlock,
    takeoff: takeoff,
    landing: landing,
    on_block: onBlock,
    aircraft_id: aircraftId || null,
    aircraft_type: parsed.aircraftType,
    registration: parsed.aircraftId,
    flight_number: parsed.flightNumber || null,
    pic_time: parsed.pic,
    sic_time: parsed.simulator ? 0 : (parsed.totalTime - parsed.pic),
    block_time: parsed.totalTime,
    night_time: parsed.night,
    ifr_time: parsed.ifr,
    vfr_time: parsed.totalTime - parsed.ifr,
    multi_pilot_time: parsed.sicCrew ? parsed.totalTime : 0,
    cross_country_time: parsed.xc,
    dual_given_time: 0,
    dual_received_time: 0,
    landings_day: parsed.dayLandings,
    landings_night: parsed.nightLandings,
    remarks: parsed.remarks || null,
    deleted: false,
    deleted_at: null
  }
}

// Create aircraft from parsed data
export function createAircraftFromParsed(
  registration: string,
  type: string,
  userId: string
): Omit<Aircraft, 'id' | 'created_at' | 'updated_at'> {
  // Determine aircraft class based on type
  let aircraftClass: 'SEP' | 'MEP' | 'SET' | 'MET' | null = null
  let engineType = 'Piston'
  
  const typeUpper = type.toUpperCase()
  
  if (typeUpper.includes('PA44') || typeUpper.includes('TWIN')) {
    aircraftClass = 'MEP'
  } else if (typeUpper.includes('PA28') || typeUpper.includes('DA40') || typeUpper.includes('C172')) {
    aircraftClass = 'SEP'
  } else if (typeUpper.includes('B737') || typeUpper.includes('A320')) {
    aircraftClass = 'MET'
    engineType = 'Turbofan'
  }
  
  return {
    user_id: userId,
    registration,
    aircraft_type: type,
    serial_number: null,
    engine_type: engineType,
    first_flight: null,
    aircraft_class: aircraftClass,
    default_condition: aircraftClass === 'MET' ? 'IFR' : 'VFR',
    complex_aircraft: aircraftClass === 'MEP' || aircraftClass === 'MET',
    high_performance: aircraftClass === 'MET',
    tailwheel: false,
    glass_panel: typeUpper.includes('B737') || typeUpper.includes('A320'),
    economy_seats: null,
    premium_economy_seats: null,
    business_seats: null,
    first_class_seats: null,
    deleted: false
  }
}

// Create crew member from name
export function createCrewMemberFromName(
  name: string,
  userId: string,
  role?: string
): Omit<CrewMember, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    name,
    email: null,
    phone: null,
    license_number: null,
    role: role || null,
    deleted: false
  }
}