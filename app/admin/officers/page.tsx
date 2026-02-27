"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { authAPI, adminAPI } from '@/lib/api'
import { getStatusBadgeColor, getDepartmentColor } from '@/lib/adminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OfficersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [officers, setOfficers] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    // Check if admin is logged in
    const admin = authAPI.getCurrentAdmin()
    if (!admin) {
      router.push('/admin/login')
      return
    }

    // Fetch officers from backend
    fetchOfficers()
  }, [router])

  const fetchOfficers = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAllOfficers()
      setOfficers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch officers:', error)
      setOfficers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (officerId: string) => {
    if (!confirm('Are you sure you want to delete this officer?')) return
    
    try {
      await adminAPI.deleteOfficer(officerId)
      alert('Officer deleted successfully!')
      fetchOfficers() // Refresh list
    } catch (error) {
      console.error('Failed to delete officer:', error)
      alert('Failed to delete officer')
    }
  }

  if (!mounted) return null

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch = 
      officer.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      officer.email?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || officer.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || officer.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Officers Management</h1>
                <p className="text-gray-600 mt-1">Manage all government officers</p>
              </div>
              <Link href="/admin/officers/add">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus size={18} className="mr-2" />
                  Add Officer
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading officers...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Total Officers</p>
                    <p className="text-2xl font-bold text-gray-900">{officers.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {officers.filter(o => o.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {officers.filter(o => o.status === 'inactive').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                    <p className="text-sm text-purple-600">Departments</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {new Set(officers.map(o => o.department)).size}
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search by name or email..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Officers Table */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredOfficers.length} Officer{filteredOfficers.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Officer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Designation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Performance</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOfficers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center">
                          <p className="text-gray-500">No officers found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOfficers.map((officer) => (
                        <tr key={officer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{officer.name}</p>
                              <p className="text-sm text-gray-600">{officer.email}</p>
                              <p className="text-xs text-gray-500">{officer.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${getDepartmentColor(officer.department)}`}>
                              {officer.department}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">{officer.designation}</td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                                <p className="text-gray-900 font-medium">{officer.performance?.totalProcessed || 0} processed</p>
                                <p className="text-gray-600">{officer.performance?.avgResponseTime || 0} days avg</p>
                                <p className="text-yellow-600">★ {officer.performance?.rating || 0}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(officer.status)}`}>
                            {officer.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/officers/${officer.id}`}>
                              <Button size="sm" variant="outline">
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(officer.id)}
                            >
                              <Trash2 size={14} />
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
