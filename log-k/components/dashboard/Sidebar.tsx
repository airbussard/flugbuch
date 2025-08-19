'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Plane, Home, BookOpen, Users, Settings, BarChart3, LogOut, Cloud, Map, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Flights', href: '/flights', icon: BookOpen },
  { name: 'Fleet', href: '/fleet', icon: Plane },
  { name: 'Crew', href: '/crew', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'Planning', href: '/planning', icon: Map },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClient()

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)  // Primary key is 'id', not 'user_id'
          .single()
        
        if (profile?.is_admin) {
          setIsAdmin(true)
        }
      }
    }
    checkAdminStatus()
  }, [supabase])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Plane className="h-8 w-8 text-purple-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Log-K</span>
        </Link>
      </div>
      <div className="h-16 border-b border-gray-200 dark:border-gray-700" />
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-lg',
                isActive
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
        
        {/* Admin Menu Item - Only visible for admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-lg',
              pathname === '/admin'
                ? 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <Shield
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                pathname === '/admin' ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-500'
              )}
            />
            Admin
          </Link>
        )}
      </nav>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}