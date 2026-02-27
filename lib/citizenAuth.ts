// Citizen authentication helpers

export interface Citizen {
  id: string
  name: string
  email: string
  phone: string
  aadhaar: string
  dateOfBirth: string
  address: string
  registeredAt: string
}

// Demo citizen for testing
export const demoCitizen = {
  email: 'citizen@example.com',
  password: 'citizen123',
  citizen: {
    id: 'citizen-demo-1',
    name: 'Demo Citizen',
    email: 'citizen@example.com',
    phone: '9876543210',
    aadhaar: '1234-5678-9012',
    dateOfBirth: '1990-01-01',
    address: '123 Main Street, City, State - 123456',
    registeredAt: new Date().toISOString(),
  },
}

export function loginCitizen(email: string, password: string): Citizen | null {
  // Check demo citizen
  if (email === demoCitizen.email && password === demoCitizen.password) {
    const citizen = { ...demoCitizen.citizen }
    localStorage.setItem('citizen', JSON.stringify(citizen))
    return citizen
  }

  // In real app, this would call backend API
  return null
}

export function registerCitizen(data: {
  name: string
  email: string
  phone: string
  aadhaar: string
  dateOfBirth: string
  address: string
  password: string
}): Citizen | null {
  // In real app, this would call backend API
  const citizen: Citizen = {
    id: `citizen-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    aadhaar: data.aadhaar,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    registeredAt: new Date().toISOString(),
  }

  localStorage.setItem('citizen', JSON.stringify(citizen))
  return citizen
}

export function logoutCitizen(): void {
  // Remove both old and new auth tokens
  localStorage.removeItem('citizen')
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export function getLoggedInCitizen(): Citizen | null {
  if (typeof window === 'undefined') return null
  
  // First check if user is logged in via backend (authToken + user)
  const authToken = localStorage.getItem('authToken')
  const userStr = localStorage.getItem('user')
  
  if (authToken && userStr) {
    try {
      const user = JSON.parse(userStr)
      // Convert backend user format to Citizen format
      return {
        id: user.id || user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        aadhaar: user.aadhaar || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        registeredAt: user.createdAt || new Date().toISOString(),
      }
    } catch {
      // Fall through to old method
    }
  }
  
  // Fallback to old local storage method
  const citizenStr = localStorage.getItem('citizen')
  if (!citizenStr) return null

  try {
    return JSON.parse(citizenStr)
  } catch {
    return null
  }
}

export function isCitizenLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check if user is logged in via backend
  const authToken = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  
  if (authToken && user) {
    return true
  }
  
  // Fallback to old method
  return getLoggedInCitizen() !== null
}

export function updateCitizenProfile(updates: Partial<Citizen>): void {
  const citizen = getLoggedInCitizen()
  if (citizen) {
    const updated = { ...citizen, ...updates }
    localStorage.setItem('citizen', JSON.stringify(updated))
  }
}
