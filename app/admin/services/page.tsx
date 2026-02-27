"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, ToggleLeft, ToggleRight } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { Button } from '@/components/ui/button'

export default function ServicesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const [services, setServices] = useState([
    { id: 1, name: 'Birth Certificate', category: 'Health', enabled: true, requests: 245 },
    { id: 2, name: 'Death Certificate', category: 'Health', enabled: true, requests: 189 },
    { id: 3, name: 'Health Card', category: 'Health', enabled: true, requests: 312 },
    { id: 4, name: 'Vaccination Certificate', category: 'Health', enabled: true, requests: 156 },
    { id: 5, name: 'Scholarship Application', category: 'Education', enabled: true, requests: 234 },
    { id: 6, name: 'School Admission', category: 'Education', enabled: true, requests: 198 },
    { id: 7, name: 'Transfer Certificate', category: 'Education', enabled: true, requests: 167 },
    { id: 8, name: 'Caste Certificate', category: 'Revenue', enabled: true, requests: 289 },
    { id: 9, name: 'Income Certificate', category: 'Revenue', enabled: true, requests: 345 },
    { id: 10, name: 'Domicile Certificate', category: 'Revenue', enabled: true, requests: 267 },
    { id: 11, name: 'Driving License', category: 'Transport', enabled: true, requests: 423 },
    { id: 12, name: 'Vehicle Registration', category: 'Transport', enabled: true, requests: 378 },
    { id: 13, name: 'Ration Card', category: 'Utility', enabled: true, requests: 456 },
    { id: 14, name: 'Electricity Connection', category: 'Utility', enabled: true, requests: 234 },
  ])

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const handleToggle = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const categories = ['All', 'Health', 'Education', 'Revenue', 'Transport', 'Utility']

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
              <p className="text-gray-600 mt-1">Enable or disable government services</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-600">Enabled</p>
                <p className="text-2xl font-bold text-green-900">
                  {services.filter(s => s.enabled).length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter(s => !s.enabled).length}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-900">
                  {services.reduce((sum, s) => sum + s.requests, 0)}
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredServices.length} Service{filteredServices.length !== 1 ? 's' : ''}
                </h2>
              </div>

              <div className="divide-y">
                {filteredServices.map((service) => (
                  <div key={service.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Briefcase className="text-purple-600" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">
                              Category: <span className="font-medium">{service.category}</span>
                            </span>
                            <span className="text-sm text-gray-600">
                              Requests: <span className="font-medium">{service.requests}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-semibold rounded ${
                          service.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggle(service.id)}
                          className={service.enabled ? 'text-orange-600' : 'text-green-600'}
                        >
                          {service.enabled ? (
                            <><ToggleRight size={16} className="mr-1" /> Disable</>
                          ) : (
                            <><ToggleLeft size={16} className="mr-1" /> Enable</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
