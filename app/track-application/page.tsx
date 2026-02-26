"use client"

import { useState, useEffect } from 'react'
import { Search, Clock, CheckCircle, XCircle, AlertCircle, User, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { applicationsAPI, healthServicesAPI, authAPI } from '@/lib/api'
import { timelineStages } from '@/lib/applicationTracker'

interface Application {
  id: string
  trackingId: string
  schemeName: string
  schemeId?: string
  applicantName?: string
  submittedDate: string
  currentStatus: string
  timeline: any[]
  expectedCompletionDate?: string
  serviceType?: string
}

export default function TrackApplicationPage() {
  const [trackingId, setTrackingId] = useState('')
  const [application, setApplication] = useState<Application | null>(null)
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setIsLoading(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      // Load both general applications and health services
      const [appsResponse, healthResponse] = await Promise.all([
        applicationsAPI.getUserApplications(user.id).catch(() => ({ applications: [] })),
        healthServicesAPI.getUserServices(user.id).catch(() => ({ services: [] }))
      ])

      const apps = (appsResponse.applications || []).map((app: any) => ({
        ...app,
        currentStatus: app.status || 'submitted',
        submittedDate: app.submittedAt,
        timeline: app.timeline || []
      }))
      
      const healthServices = (healthResponse.services || []).map((service: any) => ({
        ...service,
        schemeName: service.serviceType || 'Health Service',
        currentStatus: service.status || 'submitted',
        submittedDate: service.submittedAt,
        timeline: service.timeline || []
      }))

      setAllApplications([...apps, ...healthServices])
      console.log('✅ Applications loaded from backend:', apps.length + healthServices.length)
    } catch (error) {
      console.error('❌ Error loading applications:', error)
      setAllApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setIsSearching(true)
    try {
      let foundApp = null

      // Try tracking as general application first
      try {
        const response = await applicationsAPI.track(trackingId.trim())
        foundApp = {
          ...response.application,
          currentStatus: response.application.status || 'submitted',
          submittedDate: response.application.submittedAt,
          timeline: response.application.timeline || []
        }
        console.log('✅ Application found:', foundApp)
      } catch (err) {
        // If not found, try as health service
        try {
          const response = await healthServicesAPI.track(trackingId.trim())
          foundApp = {
            ...response.service,
            schemeName: response.service.serviceType || 'Health Service',
            currentStatus: response.service.status || 'submitted',
            submittedDate: response.service.submittedAt,
            timeline: response.service.timeline || []
          }
          console.log('✅ Health service found:', foundApp)
        } catch (err2) {
          // Not found in either
        }
      }

      if (foundApp) {
        setApplication(foundApp)
      } else {
        setError('Application not found. Please check your tracking ID.')
        setApplication(null)
      }
    } catch (error) {
      console.error('❌ Error tracking application:', error)
      setError('Failed to track application. Please try again.')
      setApplication(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const getStatusProgress = (status?: string): number => {
    if (!status) return 25
    const statusOrder = ['submitted', 'verified', 'under_review', 'approved']
    const currentIndex = statusOrder.indexOf(status)
    if (status === 'rejected') return 100
    if (currentIndex === -1) return 25
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const getDaysRemaining = (expectedDate?: string): number => {
    if (!expectedDate) return 7
    const now = new Date()
    const expected = new Date(expectedDate)
    const diff = expected.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (status === 'rejected') return <XCircle className="text-red-600" size={24} />
    if (isCompleted) return <CheckCircle className="text-green-600" size={24} />
    if (status === application?.currentStatus) return <Clock className="text-blue-600 animate-pulse" size={24} />
    return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
  }

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (status === 'rejected') return 'bg-red-100 border-red-300 text-red-800'
    if (isCompleted) return 'bg-green-100 border-green-300 text-green-800'
    if (status === application?.currentStatus) return 'bg-blue-100 border-blue-300 text-blue-800'
    return 'bg-gray-100 border-gray-300 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Search size={40} />
            <h1 className="text-4xl font-bold">Track Your Application</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Real-time status tracking with complete transparency
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="trackingId">Enter Tracking ID</Label>
                <div className="flex gap-3">
                  <Input
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g., PM-KISAN-1234567890"
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-[#2c5282] hover:bg-[#1e3a5f]" disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} className="mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>
            </form>

            {allApplications.length === 0 && !isLoading && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 mb-3">No applications found. Submit an application first.</p>
              </div>
            )}

            {isLoading && (
              <div className="mt-4 text-center">
                <Loader2 className="mx-auto animate-spin text-blue-600" size={32} />
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            )}
          </div>

          {/* Application Details */}
          {application && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{application.schemeName}</h2>
                    <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{application.trackingId}</span></p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-2 ${
                    application.currentStatus === 'approved' || application.currentStatus === 'issued' ? 'bg-green-100 border-green-300 text-green-800' :
                    application.currentStatus === 'rejected' ? 'bg-red-100 border-red-300 text-red-800' :
                    'bg-blue-100 border-blue-300 text-blue-800'
                  }`}>
                    <p className="text-sm font-semibold">
                      {timelineStages[application.currentStatus as keyof typeof timelineStages]?.label || (application.currentStatus || 'PENDING').toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Applicant Name</p>
                    <p className="font-semibold text-gray-900">{application.applicantName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Completion</p>
                    <p className="font-semibold text-gray-900">
                      {getDaysRemaining(application.expectedCompletionDate)} days remaining
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">Overall Progress</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {Math.round(getStatusProgress(application.currentStatus))}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        application.currentStatus === 'approved' || application.currentStatus === 'issued' ? 'bg-green-600' :
                        application.currentStatus === 'rejected' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}
                      style={{ width: `${getStatusProgress(application.currentStatus)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Application Timeline</h3>
                
                <div className="space-y-6">
                  {Object.values(timelineStages).filter(stage => 
                    stage.status !== 'rejected' || application.currentStatus === 'rejected'
                  ).map((stage, index) => {
                    const isCompleted = application.timeline.some(t => t.status === stage.status && t.completedDate)
                    const isCurrent = application.currentStatus === stage.status
                    const isPending = !isCompleted && !isCurrent

                    return (
                      <div key={stage.status} className="relative">
                        {index !== Object.values(timelineStages).length - 1 && (
                          <div className={`absolute left-3 top-12 w-0.5 h-full ${
                            isCompleted ? 'bg-green-600' : 'bg-gray-300'
                          }`} />
                        )}
                        
                        <div className={`flex gap-4 p-4 rounded-lg border-2 ${getStatusColor(stage.status, isCompleted)}`}>
                          <div className="flex-shrink-0">
                            {getStatusIcon(stage.status, isCompleted)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-lg">{stage.label}</h4>
                                <p className="text-sm mt-1">{stage.description}</p>
                              </div>
                              {isCurrent && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded animate-pulse">
                                  IN PROGRESS
                                </span>
                              )}
                            </div>

                            {(isCompleted || isCurrent) && (
                              <div className="mt-3 pt-3 border-t border-current/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <User size={16} />
                                  <div>
                                    <p className="font-semibold text-sm">{stage.officerName}</p>
                                    <p className="text-xs">{stage.officerDesignation}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar size={16} />
                                  {isCompleted ? (
                                    <p>Completed: {new Date(application.timeline.find(t => t.status === stage.status)?.completedDate || '').toLocaleDateString()}</p>
                                  ) : (
                                    <p>Estimated: {stage.estimatedDays} days</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {isPending && (
                              <div className="mt-3 pt-3 border-t border-gray-300">
                                <p className="text-sm text-gray-600">
                                  ⏳ Estimated processing time: {stage.estimatedDays} days
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-2">📋 Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Your application is being processed by the respective department</li>
                  <li>✓ You will receive SMS/Email notifications at each stage</li>
                  <li>✓ No need to visit the office - track everything online</li>
                  <li>✓ For queries, contact the officer handling your current stage</li>
                </ul>
              </div>
            </div>
          )}

          {/* My Applications */}
          {!application && allApplications.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">My Recent Applications</h3>
              <div className="space-y-3">
                {allApplications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setTrackingId(app.trackingId)
                      setApplication(app)
                    }}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{app.schemeName}</p>
                        <p className="text-sm text-gray-600 font-mono">{app.trackingId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        app.currentStatus === 'approved' || app.currentStatus === 'issued' ? 'bg-green-100 text-green-800' :
                        app.currentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {timelineStages[app.currentStatus as keyof typeof timelineStages]?.label || (app.currentStatus || 'PENDING').toUpperCase()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
