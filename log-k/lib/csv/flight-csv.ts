import Papa from 'papaparse'
import { Database } from '@/types/supabase'

type Flight = Database['public']['Tables']['flights']['Row']

export interface CSVFlight {
  date: string
  departure_airport: string
  arrival_airport: string
  departure_time?: string
  arrival_time?: string
  aircraft_registration: string
  aircraft_type?: string
  pic_name?: string
  flight_time: number
  block_time?: number
  night_time?: number
  ifr_time?: number
  vfr_time?: number
  landings_day?: number
  landings_night?: number
  remarks?: string
}

// Convert decimal hours to HH:MM format (e.g., 2.5 -> "2:30")
function decimalToHHMM(decimal: number | null | undefined): string {
  if (!decimal || decimal === 0) return '0:00'
  
  const hours = Math.floor(decimal)
  const minutes = Math.round((decimal - hours) * 60)
  
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

export function exportFlightsToCSV(flights: Flight[]): string {
  const csvData = flights.map(flight => ({
    Date: flight.flight_date,
    'Flight Number': flight.flight_number || '',
    'Departure': flight.departure_airport,
    'Arrival': flight.arrival_airport,
    'Dep Time': flight.off_block ? new Date(flight.off_block).toISOString().slice(11, 16) : '',
    'Arr Time': flight.on_block ? new Date(flight.on_block).toISOString().slice(11, 16) : '',
    'Takeoff Time': flight.takeoff ? new Date(flight.takeoff).toISOString().slice(11, 16) : '',
    'Landing Time': flight.landing ? new Date(flight.landing).toISOString().slice(11, 16) : '',
    'Aircraft Registration': flight.registration,
    'Aircraft Type': flight.aircraft_type,
    'Position': flight.dual_given_time && flight.dual_given_time > 0 ? 'INSTRUCTOR' : (flight.pic_time && flight.pic_time > 0 ? 'PIC' : 'SIC'),
    'Block Time': decimalToHHMM(flight.block_time),
    'Total Time': decimalToHHMM(flight.block_time),
    'PIC Time': decimalToHHMM(flight.pic_time),
    'SIC Time': decimalToHHMM(flight.sic_time),
    'Multi Pilot Time': decimalToHHMM(flight.multi_pilot_time),
    'IFR Time': decimalToHHMM(flight.ifr_time),
    'VFR Time': decimalToHHMM(flight.vfr_time),
    'Night Time': decimalToHHMM(flight.night_time),
    'Cross Country Time': decimalToHHMM(flight.cross_country_time),
    'Dual Given': decimalToHHMM(flight.dual_given_time),
    'Dual Received': decimalToHHMM(flight.dual_received_time),
    'Day Landings': flight.landings_day || 0,
    'Night Landings': flight.landings_night || 0,
    'Pilot Flying': flight.pic_time && flight.pic_time > 0 ? 'YES' : 'NO',
    'Notes': flight.remarks || ''
  }))

  return Papa.unparse(csvData)
}

export function downloadCSV(csvContent: string, filename: string = 'flights.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSVFile(file: File): Promise<CSVFlight[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const flights: CSVFlight[] = results.data.map((row: any) => ({
          date: row['Date'] || row['date'],
          departure_airport: row['Departure Airport'] || row['departure_airport'],
          arrival_airport: row['Arrival Airport'] || row['arrival_airport'],
          departure_time: row['Departure Time'] || row['departure_time'],
          arrival_time: row['Arrival Time'] || row['arrival_time'],
          aircraft_registration: row['Aircraft Registration'] || row['aircraft_registration'],
          aircraft_type: row['Aircraft Type'] || row['aircraft_type'],
          pic_name: row['PIC Name'] || row['pic_name'],
          flight_time: parseFloat(row['Flight Time'] || row['flight_time'] || 0),
          block_time: parseFloat(row['Block Time'] || row['block_time'] || 0),
          night_time: parseFloat(row['Night Time'] || row['night_time'] || 0),
          ifr_time: parseFloat(row['IFR Time'] || row['ifr_time'] || 0),
          vfr_time: parseFloat(row['VFR Time'] || row['vfr_time'] || 0),
          landings_day: parseInt(row['Day Landings'] || row['landings_day'] || 0),
          landings_night: parseInt(row['Night Landings'] || row['landings_night'] || 0),
          remarks: row['Remarks'] || row['remarks']
        }))
        resolve(flights)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}