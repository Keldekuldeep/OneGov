"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import StatusUpdateModal from '@/components/officer/StatusUpdateModal'
import { isOfficerLoggedIn } from '@/lib/officerAuth'
import { mockHealthServices, getServiceTypeLabel, getStatusBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HealthServiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [service, setService] = useState(mockHealthServices.find(s => s.id === params.id))

  useEffect(() => {
    setMounted(true)
    if (!isOfficerLoggedIn()) {
      router.push('/officer/login')
    }
  }, [router])

  if (!mounted) return null
  if (!service) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <Link href="/officer/health-services">
            <Button>Back to Health Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = (newStatus: string, certificateNumber?: string, remarks?: string) => {
    setService({
      ...service,
      status: newStatus as any,
      certificateNumber,
      remarks,
      updatedAt: new Date().toISOString(),
    })
    alert('Status updated successfully!')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/officer/health-services">
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Health Services
              </Button>
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {getServiceTypeLabel(service.serviceType)}
                  </h1>
                  <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{service.trackingId}</span></p>
                </div>
                <span className={`px-4 py-2 text-sm font-semibold rounded-lg border ${getStatusBadgeColor(service.status)}`}>
                  {service.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-semibold text-gray-900">{formatDate(service.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-semibold text-gray-900">{formatDate(service.updatedAt)}</p>
                </div>
                {service.certificateNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Certificate Number</p>
                    <p className="font-semibold text-gray-900 font-mono">{service.certificateNumber}</p>
                  </div>
                )}
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
                    <p className="font-semibold text-gray-900">{service.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{service.applicantPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{service.applicantEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Data */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submitted Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(service.formData).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="font-semibold text-gray-900">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            {service.remarks && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-lg font-bold text-yellow-900 mb-2">Officer Remarks</h2>
                <p className="text-yellow-800">{service.remarks}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowStatusModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Update Status
                </Button>
                <Button variant="outline">
                  <FileText size={18} className="mr-2" />
                  View Documents
                </Button>
                <Button variant="outline">
                  Print Details
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
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
                    <p className="text-sm text-gray-600">{formatDate(service.submittedAt)}</p>
                    <p className="text-sm text-gray-500 mt-1">By {service.applicantName}</p>
                  </div>
                </div>

                {service.status !== 'submitted' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="text-blue-600" size={20} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Status Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(service.updatedAt)}</p>
                      <p className="text-sm text-gray-500 mt-1">Status changed to: {service.status.replace('_', ' ')}</p>
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
        currentStatus={service.status}
        onUpdate={handleStatusUpdate}
        showCertificateNumber={true}
        type="health"
      />
    </div>
  )
}
