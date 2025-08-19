'use client'

import { useState } from 'react'
import { Users, Shield, Activity, Search, Edit, Trash2, UserPlus, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserManagementProps {
  users: any[]
  stats: {
    totalUsers: number
    adminUsers: number
    activeUsers: number
  }
}

export default function UserManagement({ users: initialUsers, stats }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.auth_email?.toLowerCase().includes(searchLower)
    )
  })

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)
      
      if (error) throw error
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_admin: !currentStatus } : u
      ))
      
      // Refresh the page to get updated data
      router.refresh()
    } catch (error) {
      console.error('Error updating admin status:', error)
      alert('Failed to update admin status')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage all system users and their permissions</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.adminUsers}</p>
              <p className="text-sm text-gray-600">Admin Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
              <p className="text-sm text-gray-600">Active (30 days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Sign In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name || 'Unknown'} {user.last_name || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {user.id.substring(0, 8)}...
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.auth_email || user.email || 'No email'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.license_number || 'N/A'}</div>
                  {user.license_expiry && (
                    <div className="text-xs text-gray-500">
                      Expires: {formatDate(user.license_expiry)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(user.last_sign_in)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_admin ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                      className={`p-1 rounded ${
                        user.is_admin 
                          ? 'text-red-600 hover:bg-red-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    >
                      {user.is_admin ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setIsEditModalOpen(true)
                      }}
                      className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                      title="Edit User"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                      title="Delete User"
                      disabled
                    >
                      <Trash2 className="h-5 w-5 opacity-50" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}