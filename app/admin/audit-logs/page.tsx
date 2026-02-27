"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollText, Search, Download, Filter } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { mockAuditLogs, formatDate } from '@/lib/adminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AuditLogsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.details.toLowerCase().includes(searchValue.toLowerCase())
    const matchesUserType = userTypeFilter === 'all' || log.userType === userTypeFilter
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter
    return matchesSearch && matchesUserType && matchesModule
  })

  const getUserTypeBadge = (userType: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      officer: 'bg-blue-100 text-blue-800',
      citizen: 'bg-green-100 text-green-800',
    }
    return colors[userType] || 'bg-gray-100 text-gray-800'
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
                <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-gray-600 mt-1">System activity and security logs</p>
              </div>
              <Button variant="outline">
                <Download size={18} className="mr-2" />
                Export Logs
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-purple-600">Admin Actions</p>
                <p className="text-2xl font-bold text-purple-900">
                  {mockAuditLogs.filter(l => l.userType === 'admin').length}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-600">Officer Actions</p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockAuditLogs.filter(l => l.userType === 'officer').length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-600">Citizen Actions</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockAuditLogs.filter(l => l.userType === 'citizen').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search logs..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="citizen">Citizen</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="Officer Management">Officer Management</SelectItem>
                    <SelectItem value="Citizen Management">Citizen Management</SelectItem>
                    <SelectItem value="Health Services">Health Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  {filteredLogs.length} Log{filteredLogs.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="divide-y">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{log.action}</h3>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getUserTypeBadge(log.userType)}`}>
                                {log.userType.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{log.details}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span><span className="font-medium">User:</span> {log.userName}</span>
                          <span>•</span>
                          <span><span className="font-medium">Module:</span> {log.module}</span>
                          <span>•</span>
                          <span><span className="font-medium">IP:</span> {log.ipAddress}</span>
                        </div>
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
