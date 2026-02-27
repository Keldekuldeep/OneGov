"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Users, FileText, MessageSquare, Clock } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { mockSystemStats } from '@/lib/adminData'

export default function AnalyticsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const stats = mockSystemStats

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Advanced analytics and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <Users size={32} className="mb-4 opacity-80" />
                <p className="text-blue-100 text-sm mb-1">Total Citizens</p>
                <p className="text-4xl font-bold">{stats.totalCitizens.toLocaleString()}</p>
                <p className="text-blue-100 text-sm mt-2">↑ 12% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <FileText size={32} className="mb-4 opacity-80" />
                <p className="text-purple-100 text-sm mb-1">Total Applications</p>
                <p className="text-4xl font-bold">{stats.totalApplications.toLocaleString()}</p>
                <p className="text-purple-100 text-sm mt-2">↑ 8% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <TrendingUp size={32} className="mb-4 opacity-80" />
                <p className="text-green-100 text-sm mb-1">Approval Rate</p>
                <p className="text-4xl font-bold">87%</p>
                <p className="text-green-100 text-sm mt-2">↑ 3% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <Clock size={32} className="mb-4 opacity-80" />
                <p className="text-orange-100 text-sm mb-1">Avg Response Time</p>
                <p className="text-4xl font-bold">{stats.avgResponseTime} days</p>
                <p className="text-orange-100 text-sm mt-2">↓ 0.5 days improved</p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Applications Trend</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">Line Chart</p>
                    <p className="text-sm text-gray-500">Applications over time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Department Distribution</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">Pie Chart</p>
                    <p className="text-sm text-gray-500">Applications by department</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Department Performance</h2>
              <div className="space-y-4">
                {[
                  { name: 'Health', processed: 245, pending: 23, rate: 91 },
                  { name: 'Education', processed: 189, pending: 34, rate: 85 },
                  { name: 'Revenue', processed: 312, pending: 45, rate: 87 },
                  { name: 'Transport', processed: 156, pending: 28, rate: 84 },
                  { name: 'Utility', processed: 198, pending: 31, rate: 86 },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-gray-900">{dept.name}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${dept.rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{dept.rate}%</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Processed: {dept.processed}</span>
                        <span>Pending: {dept.pending}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Statistics</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">Bar Chart</p>
                  <p className="text-sm text-gray-500">Monthly comparison</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Charts will be implemented using recharts or chart.js library in the backend integration phase.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
