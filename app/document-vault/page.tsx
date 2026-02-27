"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, CheckCircle, Clock, XCircle, Trash2, Eye, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { documentsAPI, authAPI } from '@/lib/api'
import { isCitizenLoggedIn } from '@/lib/citizenAuth'
import {
  DocumentType,
  documentTypeLabels,
  requiredDocuments,
} from '@/lib/documentVault'

interface Document {
  id: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: number
  uploadDate: string
  verificationStatus: string
  fileUrl?: string
}

export default function DocumentVaultPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedType, setSelectedType] = useState<DocumentType>('aadhaar')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!isCitizenLoggedIn()) {
      router.push('/citizen/login')
      return
    }
    setMounted(true)
    loadDocuments()
  }, [router])

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        // Use consistent demo user ID from localStorage
        const storedUserId = localStorage.getItem('demo-user-id')
        if (storedUserId) {
          user = { id: storedUserId }
        } else {
          const newUserId = 'demo-user-' + Date.now()
          localStorage.setItem('demo-user-id', newUserId)
          user = { id: newUserId }
        }
      }

      const response = await documentsAPI.getUserDocuments(user.id)
      console.log('✅ Documents loaded from backend:', response)
      
      // Map documents and add name field from type
      const mappedDocs = (response.documents || []).map((doc: any) => ({
        ...doc,
        id: doc.documentId,
        name: documentTypeLabels[doc.type as DocumentType] || doc.type,
        uploadDate: doc.uploadedAt,
      }))
      
      setDocuments(mappedDocs)
    } catch (error) {
      console.error('❌ Error loading documents:', error)
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        // Use consistent demo user ID from localStorage
        const storedUserId = localStorage.getItem('demo-user-id')
        if (storedUserId) {
          user = { id: storedUserId }
        } else {
          const newUserId = 'demo-user-' + Date.now()
          localStorage.setItem('demo-user-id', newUserId)
          user = { id: newUserId }
        }
      }

      // In real app, you would upload file to cloud storage first
      // For now, we'll use a placeholder URL
      const fileUrl = `https://storage.example.com/${selectedFile.name}`

      const response = await documentsAPI.upload({
        userId: user.id,
        type: selectedType,
        fileName: selectedFile.name,
        fileUrl: fileUrl,
        fileSize: selectedFile.size,
      })

      console.log('✅ Document uploaded to backend:', response)
      
      // Reload documents
      await loadDocuments()
      
      setShowUploadForm(false)
      setSelectedFile(null)
    } catch (error) {
      console.error('❌ Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await documentsAPI.delete(id)
      console.log('✅ Document deleted from backend')
      await loadDocuments()
    } catch (error) {
      console.error('❌ Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const handleLoadDemo = async () => {
    setIsLoading(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        // Use consistent demo user ID from localStorage
        const storedUserId = localStorage.getItem('demo-user-id')
        if (storedUserId) {
          user = { id: storedUserId }
        } else {
          const newUserId = 'demo-user-' + Date.now()
          localStorage.setItem('demo-user-id', newUserId)
          user = { id: newUserId }
        }
      }

      // Upload demo documents
      const demoDocuments = [
        { type: 'aadhaar', fileName: 'aadhaar_card.pdf', fileSize: 245000 },
        { type: 'pan', fileName: 'pan_card.pdf', fileSize: 180000 },
        { type: 'photo', fileName: 'passport_photo.jpg', fileSize: 95000 },
        { type: 'bank-passbook', fileName: 'bank_passbook.pdf', fileSize: 320000 },
      ]

      for (const doc of demoDocuments) {
        await documentsAPI.upload({
          userId: user.id,
          type: doc.type,
          fileName: doc.fileName,
          fileUrl: `https://storage.example.com/${doc.fileName}`,
          fileSize: doc.fileSize,
        })
      }

      console.log('✅ Demo documents loaded')
      await loadDocuments()
    } catch (error) {
      console.error('❌ Error loading demo documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering localStorage content until mounted
  if (!mounted) {
    return null
  }

  const missingDocs = requiredDocuments.filter(type => 
    !documents.some(doc => doc.type === type)
  )
  const verifiedCount = documents.filter(d => d.verificationStatus === 'verified').length
  const pendingCount = documents.filter(d => d.verificationStatus === 'pending').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="text-green-600" size={20} />
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      verified: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={40} />
            <h1 className="text-4xl font-bold">Document Vault</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Upload once, use everywhere - Your digital document locker
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={32} />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                  <p className="text-gray-600">Total Documents</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={32} />
                <div>
                  <p className="text-3xl font-bold text-green-900">{verifiedCount}</p>
                  <p className="text-green-700">Verified</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={32} />
                <div>
                  <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
                  <p className="text-yellow-700">Pending Verification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Missing Documents Alert */}
          {missingDocs.length > 0 && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-orange-900 mb-2">⚠️ Required Documents Missing</h3>
              <p className="text-orange-800 mb-3">
                Please upload the following required documents to use all services:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingDocs.map(type => (
                  <span key={type} className="px-3 py-1 bg-orange-200 text-orange-900 rounded-lg text-sm font-medium">
                    {documentTypeLabels[type]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-[#2c5282] hover:bg-[#1e3a5f]"
            >
              <Plus size={20} className="mr-2" />
              Upload New Document
            </Button>
            {documents.length === 0 && (
              <Button onClick={handleLoadDemo} variant="outline">
                Load Demo Documents
              </Button>
            )}
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Document</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docType">Document Type *</Label>
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DocumentType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">Select File (PDF/JPG/PNG, Max 2MB) *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowUploadForm(false)} disabled={isUploading}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
              <p className="text-gray-600 text-sm mt-1">
                All your uploaded documents in one secure place
              </p>
            </div>

            {documents.length === 0 ? (
              <div className="p-12 text-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mx-auto text-gray-400 mb-4 animate-spin" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Documents...</h3>
                  </>
                ) : (
                  <>
                    <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Yet</h3>
                    <p className="text-gray-600 mb-4">Upload your documents to get started</p>
                    <Button onClick={() => setShowUploadForm(true)}>
                      <Upload size={18} className="mr-2" />
                      Upload First Document
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{documentTypeLabels[doc.type as DocumentType] || doc.type}</h4>
                            {getStatusBadge(doc.verificationStatus)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {doc.fileName} • {(doc.fileSize / 1024).toFixed(2)} KB
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.verificationStatus)}
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">🔒 How Document Vault Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Upload documents once, use them across all services</li>
              <li>✓ Documents are automatically attached when applying for schemes</li>
              <li>✓ Verification status helps track document approval</li>
              <li>✓ No need to upload same documents repeatedly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
