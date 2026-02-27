"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FolderOpen, CheckCircle, XCircle, Eye } from 'lucide-react'
import OfficerHeader from '@/components/officer/OfficerHeader'
import OfficerSidebar from '@/components/officer/OfficerSidebar'
import FilterBar from '@/components/officer/FilterBar'
import { authAPI, officerAPI } from '@/lib/api'
import { getStatusBadgeColor, formatDate } from '@/lib/officerData'
import { Button } from '@/components/ui/button'

export default function DocumentsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    
    // Check if officer is logged in
    const officer = authAPI.getCurrentOfficer()
    if (!officer) {
      router.push('/officer/login')
      return
    }

    // Fetch documents from backend
    fetchDocuments()
  }, [router])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await officerAPI.getDocuments()
      setDocuments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.userName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchValue.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleVerify = async (docId: string) => {
    try {
      const officer = authAPI.getCurrentOfficer()
      await officerAPI.verifyDocument(docId, {
        verifiedBy: officer.name,
        status: 'verified',
      })
      // Refresh documents list
      await fetchDocuments()
      alert('Document verified successfully!')
    } catch (error) {
      console.error('Failed to verify document:', error)
      alert('Failed to verify document')
    }
  }

  const handleReject = async (docId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (reason) {
      try {
        const officer = authAPI.getCurrentOfficer()
        await officerAPI.verifyDocument(docId, {
          verifiedBy: officer.name,
          status: 'rejected',
          remarks: reason,
        })
        // Refresh documents list
        await fetchDocuments()
        alert('Document rejected!')
      } catch (error) {
        console.error('Failed to reject document:', error)
        alert('Failed to reject document')
      }
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <OfficerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfficerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
                <p className="text-gray-600 mt-1">Verify uploaded documents</p>
              </div>
              <FolderOpen className="text-yellow-600" size={32} />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                <p className="mt-2 text-gray-600">Loading documents...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <p className="text-sm text-blue-600">Pending</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {documents.filter(d => d.verificationStatus === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="text-sm text-green-600">Verified</p>
                    <p className="text-2xl font-bold text-green-900">
                      {documents.filter(d => d.verificationStatus === 'verified').length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <p className="text-sm text-red-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-900">
                      {documents.filter(d => d.verificationStatus === 'rejected').length}
                    </p>
                  </div>
                </div>

                <FilterBar
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  statusOptions={statusOptions}
                />

                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">
                      {filteredDocuments.length} Document{filteredDocuments.length !== 1 ? 's' : ''} Found
                    </h2>
                  </div>

                  <div className="divide-y">
                    {filteredDocuments.length === 0 ? (
                      <div className="p-12 text-center">
                        <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FolderOpen className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-gray-900 capitalize">{doc.type?.replace('-', ' ')}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(doc.verificationStatus)}`}>
                                  {doc.verificationStatus?.toUpperCase()}
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div><span className="font-medium">User:</span> {doc.userName}</div>
                                <div><span className="font-medium">File:</span> {doc.fileName}</div>
                                <div><span className="font-medium">Size:</span> {(doc.fileSize / 1024).toFixed(2)} KB</div>
                                <div><span className="font-medium">Uploaded:</span> {formatDate(doc.uploadedAt)}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye size={16} className="mr-1" />
                                View
                              </Button>
                              {doc.verificationStatus === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerify(doc.id)}>
                                    <CheckCircle size={16} className="mr-1" />
                                    Verify
                                  </Button>
                                  <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleReject(doc.id)}>
                                    <XCircle size={16} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
