// Mock data for admin portal

export interface SystemStats {
  totalCitizens: number
  totalOfficers: number
  totalApplications: number
  totalComplaints: number
  activeSchemes: number
  pendingApplications: number
  resolvedComplaints: number
  avgResponseTime: number
  todayApplications: number
  todayComplaints: number
}

export interface Officer {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  status: 'active' | 'inactive'
  createdAt: string
  createdBy: string
  performance: {
    totalProcessed: number
    avgResponseTime: number
    rating: number
  }
}

export interface Citizen {
  id: string
  name: string
  email: string
  phone: string
  aadhaar: string
  status: 'active' | 'blocked'
  registeredAt: string
  totalApplications: number
  totalComplaints: number
}

export interface Scheme {
  id: string
  name: string
  category: string
  description: string
  eligibility: string[]
  documents: string[]
  benefits: string
  status: 'active' | 'inactive'
  applicationsCount: number
  createdAt: string
}

export interface AuditLog {
  id: string
  userId: string
  userType: 'admin' | 'officer' | 'citizen'
  userName: string
  action: string
  module: string
  details: string
  timestamp: string
  ipAddress: string
}

// Mock System Stats
export const mockSystemStats: SystemStats = {
  totalCitizens: 1247,
  totalOfficers: 45,
  totalApplications: 3892,
  totalComplaints: 156,
  activeSchemes: 12,
  pendingApplications: 234,
  resolvedComplaints: 142,
  avgResponseTime: 2.5,
  todayApplications: 23,
  todayComplaints: 5,
}

// Mock Officers Data
export const mockOfficers: Officer[] = [
  {
    id: 'officer-1',
    name: 'Dr. Rajesh Kumar',
    email: 'health.officer@onegov.in',
    phone: '9876543210',
    department: 'Health',
    designation: 'Senior Health Officer',
    status: 'active',
    createdAt: '2026-01-10T00:00:00',
    createdBy: 'admin-1',
    performance: {
      totalProcessed: 245,
      avgResponseTime: 2.1,
      rating: 4.5,
    },
  },
  {
    id: 'officer-2',
    name: 'Prof. Sunita Sharma',
    email: 'education.officer@onegov.in',
    phone: '9876543211',
    department: 'Education',
    designation: 'Education Officer',
    status: 'active',
    createdAt: '2026-01-15T00:00:00',
    createdBy: 'admin-1',
    performance: {
      totalProcessed: 189,
      avgResponseTime: 2.8,
      rating: 4.3,
    },
  },
  {
    id: 'officer-3',
    name: 'Mr. Amit Verma',
    email: 'revenue.officer@onegov.in',
    phone: '9876543212',
    department: 'Revenue',
    designation: 'Revenue Officer',
    status: 'active',
    createdAt: '2026-01-20T00:00:00',
    createdBy: 'admin-1',
    performance: {
      totalProcessed: 312,
      avgResponseTime: 1.9,
      rating: 4.7,
    },
  },
  {
    id: 'officer-4',
    name: 'Ms. Priya Singh',
    email: 'general.officer@onegov.in',
    phone: '9876543213',
    department: 'General',
    designation: 'General Officer',
    status: 'active',
    createdAt: '2026-02-01T00:00:00',
    createdBy: 'admin-1',
    performance: {
      totalProcessed: 156,
      avgResponseTime: 3.2,
      rating: 4.1,
    },
  },
  {
    id: 'officer-5',
    name: 'Mr. Vikram Patel',
    email: 'transport.officer@onegov.in',
    phone: '9876543214',
    department: 'Transport',
    designation: 'Transport Officer',
    status: 'inactive',
    createdAt: '2026-02-10T00:00:00',
    createdBy: 'admin-1',
    performance: {
      totalProcessed: 78,
      avgResponseTime: 3.5,
      rating: 3.8,
    },
  },
]

// Mock Applications Data (from officer portal)
export const mockApplications = [
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
  {
    id: 'app-3',
    trackingId: 'APP1709123462',
    type: 'scheme',
    schemeName: 'Ayushman Bharat',
    applicantName: 'Rajesh Patel',
    applicantPhone: '9876543216',
    applicantEmail: 'rajesh@example.com',
    status: 'under_review',
    submittedAt: '2026-02-25T14:00:00',
    updatedAt: '2026-02-26T16:00:00',
    documents: ['aadhaar', 'income-certificate', 'ration-card'],
    formData: {
      age: 35,
      occupation: 'Daily Wage Worker',
      income: 80000,
    },
  },
  {
    id: 'app-4',
    trackingId: 'APP1709123463',
    type: 'education',
    schemeName: 'Scholarship for Girls',
    applicantName: 'Sunita Verma',
    applicantPhone: '9876543217',
    applicantEmail: 'sunita@example.com',
    status: 'approved',
    submittedAt: '2026-02-24T09:00:00',
    updatedAt: '2026-02-26T14:00:00',
    documents: ['aadhaar', 'marksheet', 'income-certificate'],
    formData: {
      age: 18,
      category: 'General',
      occupation: 'Student',
    },
  },
]

// Mock Citizens Data
export const mockCitizens: Citizen[] = [
  {
    id: 'citizen-1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543220',
    aadhaar: '1234-5678-9012',
    status: 'active',
    registeredAt: '2026-01-05T00:00:00',
    totalApplications: 5,
    totalComplaints: 1,
  },
  {
    id: 'citizen-2',
    name: 'Priya Kumari',
    email: 'priya@example.com',
    phone: '9876543221',
    aadhaar: '2345-6789-0123',
    status: 'active',
    registeredAt: '2026-01-12T00:00:00',
    totalApplications: 3,
    totalComplaints: 0,
  },
  {
    id: 'citizen-3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '9876543222',
    aadhaar: '3456-7890-1234',
    status: 'blocked',
    registeredAt: '2026-01-20T00:00:00',
    totalApplications: 8,
    totalComplaints: 4,
  },
]

// Mock Schemes Data
export const mockSchemes: Scheme[] = [
  {
    id: 'scheme-1',
    name: 'PM-KISAN Yojana',
    category: 'Agriculture',
    description: 'Financial assistance to farmers',
    eligibility: ['Must be a farmer', 'Land ownership required', 'Annual income < 2 lakhs'],
    documents: ['Aadhaar', 'Land Records', 'Bank Passbook'],
    benefits: '₹6,000 per year in 3 installments',
    status: 'active',
    applicationsCount: 456,
    createdAt: '2026-01-01T00:00:00',
  },
  {
    id: 'scheme-2',
    name: 'Ayushman Bharat',
    category: 'Health',
    description: 'Health insurance for economically vulnerable families',
    eligibility: ['BPL family', 'Annual income < 5 lakhs'],
    documents: ['Aadhaar', 'Income Certificate', 'Ration Card'],
    benefits: 'Health cover up to ₹5 lakhs per family per year',
    status: 'active',
    applicationsCount: 789,
    createdAt: '2026-01-01T00:00:00',
  },
  {
    id: 'scheme-3',
    name: 'Post Matric Scholarship (SC/ST)',
    category: 'Education',
    description: 'Scholarship for SC/ST students',
    eligibility: ['SC/ST category', 'Post-matric student', 'Annual income < 2.5 lakhs'],
    documents: ['Aadhaar', 'Caste Certificate', 'Income Certificate', 'Marksheet'],
    benefits: 'Tuition fees + maintenance allowance',
    status: 'active',
    applicationsCount: 234,
    createdAt: '2026-01-01T00:00:00',
  },
]

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'admin-1',
    userType: 'admin',
    userName: 'Super Admin',
    action: 'Created Officer',
    module: 'Officer Management',
    details: 'Created new officer: Dr. Rajesh Kumar',
    timestamp: '2026-02-27T10:30:00',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-2',
    userId: 'officer-1',
    userType: 'officer',
    userName: 'Dr. Rajesh Kumar',
    action: 'Updated Application Status',
    module: 'Health Services',
    details: 'Changed status from submitted to verified for BIRTH1709123456',
    timestamp: '2026-02-27T11:15:00',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'log-3',
    userId: 'admin-1',
    userType: 'admin',
    userName: 'Super Admin',
    action: 'Blocked Citizen',
    module: 'Citizen Management',
    details: 'Blocked citizen: Amit Kumar',
    timestamp: '2026-02-27T12:00:00',
    ipAddress: '192.168.1.100',
  },
]

// Helper functions
export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-gray-100 text-gray-800 border-gray-300',
    blocked: 'bg-red-100 text-red-800 border-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
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

export function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    Health: 'bg-red-50 text-red-700',
    Education: 'bg-blue-50 text-blue-700',
    Revenue: 'bg-green-50 text-green-700',
    Transport: 'bg-yellow-50 text-yellow-700',
    Utility: 'bg-purple-50 text-purple-700',
    General: 'bg-gray-50 text-gray-700',
  }
  return colors[department] || 'bg-gray-50 text-gray-700'
}
