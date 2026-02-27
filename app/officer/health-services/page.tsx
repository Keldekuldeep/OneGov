"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Eye, Clock } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import FilterBar from '@/components/officer/FilterBar'
import { authAPI, officerAPI } from '@/lib/api'
import { getServiceTypeLabel, getStatusBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'

export default function HealthServicesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any[]>([])
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

    // Fetch health services from backend
    fetchHealthServices()
  }, [router])

  const fetchHealthServices = async () => {
    try {
      setLoading(true)
      const data = await officerAPI.getHealthServices()
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch health services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Filter health services
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.trackingId?.toLowerCase().includes(searchValue.toLowerCase()) ||
      service.applicantName?.toLowerCase().includes(searchValue.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter
    const matchesType = typeFilter === 'all' || service.serviceType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'verified', label: 'Verified' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'issued', label: 'Issued' },
    { value: 'rejected', label: 'Rejected' },
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'birth-certificate', label: 'Birth Certificate' },
    { value: 'death-certificate', label: 'Death Certificate' },
    { value: 'health-card', label: 'Health Card' },
    { value: 'vaccination-certificate', label: 'Vaccination Certificate' },
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
                <h1 className="text-3xl font-bold text-gray-900">Health Services</h1>
                <p className="text-gray-600 mt-1">Manage health service requests</p>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-red-600" size={32} />
              </div>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading services...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-blue-600">Submitted</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {services.filter(s => s.status === 'submitted').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <p className="text-sm text-yellow-600">Under Review</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {services.filter(s => s.status === 'under_review').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Issued</p>
                    <p className="text-2xl font-bold text-green-900">
                      {services.filter(s => s.status === 'issued').length}
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

                {/* Services List */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">
                      {filteredServices.length} Service{filteredServices.length !== 1 ? 's' : ''} Found
                    </h2>
                  </div>

                  <div className="divide-y">
                    {filteredServices.length === 0 ? (
                      <div className="p-12 text-center">
                        <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredServices.map((service) => (
                        <div key={service.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {getServiceTypeLabel(service.serviceType)}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(service.status)}`}>
                                  {service.status?.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Tracking ID:</span>{' '}
                                  <span className="font-mono">{service.trackingId}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Applicant:</span> {service.applicantName}
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span> {service.applicantPhone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{formatDate(service.submittedAt)}</span>
                                </div>
                              </div>

                              {service.certificateNumber && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium text-green-700">Certificate Number:</span>{' '}
                                  <span className="font-mono">{service.certificateNumber}</span>
                                </div>
                              )}
                            </div>

                            <Link href={`/officer/health-services/${service.id}`}>
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
