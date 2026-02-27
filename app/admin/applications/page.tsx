"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Search, Download } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { authAPI, adminAPI } from '@/lib/api'
import { getStatusBadgeColor, formatDate } from '@/lib/adminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ApplicationsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    const admin = authAPI.getCurrentAdmin()
    if (!admin) {
      router.push('/admin/login')
      return
    }

    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAllApplications()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.trackingId?.toLowerCase().includes(searchValue.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications Overview</h1>
                <p className="text-gray-600 mt-1">View all applications across departments</p>
              </div>
              <Button variant="outline">
                <Download size={18} className="mr-2" />
                Export
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-blue-600">Submitted</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {applications.filter(a => a.status === 'submitted').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <p className="text-sm text-yellow-600">Under Review</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {applications.filter(a => a.status === 'under_review').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Approved</p>
                    <p className="text-2xl font-bold text-green-900">
                      {applications.filter(a => a.status === 'approved').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search by tracking ID or name..."
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
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="divide-y">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="text-purple-600" size={20} />
                          <h3 className="font-semibold text-gray-900">{application.schemeName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(application.status)}`}>
                            {application.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><span className="font-medium">Tracking ID:</span> <span className="font-mono">{application.trackingId}</span></div>
                          <div><span className="font-medium">Applicant:</span> {application.applicantName}</div>
                          <div><span className="font-medium">Type:</span> <span className="capitalize">{application.type}</span></div>
                          <div><span className="font-medium">Submitted:</span> {formatDate(application.submittedAt)}</div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                  ))}
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
