'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bug, ChevronDown, ChevronUp, X } from 'lucide-react'
import { debug } from '@/lib/debug'

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Get user info
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      debug.auth('DebugPanel: User loaded', { userId: user?.id, email: user?.email })
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      debug.auth(`DebugPanel: Auth state changed - ${event}`, { 
        userId: session?.user?.id,
        email: session?.user?.email
      })
    })

    // Update logs periodically
    const interval = setInterval(() => {
      setLogs(debug.getLogs())
    }, 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null

  const levelColors: Record<string, string> = {
    AUTH: 'text-cyan-600',
    DB: 'text-purple-600',
    QUERY: 'text-blue-600',
    ERROR: 'text-red-600',
    SUCCESS: 'text-green-600',
    INFO: 'text-gray-600',
    WARN: 'text-orange-600'
  }

  const bgColors: Record<string, string> = {
    AUTH: 'bg-cyan-50',
    DB: 'bg-purple-50',
    QUERY: 'bg-blue-50',
    ERROR: 'bg-red-50',
    SUCCESS: 'bg-green-50',
    INFO: 'bg-gray-50',
    WARN: 'bg-orange-50'
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          <span className="font-semibold">Debug Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-purple-800 rounded transition-colors"
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-purple-800 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* User Info */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Current User</div>
            {user ? (
              <div className="space-y-1">
                <div className="text-xs">
                  <span className="font-medium">ID:</span> 
                  <span className="font-mono text-purple-600 ml-1">{user.id}</span>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Email:</span> 
                  <span className="ml-1">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-red-600">Not authenticated</div>
            )}
          </div>

          {/* Logs */}
          <div className="p-3 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-semibold text-gray-600">Recent Logs</div>
              <button
                onClick={() => {
                  debug.clearLogs()
                  setLogs([])
                }}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                Clear
              </button>
            </div>
            
            {logs.length === 0 ? (
              <div className="text-xs text-gray-500 italic">No logs yet...</div>
            ) : (
              <div className="space-y-2">
                {logs.slice(-20).reverse().map((log, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${bgColors[log.level] || 'bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`font-semibold ${levelColors[log.level] || 'text-gray-600'}`}>
                        [{log.level}]
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{log.message}</div>
                        {log.data && (
                          <div className="mt-1 font-mono text-[10px] text-gray-600 bg-white/50 p-1 rounded">
                            {typeof log.data === 'object' 
                              ? JSON.stringify(log.data, null, 2)
                              : log.data}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs font-semibold text-gray-600 mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser()
                  debug.info('Manual auth check', { 
                    authenticated: !!user,
                    userId: user?.id,
                    email: user?.email 
                  })
                }}
                className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
              >
                Check Auth
              </button>
              <button
                onClick={async () => {
                  const { data, error } = await supabase
                    .from('aircrafts')
                    .select('id, registration')
                    .limit(5)
                  debug.query('Manual query test', { 
                    table: 'aircrafts',
                    count: data?.length || 0,
                    error: error?.message 
                  })
                }}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Test Query
              </button>
              <button
                onClick={() => {
                  console.table(logs.slice(-10))
                }}
                className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
              >
                Log to Console
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}