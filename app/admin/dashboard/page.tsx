"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, UserCheck, FileText, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import StatsCard from '@/components/admin/StatsCard'
import { authAPI, adminAPI } from '@/lib/api'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOfficers: 0,
    totalCitizens: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalHealthServices: 0,
  })

  useEffect(() => {
    setMounted(true)
    
    // Check if admin is logged in
    const admin = authAPI.getCurrentAdmin()
    if (!admin) {
      router.push('/admin/login')
      return
    }

    // Fetch system stats
    fetchSystemStats()
  }, [router])

  const fetchSystemStats = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getSystemStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const admin = authAPI.getCurrentAdmin()
  if (!admin) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to OneGov Admin Portal</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    icon={UserCheck}
                    title="Total Citizens"
                    value={stats.totalCitizens}
                    color="bg-blue-600"
                    href="/admin/citizens"
                  />
                  <StatsCard
                    icon={Users}
                    title="Total Officers"
                    value={stats.totalOfficers}
                    color="bg-purple-600"
                    href="/admin/officers"
                  />
                  <StatsCard
                    icon={FileText}
                    title="Total Applications"
                    value={stats.totalApplications}
                    color="bg-green-600"
                    href="/admin/applications"
                  />
                  <StatsCard
                    icon={MessageSquare}
                    title="Total Complaints"
                    value={stats.totalComplaints}
                    color="bg-orange-600"
                    href="/admin/complaints"
                  />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Pending Applications</p>
                      <Clock className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Pending Complaints</p>
                      <MessageSquare className="text-orange-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Resolved Complaints</p>
                      <CheckCircle className="text-teal-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolvedComplaints}</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Health Services</p>
                      <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHealthServices}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
