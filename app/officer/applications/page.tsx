"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Eye, Clock, Award } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import FilterBar from '@/components/officer/FilterBar'
import { authAPI, officerAPI } from '@/lib/api'
import { getStatusBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'

export default function ApplicationsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    // Check if officer is logged in
    const officer = authAPI.getCurrentOfficer()
    if (!officer) {
      router.push('/officer/login')
      return
    }

    // Fetch applications from backend
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await officerAPI.getApplications()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.trackingId?.toLowerCase().includes(searchValue.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      app.schemeName?.toLowerCase().includes(searchValue.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesType = typeFilter === 'all' || app.schemeId?.includes(typeFilter)

    return matchesSearch && matchesStatus && matchesType
  })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'verified', label: 'Verified' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'education', label: 'Education' },
    { value: 'scheme', label: 'Scheme' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                <p className="text-gray-600 mt-1">Manage education and scheme applications</p>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={32} />
              </div>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Verified</p>
                    <p className="text-2xl font-bold text-green-900">
                      {applications.filter(a => a.status === 'verified').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <p className="text-sm text-yellow-600">Under Review</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {applications.filter(a => a.status === 'under_review').length}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                    <p className="text-sm text-purple-600">Approved</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {applications.filter(a => a.status === 'approved').length}
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <FilterBar
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  typeFilter={typeFilter}
                  onTypeChange={setTypeFilter}
                  statusOptions={statusOptions}
                  typeOptions={typeOptions}
                  onExport={() => alert('Export functionality coming soon!')}
                />

                {/* Applications List */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">
                      {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''} Found
                    </h2>
                  </div>

                  <div className="divide-y">
                    {filteredApplications.length === 0 ? (
                      <div className="p-12 text-center">
                        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredApplications.map((app) => (
                        <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Award className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-gray-900">{app.schemeName}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(app.status)}`}>
                                  {app.status?.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Tracking ID:</span>{' '}
                                  <span className="font-mono">{app.trackingId}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Applicant:</span> {app.applicantName}
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span> {app.applicantPhone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{formatDate(app.submittedAt)}</span>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-600">
                                  {app.documents?.length || 0} document{app.documents?.length !== 1 ? 's' : ''} attached
                                </span>
                              </div>
                            </div>

                            <Link href={`/officer/applications/${app.id}`}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Eye size={16} className="mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
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
