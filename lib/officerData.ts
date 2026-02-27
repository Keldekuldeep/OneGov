// Mock data for officer portal

export interface HealthServiceRequest {
  id: string
  trackingId: string
  serviceType: 'birth-certificate' | 'death-certificate' | 'health-card' | 'vaccination-certificate'
  applicantName: string
  applicantPhone: string
  applicantEmail: string
  status: 'submitted' | 'verified' | 'under_review' | 'issued' | 'rejected'
  submittedAt: string
  updatedAt: string
  certificateNumber?: string
  formData: any
  remarks?: string
  assignedOfficer?: string
}

export interface Application {
  id: string
  trackingId: string
  type: 'education' | 'scheme'
  schemeName: string
  applicantName: string
  applicantPhone: string
  applicantEmail: string
  status: 'submitted' | 'verified' | 'under_review' | 'approved' | 'rejected'
  submittedAt: string
  updatedAt: string
  documents: string[]
  formData: any
  remarks?: string
  assignedOfficer?: string
}

export interface DocumentVerification {
  id: string
  userId: string
  userName: string
  type: string
  fileName: string
  fileSize: number
  uploadedAt: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedBy?: string
  verifiedAt?: string
  remarks?: string
}

export interface Complaint {
  id: string
  trackingId: string
  type: string
  category: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
  submittedBy: string
  submittedAt: string
  updatedAt: string
  assignedOfficer?: string
  resolution?: string
}

// Mock Health Services Data
export const mockHealthServices: HealthServiceRequest[] = [
  {
    id: 'hs-1',
    trackingId: 'BIRTH1709123456',
    serviceType: 'birth-certificate',
    applicantName: 'Rahul Sharma',
    applicantPhone: '9876543210',
    applicantEmail: 'rahul@example.com',
    status: 'submitted',
    submittedAt: '2026-02-27T10:30:00',
    updatedAt: '2026-02-27T10:30:00',
    formData: {
      childName: 'Baby Sharma',
      fatherName: 'Rahul Sharma',
      motherName: 'Priya Sharma',
      dateOfBirth: '2026-02-20',
      placeOfBirth: 'City Hospital',
      hospitalName: 'City Hospital',
      address: '123 Main Street, City',
    },
  },
  {
    id: 'hs-2',
    trackingId: 'DEATH1709123457',
    serviceType: 'death-certificate',
    applicantName: 'Amit Kumar',
    applicantPhone: '9876543211',
    applicantEmail: 'amit@example.com',
    status: 'verified',
    submittedAt: '2026-02-26T14:20:00',
    updatedAt: '2026-02-27T09:15:00',
    formData: {
      deceasedName: 'Ram Kumar',
      dateOfDeath: '2026-02-25',
      placeOfDeath: 'Home',
      causeOfDeath: 'Natural',
      informantName: 'Amit Kumar',
      relationship: 'Son',
    },
  },
  {
    id: 'hs-3',
    trackingId: 'HEALTH1709123458',
    serviceType: 'health-card',
    applicantName: 'Sunita Verma',
    applicantPhone: '9876543212',
    applicantEmail: 'sunita@example.com',
    status: 'under_review',
    submittedAt: '2026-02-25T11:00:00',
    updatedAt: '2026-02-26T16:30:00',
    formData: {
      fullName: 'Sunita Verma',
      aadhaar: '1234-5678-9012',
      dateOfBirth: '1990-05-15',
      bloodGroup: 'O+',
      address: '456 Park Avenue, City',
    },
  },
  {
    id: 'hs-4',
    trackingId: 'VAC1709123459',
    serviceType: 'vaccination-certificate',
    applicantName: 'Rajesh Patel',
    applicantPhone: '9876543213',
    applicantEmail: 'rajesh@example.com',
    status: 'issued',
    submittedAt: '2026-02-24T09:00:00',
    updatedAt: '2026-02-25T14:00:00',
    certificateNumber: 'VAC-2026-001234',
    formData: {
      fullName: 'Rajesh Patel',
      aadhaar: '9876-5432-1098',
      vaccineName: 'COVID-19',
      dose: '2',
      dateOfVaccination: '2026-02-20',
    },
  },
]

// Mock Applications Data
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    trackingId: 'APP1709123460',
    type: 'scheme',
    schemeName: 'PM-KISAN Yojana',
    applicantName: 'Mohan Singh',
    applicantPhone: '9876543214',
    applicantEmail: 'mohan@example.com',
    status: 'submitted',
    submittedAt: '2026-02-27T08:00:00',
    updatedAt: '2026-02-27T08:00:00',
    documents: ['aadhaar', 'bank-passbook', 'land-records'],
    formData: {
      age: 45,
      occupation: 'Farmer',
      income: 150000,
    },
  },
  {
    id: 'app-2',
    trackingId: 'APP1709123461',
    type: 'education',
    schemeName: 'Post Matric Scholarship (SC/ST)',
    applicantName: 'Priya Kumari',
    applicantPhone: '9876543215',
    applicantEmail: 'priya@example.com',
    status: 'verified',
    submittedAt: '2026-02-26T10:00:00',
    updatedAt: '2026-02-27T11:00:00',
    documents: ['aadhaar', 'caste-certificate', 'income-certificate'],
    formData: {
      age: 20,
      category: 'SC',
      occupation: 'Student',
    },
  },
]

// Mock Documents Data
export const mockDocuments: DocumentVerification[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    userName: 'Rahul Sharma',
    type: 'aadhaar',
    fileName: 'aadhaar_card.pdf',
    fileSize: 245000,
    uploadedAt: '2026-02-27T09:00:00',
    verificationStatus: 'pending',
  },
  {
    id: 'doc-2',
    userId: 'user-2',
    userName: 'Amit Kumar',
    type: 'pan',
    fileName: 'pan_card.pdf',
    fileSize: 180000,
    uploadedAt: '2026-02-26T14:00:00',
    verificationStatus: 'verified',
    verifiedBy: 'officer-1',
    verifiedAt: '2026-02-27T10:00:00',
  },
]

// Mock Complaints Data
export const mockComplaints: Complaint[] = [
  {
    id: 'comp-1',
    trackingId: 'COMP1709123462',
    type: 'service',
    category: 'delay',
    description: 'My birth certificate application is delayed',
    priority: 'high',
    status: 'pending',
    submittedBy: 'Rahul Sharma',
    submittedAt: '2026-02-27T12:00:00',
    updatedAt: '2026-02-27T12:00:00',
  },
  {
    id: 'comp-2',
    trackingId: 'COMP1709123463',
    type: 'technical',
    category: 'website',
    description: 'Unable to upload documents',
    priority: 'medium',
    status: 'in-progress',
    submittedBy: 'Priya Kumari',
    submittedAt: '2026-02-26T15:00:00',
    updatedAt: '2026-02-27T09:00:00',
    assignedOfficer: 'officer-4',
  },
]

// Helper functions
export function getServiceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'birth-certificate': 'Birth Certificate',
    'death-certificate': 'Death Certificate',
    'health-card': 'Health Card',
    'vaccination-certificate': 'Vaccination Certificate',
  }
  return labels[type] || type
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800 border-blue-300',
    verified: 'bg-green-100 text-green-800 border-green-300',
    under_review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    issued: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    pending: 'bg-blue-100 text-blue-800 border-blue-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
}

export function getPriorityBadgeColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
