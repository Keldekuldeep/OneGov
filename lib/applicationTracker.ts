// Application Timeline Tracker Data Management

export type ApplicationStatus = 'submitted' | 'verified' | 'under-review' | 'approved' | 'rejected'

export interface TimelineStage {
  status: ApplicationStatus
  label: string
  description: string
  estimatedDays: number
  officerName?: string
  officerDesignation?: string
  completedDate?: string
  remarks?: string
}

export interface Application {
  id: string
  trackingId: string
  schemeName: string
  schemeId: string
  applicantName: string
  submittedDate: string
  currentStatus: ApplicationStatus
  timeline: TimelineStage[]
  expectedCompletionDate: string
}

export const timelineStages: Record<ApplicationStatus, TimelineStage> = {
  'submitted': {
    status: 'submitted',
    label: 'Application Submitted',
    description: 'Your application has been received and is in queue',
    estimatedDays: 1,
    officerName: 'System Auto-Process',
    officerDesignation: 'Automated',
  },
  'verified': {
    status: 'verified',
    label: 'Document Verification',
    description: 'Documents are being verified by the department',
    estimatedDays: 3,
    officerName: 'Rajesh Kumar',
    officerDesignation: 'Document Verification Officer',
  },
  'under-review': {
    status: 'under-review',
    label: 'Under Review',
    description: 'Application is under review by senior officer',
    estimatedDays: 5,
    officerName: 'Priya Sharma',
    officerDesignation: 'Senior Review Officer',
  },
  'approved': {
    status: 'approved',
    label: 'Approved',
    description: 'Your application has been approved',
    estimatedDays: 2,
    officerName: 'Amit Singh',
    officerDesignation: 'Approving Authority',
  },
  'rejected': {
    status: 'rejected',
    label: 'Rejected',
    description: 'Application has been rejected',
    estimatedDays: 0,
    officerName: 'Amit Singh',
    officerDesignation: 'Approving Authority',
  },
}

// Get all applications from localStorage
export function getApplications(): Application[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('applications')
  return stored ? JSON.parse(stored) : []
}

// Save applications to localStorage
export function saveApplications(applications: Application[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('applications', JSON.stringify(applications))
}

// Create a new application
export function createApplication(
  schemeName: string,
  schemeId: string,
  applicantName: string
): Application {
  const trackingId = `${schemeId.toUpperCase()}-${Date.now()}`
  const submittedDate = new Date().toISOString()
  
  const newApp: Application = {
    id: `app-${Date.now()}`,
    trackingId,
    schemeName,
    schemeId,
    applicantName,
    submittedDate,
    currentStatus: 'submitted',
    timeline: [
      {
        ...timelineStages['submitted'],
        completedDate: submittedDate,
      },
    ],
    expectedCompletionDate: calculateExpectedCompletion(submittedDate, 11), // Total days
  }
  
  const applications = getApplications()
  applications.push(newApp)
  saveApplications(applications)
  
  return newApp
}

// Get application by tracking ID
export function getApplicationByTrackingId(trackingId: string): Application | undefined {
  return getApplications().find(app => app.trackingId === trackingId)
}

// Calculate expected completion date
function calculateExpectedCompletion(startDate: string, days: number): string {
  const date = new Date(startDate)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Get status progress percentage
export function getStatusProgress(status: ApplicationStatus): number {
  const statusOrder: ApplicationStatus[] = ['submitted', 'verified', 'under-review', 'approved']
  const currentIndex = statusOrder.indexOf(status)
  if (status === 'rejected') return 100
  return ((currentIndex + 1) / statusOrder.length) * 100
}

// Get days remaining
export function getDaysRemaining(expectedDate: string): number {
  const now = new Date()
  const expected = new Date(expectedDate)
  const diff = expected.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Initialize demo applications
export function initializeDemoApplications(): void {
  const existing = getApplications()
  if (existing.length > 0) return

  const demoApps: Omit<Application, 'id'>[] = [
    {
      trackingId: 'PM-KISAN-1234567890',
      schemeName: 'PM-KISAN Yojana',
      schemeId: 'pm-kisan',
      applicantName: 'Demo User',
      submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      currentStatus: 'under-review',
      timeline: [
        {
          ...timelineStages['submitted'],
          completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          ...timelineStages['verified'],
          completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          ...timelineStages['under-review'],
        },
      ],
      expectedCompletionDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      trackingId: 'AYUSHMAN-9876543210',
      schemeName: 'Ayushman Bharat (PM-JAY)',
      schemeId: 'ayushman-bharat',
      applicantName: 'Demo User',
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      currentStatus: 'verified',
      timeline: [
        {
          ...timelineStages['submitted'],
          completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          ...timelineStages['verified'],
          completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      expectedCompletionDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const applications = getApplications()
  demoApps.forEach(app => {
    applications.push({ ...app, id: `app-${Date.now()}-${Math.random()}` })
  })
  saveApplications(applications)
}
