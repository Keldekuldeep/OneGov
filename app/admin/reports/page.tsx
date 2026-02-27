"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileBarChart, Download, Calendar, Filter } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminLoggedIn } from '@/lib/adminAuth'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function ReportsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [reportType, setReportType] = useState('daily')
  const [department, setDepartment] = useState('all')
  const [format, setFormat] = useState('pdf')

  useEffect(() => {
    setMounted(true)
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!mounted) return null

  const handleGenerateReport = () => {
    alert(`Generating ${reportType} report for ${department} department in ${format.toUpperCase()} format...`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports Generation</h1>
              <p className="text-gray-600 mt-1">Generate and download system reports</p>
            </div>

            {/* Report Generator */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileBarChart className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="quarterly">Quarterly Report</SelectItem>
                      <SelectItem value="yearly">Yearly Report</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerateReport}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <Download size={18} className="mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Report Templates */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Available Report Templates</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Officer Performance Report', desc: 'Detailed officer statistics and performance metrics' },
                  { name: 'Application Status Report', desc: 'Status breakdown of all applications' },
                  { name: 'Citizen Activity Report', desc: 'Citizen registration and activity trends' },
                  { name: 'Scheme Utilization Report', desc: 'Scheme-wise application statistics' },
                  { name: 'Complaint Resolution Report', desc: 'Complaint handling and resolution metrics' },
                  { name: 'Department Comparison Report', desc: 'Cross-department performance analysis' },
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Reports</h2>
              <div className="space-y-3">
                {[
                  { name: 'Monthly Report - February 2026', date: '2026-02-27', size: '2.4 MB', format: 'PDF' },
                  { name: 'Weekly Report - Week 8', date: '2026-02-25', size: '1.8 MB', format: 'PDF' },
                  { name: 'Officer Performance - Q1 2026', date: '2026-02-20', size: '3.1 MB', format: 'Excel' },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileBarChart className="text-purple-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">
                          {report.date} • {report.size} • {report.format}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Report generation will be implemented with backend integration. Reports will include detailed analytics, charts, and exportable data.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
