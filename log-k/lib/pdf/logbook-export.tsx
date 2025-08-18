import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'
import { formatDate, formatTime } from '@/lib/utils'

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
  },
  tableCellSmall: {
    width: 60,
    padding: 5,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  }
})

interface Flight {
  id: string
  date: string
  departure_airport: string | null
  arrival_airport: string | null
  aircraft_registration: string | null
  aircraft_type: string | null
  pic_name: string | null
  flight_time: number | null
  landings_day: number | null
  landings_night: number | null
  remarks: string | null
}

interface LogbookPDFProps {
  flights: Flight[]
  pilotName?: string
  licenseNumber?: string
}

// PDF Document Component
export const LogbookPDF: React.FC<LogbookPDFProps> = ({ 
  flights, 
  pilotName = 'Pilot Name',
  licenseNumber = ''
}) => {
  const totalHours = flights.reduce((sum, f) => sum + (f.flight_time || 0), 0)
  const totalLandings = flights.reduce((sum, f) => sum + (f.landings_day || 0) + (f.landings_night || 0), 0)

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pilot Logbook</Text>
          <Text style={styles.subtitle}>{pilotName}</Text>
          {licenseNumber && <Text style={styles.subtitle}>License: {licenseNumber}</Text>}
          <Text style={styles.subtitle}>Generated: {formatDate(new Date())}</Text>
        </View>

        {/* Table Header */}
        <View style={[styles.table]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellSmall}>Date</Text>
            <Text style={styles.tableCell}>Route</Text>
            <Text style={styles.tableCell}>Aircraft</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>PIC</Text>
            <Text style={styles.tableCellSmall}>Time</Text>
            <Text style={styles.tableCellSmall}>Day/Night</Text>
            <Text style={styles.tableCell}>Remarks</Text>
          </View>

          {/* Table Rows */}
          {flights.map((flight) => (
            <View key={flight.id} style={styles.tableRow}>
              <Text style={styles.tableCellSmall}>{formatDate(flight.date)}</Text>
              <Text style={styles.tableCell}>
                {flight.departure_airport} - {flight.arrival_airport}
              </Text>
              <Text style={styles.tableCell}>{flight.aircraft_registration}</Text>
              <Text style={styles.tableCell}>{flight.aircraft_type}</Text>
              <Text style={styles.tableCell}>{flight.pic_name || 'Self'}</Text>
              <Text style={styles.tableCellSmall}>{formatTime(flight.flight_time || 0)}</Text>
              <Text style={styles.tableCellSmall}>
                {flight.landings_day || 0}/{flight.landings_night || 0}
              </Text>
              <Text style={styles.tableCell}>{flight.remarks || ''}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Flights: {flights.length}</Text>
            <Text>Total Hours: {formatTime(totalHours)}</Text>
            <Text>Total Landings: {totalLandings}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Page 1 | Generated with Log-K Digital Logbook
        </Text>
      </Page>
    </Document>
  )
}

// Export Button Component
export const ExportPDFButton: React.FC<{ flights: Flight[], pilotName?: string, licenseNumber?: string }> = ({ 
  flights, 
  pilotName,
  licenseNumber 
}) => {
  return (
    <PDFDownloadLink
      document={<LogbookPDF flights={flights} pilotName={pilotName} licenseNumber={licenseNumber} />}
      fileName={`logbook_${new Date().toISOString().split('T')[0]}.pdf`}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  )
}