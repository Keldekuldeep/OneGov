// Admin authentication helpers

export interface Admin {
  id: string
  name: string
  email: string
  role: 'super-admin' | 'admin'
  phone: string
  createdAt: string
  lastLogin: string
}

// Demo admin credentials
export const demoAdmins = [
  {
    email: 'super.admin@onegov.in',
    password: 'admin123',
    admin: {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'super.admin@onegov.in',
      role: 'super-admin' as const,
      phone: '9876543200',
      createdAt: '2026-01-01T00:00:00',
      lastLogin: new Date().toISOString(),
    },
  },
  {
    email: 'admin@onegov.in',
    password: 'admin123',
    admin: {
      id: 'admin-2',
      name: 'Admin User',
      email: 'admin@onegov.in',
      role: 'admin' as const,
      phone: '9876543201',
      createdAt: '2026-01-15T00:00:00',
      lastLogin: new Date().toISOString(),
    },
  },
]

export function loginAdmin(email: string, password: string): Admin | null {
  const adminAccount = demoAdmins.find(
    (a) => a.email === email && a.password === password
  )

  if (adminAccount) {
    const admin = { ...adminAccount.admin, lastLogin: new Date().toISOString() }
    localStorage.setItem('admin', JSON.stringify(admin))
    return admin
  }

  return null
}

export function logoutAdmin(): void {
  localStorage.removeItem('admin')
}

export function getLoggedInAdmin(): Admin | null {
  if (typeof window === 'undefined') return null
  
  const adminStr = localStorage.getItem('admin')
  if (!adminStr) return null

  try {
    return JSON.parse(adminStr)
  } catch {
    return null
  }
}

export function isAdminLoggedIn(): boolean {
  return getLoggedInAdmin() !== null
}

export function isSuperAdmin(): boolean {
  const admin = getLoggedInAdmin()
  return admin?.role === 'super-admin'
}
