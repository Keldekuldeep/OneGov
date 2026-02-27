"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Eye, Clock } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import FilterBar from '@/components/officer/FilterBar'
import { authAPI, officerAPI } from '@/lib/api'
import { getStatusBadgeColor, getPriorityBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'

export default function ComplaintsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    // Check if officer is logged in
    const officer = authAPI.getCurrentOfficer()
    if (!officer) {
      router.push('/officer/login')
      return
    }

    // Fetch complaints from backend
    fetchComplaints()
  }, [router])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const data = await officerAPI.getComplaints()
      setComplaints(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.trackingId.toLowerCase().includes(searchValue.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
                <p className="text-gray-600 mt-1">Manage citizen complaints</p>
              </div>
              <MessageSquare className="text-purple-600" size={32} />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading complaints...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-blue-600">Pending</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {complaints.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <p className="text-sm text-yellow-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {complaints.filter(c => c.status === 'in-progress' || c.status === 'in_progress').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-900">
                      {complaints.filter(c => c.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <p className="text-sm text-red-600">Urgent</p>
                    <p className="text-2xl font-bold text-red-900">
                      {complaints.filter(c => c.priority === 'urgent').length}
                    </p>
                  </div>
                </div>

                <FilterBar
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  statusOptions={statusOptions}
                />

                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">
                      {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
                    </h2>
                  </div>

                  <div className="divide-y">
                    {filteredComplaints.length === 0 ? (
                      <div className="p-12 text-center">
                        <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredComplaints.map((complaint) => (
                        <div key={complaint.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{complaint.category?.toUpperCase()}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(complaint.status)}`}>
                                  {complaint.status?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadgeColor(complaint.priority)}`}>
                                  {complaint.priority?.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div><span className="font-medium">Tracking ID:</span> <span className="font-mono">{complaint.trackingId}</span></div>
                                <div><span className="font-medium">Submitted By:</span> {complaint.submittedBy}</div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{formatDate(complaint.submittedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/officer/complaints/${complaint.id}`}>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Eye size={16} className="mr-2" />
                                View
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
