'use client'

import { Users, Plane, BarChart3, Activity, Shield, Database } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalFlights: number
    totalAircraft: number
    activeToday: number
  }
  recentUsers: any[]
  recentActivity: any[]
}

export default function AdminDashboard({ stats, recentUsers, recentActivity }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-6 w-6 text-purple-600" />}
          trend="Registered users"
        />
        <StatsCard
          title="Total Flights"
          value={stats.totalFlights.toString()}
          icon={<Plane className="h-6 w-6 text-blue-600" />}
          trend="System-wide"
        />
        <StatsCard
          title="Total Aircraft"
          value={stats.totalAircraft.toString()}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
          trend="In all fleets"
        />
        <StatsCard
          title="Active Today"
          value={stats.activeToday.toString()}
          icon={<Activity className="h-6 w-6 text-orange-600" />}
          trend="Current sessions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.user_id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email || 'No email'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  {user.is_admin && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.map((flight) => (
              <div key={flight.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">
                    {flight.departure_airport} → {flight.arrival_airport}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.user_profiles?.first_name} {flight.user_profiles?.last_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {flight.block_time ? `${Math.floor(flight.block_time)}:${Math.round((flight.block_time % 1) * 60).toString().padStart(2, '0')}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {flight.flight_date ? new Date(flight.flight_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Tools */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">System Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium">User Management</p>
            <p className="text-sm text-gray-500">Manage user accounts</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Database className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium">Database Backup</p>
            <p className="text-sm text-gray-500">Export system data</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium">System Logs</p>
            <p className="text-sm text-gray-500">View activity logs</p>
          </button>
        </div>
      </div>
    </div>
  )
}