"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, FileText, CheckCircle, XCircle, Clock, AlertCircle, Award, FolderOpen } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import StatusUpdateModal from '@/components/officer/StatusUpdateModal'
import { isOfficerLoggedIn } from '@/lib/officerAuth'
import { mockApplications, getStatusBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [application, setApplication] = useState(mockApplications.find(a => a.id === params.id))

  useEffect(() => {
    setMounted(true)
    if (!isOfficerLoggedIn()) {
      router.push('/officer/login')
    }
  }, [router])

  if (!mounted) return null
  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <Link href="/officer/applications">
            <Button>Back to Applications</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = (newStatus: string, _certificateNumber?: string, remarks?: string) => {
    setApplication({
      ...application,
      status: newStatus as any,
      remarks,
      updatedAt: new Date().toISOString(),
    })
    alert('Status updated successfully!')
  }

  const handleApprove = () => {
    setApplication({
      ...application,
      status: 'approved',
      updatedAt: new Date().toISOString(),
    })
    alert('Application approved successfully!')
  }

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:')
    if (reason) {
      setApplication({
        ...application,
        status: 'rejected',
        remarks: reason,
        updatedAt: new Date().toISOString(),
      })
      alert('Application rejected!')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/officer/applications">
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Applications
              </Button>
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-blue-600" size={24} />
                    <h1 className="text-3xl font-bold text-gray-900">{application.schemeName}</h1>
                  </div>
                  <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{application.trackingId}</span></p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-lg border ${getStatusBadgeColor(application.status)}`}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                    {application.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-semibold text-gray-900">{formatDate(application.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-semibold text-gray-900">{formatDate(application.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="font-semibold text-gray-900">{application.documents.length} attached</p>
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Applicant Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{application.applicantPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{application.applicantEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(application.formData).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-semibold text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Documents */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attached Documents</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FolderOpen className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 capitalize">{doc.replace('-', ' ')}</p>
                      <p className="text-xs text-gray-600">Verified</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility Check (for schemes) */}
            {application.type === 'scheme' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-green-900 mb-3">✓ Eligibility Check</h2>
                <div className="space-y-2 text-sm text-green-800">
                  <p>✓ Age requirement met</p>
                  <p>✓ Income criteria satisfied</p>
                  <p>✓ Category matches</p>
                  <p>✓ All required documents submitted</p>
                </div>
              </div>
            )}

            {/* Remarks */}
            {application.remarks && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-yellow-900 mb-2">Officer Remarks</h2>
                <p className="text-yellow-800">{application.remarks}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                {application.status !== 'approved' && application.status !== 'rejected' && (
                  <>
                    <Button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle size={18} className="mr-2" />
                      Reject Application
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setShowStatusModal(true)}
                  variant="outline"
                >
                  <Clock size={18} className="mr-2" />
                  Update Status
                </Button>
                <Button variant="outline">
                  <FileText size={18} className="mr-2" />
                  View All Documents
                </Button>
                <Button variant="outline">
                  Print Application
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Application Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-semibold text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-600">{formatDate(application.submittedAt)}</p>
                    <p className="text-sm text-gray-500 mt-1">By {application.applicantName}</p>
                  </div>
                </div>

                {application.status !== 'submitted' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        application.status === 'approved' ? 'bg-green-100' :
                        application.status === 'rejected' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {application.status === 'approved' ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : application.status === 'rejected' ? (
                          <XCircle className="text-red-600" size={20} />
                        ) : (
                          <Clock className="text-blue-600" size={20} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Status Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(application.updatedAt)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status changed to: {application.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={application.status}
        onUpdate={handleStatusUpdate}
        type="application"
      />
    </div>
  )
}
