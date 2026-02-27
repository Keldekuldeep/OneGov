// API Service Layer - Backend se connect karne ke liye

const API_BASE_URL = 'http://localhost:8080/api'

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

// ============================================
// 1. AUTHENTICATION APIs
// ============================================
export const authAPI = {
  // Register new user
  register: async (data: {
    email: string
    password: string
    name: string
    phone: string
    role: string
  }) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    // Save token
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    return response
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Save token
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    return response
  },

  // Get user profile
  getProfile: async (userId: string) => {
    return apiCall(`/auth/profile/${userId}`)
  },

  // Verify token
  verifyToken: async () => {
    return apiCall('/auth/verify')
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Officer login
  officerLogin: async (email: string, password: string) => {
    const response = await apiCall('/auth/officer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Save token and officer data
    if (response.token) {
      localStorage.setItem('officerToken', response.token)
      localStorage.setItem('officer', JSON.stringify(response.officer))
    }
    return response
  },

  // Get officer profile
  getOfficerProfile: async (officerId: string) => {
    return apiCall(`/auth/officer/profile/${officerId}`)
  },

  // Officer logout
  officerLogout: () => {
    localStorage.removeItem('officerToken')
    localStorage.removeItem('officer')
  },

  // Get current officer
  getCurrentOfficer: () => {
    const officerStr = localStorage.getItem('officer')
    return officerStr ? JSON.parse(officerStr) : null
  },

  // Admin login
  adminLogin: async (email: string, password: string) => {
    const response = await apiCall('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Save token and admin data
    if (response.token) {
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('admin', JSON.stringify(response.admin))
    }
    return response
  },

  // Get admin profile
  getAdminProfile: async (adminId: string) => {
    return apiCall(`/auth/admin/profile/${adminId}`)
  },

  // Admin logout
  adminLogout: () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
  },

  // Get current admin
  getCurrentAdmin: () => {
    const adminStr = localStorage.getItem('admin')
    return adminStr ? JSON.parse(adminStr) : null
  },
}

// ============================================
// 2. HEALTH SERVICES APIs
// ============================================
export const healthServicesAPI = {
  // Submit health service (birth/death/health-card/vaccination)
  submit: async (data: {
    userId: string
    serviceType: string
    formData: any
  }) => {
    return apiCall('/health-services', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get service by ID
  getById: async (serviceId: string) => {
    return apiCall(`/health-services/${serviceId}`)
  },

  // Track service by tracking ID
  track: async (trackingId: string) => {
    const service = await apiCall(`/health-services/track/${trackingId}`)
    // Backend returns service directly, wrap it
    return { service }
  },

  // Get user's services
  getUserServices: async (userId: string) => {
    const services = await apiCall(`/health-services/user/${userId}`)
    // Backend returns array directly, wrap it
    return { services: Array.isArray(services) ? services : [] }
  },

  // Update status (Officer only)
  updateStatus: async (serviceId: string, status: string, certificateNumber?: string) => {
    return apiCall(`/health-services/${serviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, certificateNumber }),
    })
  },
}

// ============================================
// 3. CITIZEN PROFILE & SCHEME ELIGIBILITY APIs
// ============================================
export const profileAPI = {
  // Create or update profile
  saveProfile: async (data: {
    userId: string
    name: string
    age: number
    gender: string
    category: string
    occupation: string
    income: number
    state: string
    hasBPLCard: boolean
    isMinority: boolean
    hasDisability: boolean
    isStudent: boolean
    isFarmer: boolean
  }) => {
    return apiCall('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get profile by user ID
  getByUserId: async (userId: string) => {
    return apiCall(`/profiles/user/${userId}`)
  },

  // Get profile by profile ID
  getById: async (profileId: string) => {
    return apiCall(`/profiles/${profileId}`)
  },
}

// ============================================
// 4. DOCUMENT VAULT APIs
// ============================================
export const documentsAPI = {
  // Upload document
  upload: async (data: {
    userId: string
    type: string
    fileName: string
    fileUrl: string
    fileSize: number
  }) => {
    return apiCall('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get document by ID
  getById: async (documentId: string) => {
    return apiCall(`/documents/${documentId}`)
  },

  // Get user's documents
  getUserDocuments: async (userId: string) => {
    const documents = await apiCall(`/documents/user/${userId}`)
    // Backend returns array directly, wrap it in an object
    return { documents: Array.isArray(documents) ? documents : [] }
  },

  // Delete document
  delete: async (documentId: string) => {
    return apiCall(`/documents/${documentId}`, {
      method: 'DELETE',
    })
  },

  // Verify document (Officer only)
  verify: async (documentId: string, verifiedBy: string, status: string) => {
    return apiCall(`/documents/${documentId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verifiedBy, status }),
    })
  },
}

// ============================================
// 5. APPLICATION APIs
// ============================================
export const applicationsAPI = {
  // Submit application
  submit: async (data: {
    userId: string
    schemeName: string
    schemeId: string
    documents: string[]
    formData: any
  }) => {
    return apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get application by ID
  getById: async (applicationId: string) => {
    return apiCall(`/applications/${applicationId}`)
  },

  // Track application
  track: async (trackingId: string) => {
    const application = await apiCall(`/applications/track/${trackingId}`)
    // Backend returns application directly, wrap it
    return { application }
  },

  // Get user's applications
  getUserApplications: async (userId: string) => {
    const applications = await apiCall(`/applications/user/${userId}`)
    // Backend returns array directly, wrap it
    return { applications: Array.isArray(applications) ? applications : [] }
  },

  // Update status (Officer only)
  updateStatus: async (applicationId: string, status: string, officerName: string, officerId: string) => {
    return apiCall(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, officerName, officerId }),
    })
  },
}

// ============================================
// 6. COMPLAINT APIs (includes Voice Assistant)
// ============================================
export const complaintsAPI = {
  // File complaint
  file: async (data: {
    userId: string
    type: string
    category: string
    description: string
    priority: string
  }) => {
    return apiCall('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get complaint by ID
  getById: async (complaintId: string) => {
    return apiCall(`/complaints/${complaintId}`)
  },

  // Track complaint
  track: async (trackingId: string) => {
    return apiCall(`/complaints/track/${trackingId}`)
  },

  // Get user's complaints
  getUserComplaints: async (userId: string) => {
    return apiCall(`/complaints/user/${userId}`)
  },

  // Update status
  updateStatus: async (complaintId: string, status: string, resolution?: string) => {
    return apiCall(`/complaints/${complaintId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolution }),
    })
  },

  // Assign to officer
  assign: async (complaintId: string, officerId: string) => {
    return apiCall(`/complaints/${complaintId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ officerId }),
    })
  },
}

// ============================================
// 7. OFFICER PORTAL APIs
// ============================================
export const officerAPI = {
  // Get dashboard statistics
  getDashboardStats: async (officerId: string) => {
    return apiCall(`/officer/dashboard/stats?officerId=${officerId}`)
  },

  // Get all health services
  getHealthServices: async () => {
    return apiCall('/officer/health-services')
  },

  // Update health service status
  updateHealthServiceStatus: async (serviceId: string, data: {
    status: string
    certificateNumber?: string
    remarks?: string
  }) => {
    return apiCall(`/officer/health-services/${serviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Get all applications
  getApplications: async () => {
    return apiCall('/officer/applications')
  },

  // Update application status
  updateApplicationStatus: async (applicationId: string, data: {
    status: string
    officerName: string
    remarks?: string
  }) => {
    return apiCall(`/officer/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Get all complaints
  getComplaints: async () => {
    return apiCall('/officer/complaints')
  },

  // Update complaint status
  updateComplaintStatus: async (complaintId: string, data: {
    status: string
    resolution?: string
    officerName: string
  }) => {
    return apiCall(`/officer/complaints/${complaintId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Get all documents
  getDocuments: async () => {
    return apiCall('/officer/documents')
  },

  // Verify document
  verifyDocument: async (documentId: string, data: {
    verifiedBy: string
    status: string
    remarks?: string
  }) => {
    return apiCall(`/officer/documents/${documentId}/verify`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// ============================================
// 8. ADMIN PORTAL APIs
// ============================================
export const adminAPI = {
  // Get system dashboard statistics
  getSystemStats: async () => {
    return apiCall('/admin/dashboard/stats')
  },

  // Officer Management
  getAllOfficers: async () => {
    return apiCall('/admin/officers')
  },

  getOfficerById: async (officerId: string) => {
    return apiCall(`/admin/officers/${officerId}`)
  },

  createOfficer: async (data: {
    name: string
    email: string
    password: string
    phone: string
    department: string
    designation: string
    role: string
    createdBy: string
  }) => {
    return apiCall('/admin/officers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateOfficer: async (officerId: string, data: any) => {
    return apiCall(`/admin/officers/${officerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteOfficer: async (officerId: string) => {
    return apiCall(`/admin/officers/${officerId}`, {
      method: 'DELETE',
    })
  },

  // Citizen Management
  getAllCitizens: async () => {
    return apiCall('/admin/citizens')
  },

  updateCitizenStatus: async (userId: string, status: string) => {
    return apiCall(`/admin/citizens/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },

  // Application & Complaint Management
  getAllApplications: async () => {
    return apiCall('/admin/applications')
  },

  getAllComplaints: async () => {
    return apiCall('/admin/complaints')
  },
}

// ============================================
// 9. TEST API
// ============================================
export const testAPI = {
  hello: async () => {
    return apiCall('/test/hello')
  },
}
