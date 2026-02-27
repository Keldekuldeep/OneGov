"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Building, Award, TrendingUp } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import { isOfficerLoggedIn, getCurrentOfficer, getDepartmentLabel, getRoleLabel } from '@/lib/officerAuth'
import { Button } from '@/components/ui/button'

export default function OfficerProfilePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isOfficerLoggedIn()) {
      router.push('/officer/login')
    }
  }, [router])

  if (!mounted) return null

  const officer = getCurrentOfficer()
  if (!officer) return null

  // Mock performance stats
  const stats = {
    totalProcessed: 234,
    thisMonth: 45,
    avgProcessingTime: '2.5 days',
    satisfactionRate: '95%',
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Officer Profile</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {officer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{officer.name}</h2>
                  <p className="text-gray-600 mb-4">{officer.designation}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{officer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{officer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Department</p>
                        <p className="font-semibold text-gray-900">{getDepartmentLabel(officer.department)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="font-semibold text-gray-900">{getRoleLabel(officer.role)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Statistics</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="mx-auto text-blue-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProcessed}</p>
                  <p className="text-sm text-gray-600">Total Processed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime}</p>
                  <p className="text-sm text-gray-600">Avg Processing Time</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats.satisfactionRate}</p>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Performance Report
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
