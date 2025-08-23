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
  debugInfo?: string[]
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
  // Expects format: "2012-01-14" or "2012-02-29"
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

// Fix encoding issues in text
function fixEncoding(text: string): string {
  return text
    // Fix common UTF-8 encoding issues
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¤/g, 'ä')
    .replace(/ÃŸ/g, 'ß')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ãœ/g, 'Ü')
    .replace(/Ã„/g, 'Ä')
    // Also try alternative encodings
    .replace(/Ä/g, 'ü')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¤/g, 'ä')
    .trim()
}

// Parse crew name with better pattern matching
function extractCrewNames(line: string): { pic?: string; sic?: string } {
  const fixedLine = fixEncoding(line)
  const result: { pic?: string; sic?: string } = {}
  
  // Debug: Log the line we're trying to extract crew from
  console.log('Extracting crew from line:', fixedLine)
  
  // Pattern 1: Look for names in format "FirstName LastName"
  // This pattern is more flexible and doesn't rely on special characters
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g
  const names: string[] = []
  let match
  
  while ((match = namePattern.exec(fixedLine)) !== null) {
    const name = match[1]
    // Filter out common non-name patterns
    if (!name.includes('SIMULATOR') && 
        !name.includes('FNPT') && 
        !name.includes('FFS') &&
        !name.includes('Total') &&
        !name.includes('Night') &&
        !name.includes('Cross') &&
        !name.includes('Country')) {
      names.push(name)
    }
  }
  
  // Pattern 2: Look for specific crew patterns like "Logan Battles Robin Mayer"
  // This handles names that might be concatenated
  const crewPattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/
  const crewMatch = fixedLine.match(crewPattern)
  
  if (crewMatch) {
    result.pic = crewMatch[1]
    result.sic = crewMatch[2]
  } else if (names.length > 0) {
    // Use extracted names
    result.pic = names[0]
    if (names.length > 1) {
      result.sic = names[1]
    }
  }
  
  // Pattern 3: Look for names after specific markers
  const afterRoutePattern = /[A-Z]{3,4}\s+→\s+[A-Z]{3,4}\s+(.*?)(?:\d{1}:\d{2}|\d{1}\s+\d{1}|$)/
  const afterRouteMatch = fixedLine.match(afterRoutePattern)
  
  if (afterRouteMatch && !result.pic) {
    const crewSection = afterRouteMatch[1]
    const crewNames = crewSection.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g)
    if (crewNames && crewNames.length > 0) {
      result.pic = crewNames[0]
      if (crewNames.length > 1) {
        result.sic = crewNames[1]
      }
    }
  }
  
  console.log('Extracted crew:', result)
  return result
}

// Parse a single line of LogTen data with improved logic
function parseLogTenLine(line: string, debugInfo?: string[]): ParsedLogTenFlight | null {
  const fixedLine = fixEncoding(line)
  
  // Debug logging
  if (debugInfo) {
    debugInfo.push(`Parsing line: ${fixedLine.substring(0, 100)}...`)
  }
  
  // Try multiple splitting strategies
  let parts = fixedLine.split(/\s{2,}/).map(p => p.trim()).filter(p => p.length > 0)
  
  // If we don't have enough parts, try splitting by single spaces
  if (parts.length < 6) {
    parts = fixedLine.split(/\s+/).map(p => p.trim()).filter(p => p.length > 0)
  }
  
  if (parts.length < 6) {
    if (debugInfo) {
      debugInfo.push(`Skipping line - not enough parts: ${parts.length}`)
    }
    return null
  }
  
  let index = 0
  const date = parts[index++]
  
  // Check if date is valid
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    if (debugInfo) {
      debugInfo.push(`Invalid date format: ${date}`)
    }
    return null
  }
  
  // Handle optional flight number
  let flightNumber: string | undefined
  let aircraftId: string
  let aircraftType: string
  
  // Check if next field looks like a flight number
  if (index < parts.length && /^[A-Z]{2}\d+/.test(parts[index])) {
    flightNumber = parts[index++]
  }
  
  // Aircraft ID and Type
  aircraftId = parts[index++] || ''
  
  // Handle aircraft type - might be multiple parts (e.g., "PA44-180 SEMINOLE")
  const typeStartIndex = index
  let typeEndIndex = index
  
  // Look for airport codes (3-4 uppercase letters)
  while (typeEndIndex < parts.length && !/^[A-Z]{3,4}$/.test(parts[typeEndIndex])) {
    typeEndIndex++
  }
  
  if (typeEndIndex > typeStartIndex) {
    aircraftType = parts.slice(typeStartIndex, typeEndIndex).join(' ')
    index = typeEndIndex
  } else {
    aircraftType = parts[index++] || ''
  }
  
  // Skip if this is a simulator entry
  const isSimulator = aircraftType.includes('SIMULATOR') ||
                     aircraftType.includes('FNPT') || 
                     aircraftType.includes('FFS') || 
                     aircraftType.includes('FSTD') ||
                     aircraftId.includes('SIMULATOR') ||
                     aircraftId.includes('FNPT') ||
                     aircraftId.includes('FFS')
  
  // Airports
  const from = parts[index++] || ''
  
  // Handle arrow separator if present
  if (parts[index] === '→' || parts[index] === '->' || parts[index] === 'to') {
    index++
  }
  
  const to = parts[index++] || ''
  
  // Find time data - look for H:MM or HH:MM pattern
  const totalTimeMatch = fixedLine.match(/\b(\d{1,2}:\d{2})\b/)
  const totalTime = totalTimeMatch ? parseTimeToDecimal(totalTimeMatch[1]) : 0
  
  // Look for landing counts - typically at the end
  const landingPattern = /\b(\d)\s+(\d)\s*$/
  const landingMatch = fixedLine.match(landingPattern)
  const dayLandings = landingMatch ? parseInt(landingMatch[1]) : 1
  const nightLandings = landingMatch ? parseInt(landingMatch[2]) : 0
  
  // Extract crew names with improved logic
  const crew = extractCrewNames(fixedLine)
  
  // Look for times in HHMM format
  const timePattern = /\b(\d{4})\b/g
  const times: string[] = []
  let timeMatch
  
  while ((timeMatch = timePattern.exec(fixedLine)) !== null) {
    if (times.length < 4) {
      times.push(timeMatch[1])
    }
  }
  
  let out: string | undefined
  let off: string | undefined
  let on: string | undefined
  let inTime: string | undefined
  
  if (times.length >= 2) {
    out = times[0]
    inTime = times[times.length - 1]
    if (times.length >= 4) {
      off = times[1]
      on = times[2]
    }
  }
  
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
    night: nightLandings > 0 ? totalTime * 0.3 : 0, // Estimate night time
    pic: totalTime, // Default to total time
    xc: from !== to ? totalTime : 0,
    ifr: 0, // Would need more context
    simulator: isSimulator ? totalTime : 0,
    picCrew: crew.pic,
    sicCrew: crew.sic,
    dayTakeoffs: dayLandings,
    dayLandings,
    nightTakeoffs: nightLandings,
    nightLandings,
    remarks: undefined
  }
  
  if (debugInfo) {
    debugInfo.push(`Parsed flight: ${JSON.stringify(flight)}`)
  }
  
  return flight
}

// Main parser function for PDF text with better debugging
export function parseLogTenPDFText(pdfText: string): LogTenImportResult {
  const fixedText = fixEncoding(pdfText)
  const lines = fixedText.split('\n')
  const flights: ParsedLogTenFlight[] = []
  const aircraft = new Set<{ registration: string; type: string }>()
  const crewMembers = new Set<string>()
  const errors: string[] = []
  const debugInfo: string[] = []
  
  debugInfo.push(`Processing ${lines.length} lines`)
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip header lines and empty lines
    if (!line.trim() || 
        line.includes('Date') || 
        line.includes('Flight #') ||
        line.includes('Total Time') ||
        line.includes('Aircraft ID') ||
        line.includes('Page') ||
        line.includes('LogTen')) {
      continue
    }
    
    try {
      const flight = parseLogTenLine(line, debugInfo)
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
        if (flight.picCrew) {
          crewMembers.add(flight.picCrew)
          debugInfo.push(`Added PIC crew: ${flight.picCrew}`)
        }
        if (flight.sicCrew) {
          crewMembers.add(flight.sicCrew)
          debugInfo.push(`Added SIC crew: ${flight.sicCrew}`)
        }
        if (flight.observerCrew) {
          crewMembers.add(flight.observerCrew)
          debugInfo.push(`Added Observer crew: ${flight.observerCrew}`)
        }
      }
    } catch (error) {
      const errorMsg = `Error parsing line ${i + 1}: ${line.substring(0, 50)}...`
      errors.push(errorMsg)
      debugInfo.push(errorMsg)
    }
  }
  
  debugInfo.push(`Found ${flights.length} flights, ${aircraft.size} aircraft, ${crewMembers.size} crew members`)
  
  // Log debug info to console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('LogTen Parser Debug Info:', debugInfo)
  }
  
  return {
    flights,
    aircraft,
    crewMembers,
    errors,
    debugInfo
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
    sic_time: parsed.simulator ? 0 : Math.max(0, parsed.totalTime - parsed.pic),
    block_time: parsed.totalTime,
    night_time: parsed.night,
    ifr_time: parsed.ifr,
    vfr_time: Math.max(0, parsed.totalTime - parsed.ifr),
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
  
  // Multi-engine piston
  if (typeUpper.includes('PA44') || 
      typeUpper.includes('TWIN') || 
      typeUpper.includes('SEMINOLE') ||
      typeUpper.includes('DUCHESS')) {
    aircraftClass = 'MEP'
  } 
  // Single-engine piston
  else if (typeUpper.includes('PA28') || 
           typeUpper.includes('DA40') || 
           typeUpper.includes('C172') ||
           typeUpper.includes('C152') ||
           typeUpper.includes('CESSNA') ||
           typeUpper.includes('PIPER')) {
    aircraftClass = 'SEP'
  } 
  // Multi-engine turbine (jets)
  else if (typeUpper.includes('B737') || 
           typeUpper.includes('A320') ||
           typeUpper.includes('A319') ||
           typeUpper.includes('A321') ||
           typeUpper.includes('BOEING') ||
           typeUpper.includes('AIRBUS')) {
    aircraftClass = 'MET'
    engineType = 'Turbofan'
  }
  // Single-engine turboprop
  else if (typeUpper.includes('PC12') || 
           typeUpper.includes('TBM') ||
           typeUpper.includes('CARAVAN')) {
    aircraftClass = 'SET'
    engineType = 'Turboprop'
  }
  
  return {
    user_id: userId,
    registration,
    aircraft_type: type,
    serial_number: null,
    engine_type: engineType,
    first_flight: null,
    aircraft_class: aircraftClass,
    default_condition: aircraftClass === 'MET' || aircraftClass === 'MEP' ? 'IFR' : 'VFR',
    complex_aircraft: aircraftClass === 'MEP' || aircraftClass === 'MET',
    high_performance: aircraftClass === 'MET' || aircraftClass === 'SET',
    tailwheel: false,
    glass_panel: typeUpper.includes('B737') || typeUpper.includes('A320') || typeUpper.includes('G1000'),
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
    name: fixEncoding(name), // Fix encoding issues
    email: null,
    phone: null,
    license_number: null,
    role: role || null,
    deleted: false
  }
}