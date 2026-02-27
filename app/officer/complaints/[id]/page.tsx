"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MessageSquare, User, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import StatusUpdateModal from '@/components/officer/StatusUpdateModal'
import { isOfficerLoggedIn } from '@/lib/officerAuth'
import { mockComplaints, getStatusBadgeColor, getPriorityBadgeColor, formatDate, type Complaint } from '@/lib/officerData'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ComplaintDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [resolution, setResolution] = useState('')
  const [assignedOfficer, setAssignedOfficer] = useState('')

  useEffect(() => {
    setMounted(true)
    if (!isOfficerLoggedIn()) {
      router.push('/officer/login')
      return
    }

    // Find complaint by ID
    const foundComplaint = mockComplaints.find(c => c.id === params.id)
    if (foundComplaint) {
      setComplaint(foundComplaint)
      setResolution(foundComplaint.resolution || '')
      setAssignedOfficer(foundComplaint.assignedOfficer || '')
    }
  }, [router, params.id])

  if (!mounted || !complaint) return null

  const handleStatusUpdate = (newStatus: string, _certificateNumber?: string, remarks?: string) => {
    setComplaint({
      ...complaint,
      status: newStatus as any,
      updatedAt: new Date().toISOString(),
    })
    alert(`Status updated to: ${newStatus}${remarks ? `\nRemarks: ${remarks}` : ''}`)
  }

  const handleSaveResolution = () => {
    setComplaint({
      ...complaint,
      resolution,
      updatedAt: new Date().toISOString(),
    })
    alert('Resolution notes saved successfully!')
  }

  const handleAssignOfficer = () => {
    setComplaint({
      ...complaint,
      assignedOfficer,
      updatedAt: new Date().toISOString(),
    })
    alert(`Complaint assigned to: ${assignedOfficer}`)
  }

  const handlePriorityChange = (newPriority: string) => {
    setComplaint({
      ...complaint,
      priority: newPriority as any,
      updatedAt: new Date().toISOString(),
    })
    alert(`Priority changed to: ${newPriority}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/officer/complaints">
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Complaints
              </Button>
            </Link>

            {/* Header */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-purple-600" size={32} />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
                    <p className="text-gray-600 font-mono">{complaint.trackingId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusBadgeColor(complaint.status)}`}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded ${getPriorityBadgeColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span className="font-medium">Submitted By:</span>
                  <span>{complaint.submittedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span className="font-medium">Submitted:</span>
                  <span>{formatDate(complaint.submittedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} />
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{complaint.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertCircle size={16} />
                  <span className="font-medium">Category:</span>
                  <span className="capitalize">{complaint.category}</span>
                </div>
              </div>
            </div>

            {/* Complaint Description */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Complaint Description</h2>
              <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
            </div>

            {/* Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Update */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Current Status:</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {complaint.status.replace('-', ' ')}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowStatusModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Change Status
                  </Button>
                </div>
              </div>

              {/* Priority Change */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Priority</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={complaint.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Assign Officer */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Officer</h2>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select value={assignedOfficer} onValueChange={setAssignedOfficer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="officer-1">Dr. Rajesh Kumar (Health)</SelectItem>
                      <SelectItem value="officer-2">Prof. Sunita Sharma (Education)</SelectItem>
                      <SelectItem value="officer-3">Mr. Amit Verma (Revenue)</SelectItem>
                      <SelectItem value="officer-4">Ms. Priya Singh (General)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignOfficer} className="bg-green-600 hover:bg-green-700">
                  Assign
                </Button>
              </div>
              {complaint.assignedOfficer && (
                <p className="text-sm text-gray-600 mt-2">
                  Currently assigned to: <span className="font-medium">{complaint.assignedOfficer}</span>
                </p>
              )}
            </div>

            {/* Resolution Notes */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resolution Notes</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resolution">Add Resolution Details</Label>
                  <Textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how the complaint was resolved or any actions taken..."
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSaveResolution} className="bg-purple-600 hover:bg-purple-700">
                  <FileText size={18} className="mr-2" />
                  Save Resolution
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900">Complaint Submitted</p>
                    <p className="text-sm text-gray-600">{formatDate(complaint.submittedAt)}</p>
                    <p className="text-sm text-gray-500 mt-1">Submitted by {complaint.submittedBy}</p>
                  </div>
                </div>

                {complaint.assignedOfficer && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-600" />
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">Assigned to Officer</p>
                      <p className="text-sm text-gray-600">{formatDate(complaint.updatedAt)}</p>
                      <p className="text-sm text-gray-500 mt-1">Assigned to {complaint.assignedOfficer}</p>
                    </div>
                  </div>
                )}

                {complaint.status !== 'pending' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        complaint.status === 'resolved' ? 'bg-green-600' : 
                        complaint.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {complaint.status.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(complaint.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={complaint.status}
        onUpdate={handleStatusUpdate}
        type="complaint"
      />
    </div>
  )
}
