/**
 * Debug Logger for Development
 * Only active in development environment
 */

const isDev = process.env.NODE_ENV === 'development'

type LogLevel = 'AUTH' | 'DB' | 'QUERY' | 'ERROR' | 'SUCCESS' | 'INFO' | 'WARN'

const colors = {
  AUTH: '\x1b[36m',     // Cyan
  DB: '\x1b[35m',       // Magenta
  QUERY: '\x1b[34m',    // Blue
  ERROR: '\x1b[31m',    // Red
  SUCCESS: '\x1b[32m',  // Green
  INFO: '\x1b[37m',     // White
  WARN: '\x1b[33m',     // Yellow
  RESET: '\x1b[0m'
}

const browserColors = {
  AUTH: 'color: #00bcd4; font-weight: bold',
  DB: 'color: #9c27b0; font-weight: bold',
  QUERY: 'color: #2196f3; font-weight: bold',
  ERROR: 'color: #f44336; font-weight: bold',
  SUCCESS: 'color: #4caf50; font-weight: bold',
  INFO: 'color: #666; font-weight: bold',
  WARN: 'color: #ff9800; font-weight: bold'
}

class DebugLogger {
  private logs: Array<{
    level: LogLevel
    message: string
    data?: any
    timestamp: Date
  }> = []

  log(level: LogLevel, message: string, data?: any) {
    if (!isDev) return

    const timestamp = new Date()
    const timeStr = timestamp.toLocaleTimeString()
    
    // Store in memory for debug panel
    this.logs.push({ level, message, data, timestamp })
    if (this.logs.length > 100) {
      this.logs.shift() // Keep only last 100 logs
    }

    // Check if we're in browser or server
    if (typeof window !== 'undefined') {
      // Browser logging with colors
      const style = browserColors[level]
      console.log(
        `%c[${level}] ${timeStr} - ${message}`,
        style,
        data ? data : ''
      )
      
      // Log data separately if it exists
      if (data && typeof data === 'object') {
        console.table(data)
      }
    } else {
      // Server logging with terminal colors
      const color = colors[level]
      console.log(
        `${color}[${level}]${colors.RESET} ${timeStr} - ${message}`,
        data ? JSON.stringify(data, null, 2) : ''
      )
    }
  }

  auth(message: string, data?: any) {
    this.log('AUTH', message, data)
  }

  db(message: string, data?: any) {
    this.log('DB', message, data)
  }

  query(message: string, data?: any) {
    this.log('QUERY', message, data)
  }

  error(message: string, data?: any) {
    this.log('ERROR', message, data)
  }

  success(message: string, data?: any) {
    this.log('SUCCESS', message, data)
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data)
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data)
  }

  getLogs() {
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }
}

// Export singleton instance
export const debug = new DebugLogger()

// Helper function to log Supabase queries
export function logSupabaseQuery(
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  filters?: Record<string, any>,
  data?: any
) {
  const queryInfo = {
    table,
    operation,
    filters,
    ...(data && { data })
  }
  
  debug.query(`Supabase ${operation.toUpperCase()} on ${table}`, queryInfo)
}

// Helper to log API responses
export function logSupabaseResponse(
  table: string,
  data: any,
  error: any
) {
  if (error) {
    debug.error(`Supabase error on ${table}`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
  } else {
    const count = Array.isArray(data) ? data.length : 1
    debug.success(`Supabase response from ${table}`, {
      count,
      sample: Array.isArray(data) ? data[0] : data
    })
  }
}