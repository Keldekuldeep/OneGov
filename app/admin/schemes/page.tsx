"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { mockSchemes, getStatusBadgeColor } from '@/lib/adminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SchemesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const filteredSchemes = mockSchemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || scheme.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleToggleStatus = (schemeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    alert(`Scheme ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schemes Management</h1>
                <p className="text-gray-600 mt-1">Manage government schemes and programs</p>
              </div>
              <Link href="/admin/schemes/add">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus size={18} className="mr-2" />
                  Add Scheme
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Total Schemes</p>
                <p className="text-2xl font-bold text-gray-900">{mockSchemes.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockSchemes.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSchemes.filter(s => s.status === 'inactive').length}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockSchemes.reduce((sum, s) => sum + s.applicationsCount, 0)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search schemes..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Gift className="text-purple-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                          {scheme.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(scheme.status)}`}>
                          {scheme.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Benefits:</span>
                      <p className="text-gray-600">{scheme.benefits}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Applications:</span>
                      <span className="text-gray-900 ml-2">{scheme.applicationsCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/admin/schemes/${scheme.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(scheme.id, scheme.status)}
                      className={scheme.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                    >
                      {scheme.status === 'active' ? (
                        <><ToggleRight size={14} className="mr-1" /> Deactivate</>
                      ) : (
                        <><ToggleLeft size={14} className="mr-1" /> Activate</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
