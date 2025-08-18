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

export function exportFlightsToCSV(flights: Flight[]): string {
  const csvData = flights.map(flight => ({
    Date: flight.flight_date,
    'Departure Airport': flight.departure_airport,
    'Arrival Airport': flight.arrival_airport,
    'Departure Time': flight.off_block,
    'Arrival Time': flight.on_block,
    'Aircraft Registration': flight.registration,
    'Aircraft Type': flight.aircraft_type,
    'PIC Time': flight.pic_time,
    'SIC Time': flight.sic_time,
    'Block Time': flight.block_time,
    'Night Time': flight.night_time,
    'IFR Time': flight.ifr_time,
    'VFR Time': flight.vfr_time,
    'Day Landings': flight.landings_day,
    'Night Landings': flight.landings_night,
    'Remarks': flight.remarks
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