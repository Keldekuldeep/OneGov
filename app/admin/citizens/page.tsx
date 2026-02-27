"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserCheck, Search, Ban, CheckCircle } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { authAPI, adminAPI } from '@/lib/api'
import { getStatusBadgeColor, formatDate } from '@/lib/adminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CitizensPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [citizens, setCitizens] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    // Check if admin is logged in
    const admin = authAPI.getCurrentAdmin()
    if (!admin) {
      router.push('/admin/login')
      return
    }

    // Fetch citizens from backend
    fetchCitizens()
  }, [router])

  const fetchCitizens = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAllCitizens()
      setCitizens(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch citizens:', error)
      setCitizens([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const filteredCitizens = citizens.filter((citizen) => {
    const matchesSearch = 
      citizen.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      citizen.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      citizen.phone?.includes(searchValue)
    const matchesStatus = statusFilter === 'all' || citizen.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = async (citizenId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked'
    
    try {
      await adminAPI.updateCitizenStatus(citizenId, newStatus)
      alert(`Citizen ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully!`)
      fetchCitizens() // Refresh list
    } catch (error) {
      console.error('Failed to update citizen status:', error)
      alert('Failed to update citizen status')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Citizens Management</h1>
                <p className="text-gray-600 mt-1">View and manage all registered citizens</p>
              </div>
              <UserCheck className="text-purple-600" size={32} />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading citizens...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Total Citizens</p>
                    <p className="text-2xl font-bold text-gray-900">{citizens.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {citizens.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <p className="text-sm text-red-600">Blocked</p>
                    <p className="text-2xl font-bold text-red-900">
                      {citizens.filter(c => c.status === 'blocked').length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-blue-600">Total Applications</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {citizens.reduce((sum, c) => sum + (c.totalApplications || 0), 0)}
                    </p>
                  </div>
                </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredCitizens.length} Citizen{filteredCitizens.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Citizen</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Aadhaar</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Activity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Registered</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCitizens.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center">
                          <p className="text-gray-500">No citizens found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCitizens.map((citizen) => (
                        <tr key={citizen.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{citizen.name}</p>
                              <p className="text-sm text-gray-600">{citizen.email}</p>
                              <p className="text-xs text-gray-500">{citizen.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 font-mono">{citizen.aadhaar || 'N/A'}</td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900">{citizen.totalApplications || 0} applications</p>
                              <p className="text-gray-600">{citizen.totalComplaints || 0} complaints</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatDate(citizen.registeredAt || citizen.createdAt)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(citizen.status)}`}>
                              {citizen.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Link href={`/admin/citizens/${citizen.id}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className={citizen.status === 'blocked' ? 'text-green-600' : 'text-red-600'}
                                onClick={() => handleToggleStatus(citizen.id, citizen.status)}
                              >
                                {citizen.status === 'blocked' ? (
                                  <><CheckCircle size={14} className="mr-1" /> Unblock</>
                                ) : (
                                  <><Ban size={14} className="mr-1" /> Block</>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
