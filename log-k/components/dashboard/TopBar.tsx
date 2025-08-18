'use client'

import { Bell, User, Moon, Sun, Monitor } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/lib/hooks/useTheme'
import GlobalSearch from '@/components/ui/search'

export default function TopBar({ user }: { user: any }) {
  const [showProfile, setShowProfile] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const { theme, changeTheme } = useTheme()

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <GlobalSearch />
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => { changeTheme('light'); setShowThemeMenu(false) }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Sun className="h-4 w-4 mr-2" /> Light
              </button>
              <button
                onClick={() => { changeTheme('dark'); setShowThemeMenu(false) }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Moon className="h-4 w-4 mr-2" /> Dark
              </button>
              <button
                onClick={() => { changeTheme('system'); setShowThemeMenu(false) }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Monitor className="h-4 w-4 mr-2" /> System
              </button>
            </div>
          )}
        </div>
        
        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email}</span>
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </a>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}