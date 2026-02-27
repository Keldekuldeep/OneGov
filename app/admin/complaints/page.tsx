"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Search, Download } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { mockComplaints, getStatusBadgeColor, getPriorityBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminComplaintsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = 
      complaint.trackingId.toLowerCase().includes(searchValue.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
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
                <h1 className="text-3xl font-bold text-gray-900">Complaints Overview</h1>
                <p className="text-gray-600 mt-1">View all complaints across departments</p>
              </div>
              <Button variant="outline">
                <Download size={18} className="mr-2" />
                Export
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{mockComplaints.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-600">Pending</p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockComplaints.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <p className="text-sm text-yellow-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {mockComplaints.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-600">Resolved</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockComplaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-3 gap-4">
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="divide-y">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="text-purple-600" size={20} />
                          <h3 className="font-semibold text-gray-900 capitalize">{complaint.category}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(complaint.status)}`}>
                            {complaint.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadgeColor(complaint.priority)}`}>
                            {complaint.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><span className="font-medium">Tracking ID:</span> <span className="font-mono">{complaint.trackingId}</span></div>
                          <div><span className="font-medium">Submitted By:</span> {complaint.submittedBy}</div>
                          <div><span className="font-medium">Type:</span> <span className="capitalize">{complaint.type}</span></div>
                          <div><span className="font-medium">Submitted:</span> {formatDate(complaint.submittedAt)}</div>
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
          </div>
        </main>
      </div>
    </div>
  )
}
