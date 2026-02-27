"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, FileText, MessageSquare, TrendingUp } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import DashboardStats from '@/components/officer/DashboardStats'
import { authAPI, officerAPI } from '@/lib/api'

export default function OfficerDashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pendingHealthServices: 0,
    pendingApplications: 0,
    pendingComplaints: 0,
    totalHealthServices: 0,
    totalApplications: 0,
    totalComplaints: 0,
    totalProcessed: 0,
  })

  useEffect(() => {
    setMounted(true)
    
    // Check if officer is logged in
    const officer = authAPI.getCurrentOfficer()
    if (!officer) {
      router.push('/officer/login')
      return
    }

    // Fetch dashboard stats
    fetchDashboardStats(officer.officerId)
  }, [router])

  const fetchDashboardStats = async (officerId: string) => {
    try {
      setLoading(true)
      const data = await officerAPI.getDashboardStats(officerId)
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const officer = authAPI.getCurrentOfficer()
  if (!officer) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {officer.name}!</h1>
              <p className="text-blue-100">Here's what's happening with your applications today.</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardStats
                    icon={Heart}
                    label="Pending Health Services"
                    value={stats.pendingHealthServices}
                    color="red"
                    href="/officer/health-services"
                  />
                  <DashboardStats
                    icon={FileText}
                    label="Pending Applications"
                    value={stats.pendingApplications}
                    color="blue"
                    href="/officer/applications"
                  />
                  <DashboardStats
                    icon={MessageSquare}
                    label="Pending Complaints"
                    value={stats.pendingComplaints}
                    color="purple"
                    href="/officer/complaints"
                  />
                  <DashboardStats
                    icon={TrendingUp}
                    label="Total Processed"
                    value={stats.totalProcessed}
                    color="green"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Health Services</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHealthServices}</p>
                      </div>
                      <Heart className="text-red-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalApplications}</p>
                      </div>
                      <FileText className="text-blue-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Complaints</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalComplaints}</p>
                      </div>
                      <MessageSquare className="text-purple-500" size={32} />
                    </div>
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
