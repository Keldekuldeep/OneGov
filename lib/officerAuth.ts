// Officer Authentication & Data Management

export interface Officer {
  id: string
  name: string
  email: string
  department: 'health' | 'education' | 'revenue' | 'transport' | 'utility' | 'general'
  role: 'officer' | 'senior-officer' | 'head'
  phone: string
  designation: string
  avatar?: string
}

// Demo officers for testing
export const demoOfficers: Officer[] = [
  {
    id: 'officer-1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@gov.in',
    department: 'health',
    role: 'officer',
    phone: '9876543210',
    designation: 'Health Officer',
  },
  {
    id: 'officer-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gov.in',
    department: 'education',
    role: 'senior-officer',
    phone: '9876543211',
    designation: 'Senior Education Officer',
  },
  {
    id: 'officer-3',
    name: 'Amit Singh',
    email: 'amit.singh@gov.in',
    department: 'revenue',
    role: 'officer',
    phone: '9876543212',
    designation: 'Revenue Officer',
  },
  {
    id: 'officer-4',
    name: 'Sunita Verma',
    email: 'sunita.verma@gov.in',
    department: 'general',
    role: 'head',
    phone: '9876543213',
    designation: 'Head Officer',
  },
]

// Demo password for all officers
export const DEMO_PASSWORD = 'officer123'

// Login officer
export function loginOfficer(email: string, password: string): Officer | null {
  if (password !== DEMO_PASSWORD) {
    return null
  }

  const officer = demoOfficers.find(o => o.email === email)
  if (!officer) {
    return null
  }

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('officer', JSON.stringify(officer))
    localStorage.setItem('officerToken', 'demo-officer-token-' + Date.now())
  }

  return officer
}

// Get current officer
export function getCurrentOfficer(): Officer | null {
  if (typeof window === 'undefined') return null
  
  const officerStr = localStorage.getItem('officer')
  if (!officerStr) return null

  try {
    return JSON.parse(officerStr)
  } catch {
    return null
  }
}

// Logout officer
export function logoutOfficer(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('officer')
    localStorage.removeItem('officerToken')
  }
}

// Check if officer is logged in
export function isOfficerLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('officer')
}

// Get department label
export function getDepartmentLabel(department: string): string {
  const labels: Record<string, string> = {
    health: 'Health Department',
    education: 'Education Department',
    revenue: 'Revenue Department',
    transport: 'Transport Department',
    utility: 'Utility Department',
    general: 'General Administration',
  }
  return labels[department] || department
}

// Get role label
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    officer: 'Officer',
    'senior-officer': 'Senior Officer',
    head: 'Head Officer',
  }
  return labels[role] || role
}
