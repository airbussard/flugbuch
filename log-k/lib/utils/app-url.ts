/**
 * Get the application URL consistently across client and server
 * Prevents issues with localhost/0.0.0.0 in production
 */
export function getAppUrl(): string {
  // In production, always use the configured URL or default to log-k.com
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://log-k.com'
  }
  
  // In development, check for configured URL first
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // Only use window.location.origin as last resort in development
  // and never if it contains 0.0.0.0
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('0.0.0.0')) {
      // Replace 0.0.0.0 with localhost for better compatibility
      return origin.replace('0.0.0.0', 'localhost')
    }
    // In development, localhost is fine
    if (origin.includes('localhost')) {
      return origin
    }
  }
  
  // Default fallback
  return 'https://log-k.com'
}

/**
 * Get the app URL for server-side usage
 * Always returns the production URL
 */
export function getServerAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://log-k.com'
}