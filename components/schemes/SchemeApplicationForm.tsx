"use client"

import { useState, useEffect } from 'react'
import { X, CheckCircle, FileText, User, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SchemeWithEligibility, CitizenProfile } from '@/lib/schemeData'
import { documentsAPI, applicationsAPI, authAPI } from '@/lib/api'

interface Document {
  id: string
  type: string
  name: string
  fileName: string
  fileSize: number
  verificationStatus: string
}

interface SchemeApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  scheme: SchemeWithEligibility
  profile: CitizenProfile
}

export default function SchemeApplicationForm({ 
  isOpen, 
  onClose, 
  scheme, 
  profile 
}: SchemeApplicationFormProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isLoadingDocs, setIsLoadingDocs] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadDocuments()
    }
  }, [isOpen])

  const loadDocuments = async () => {
    setIsLoadingDocs(true)
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

      console.log('📄 Loading documents for user:', user.id)
      const response = await documentsAPI.getUserDocuments(user.id)
      console.log('✅ Documents loaded:', response.documents?.length || 0)
      
      // Map documents and add name field from type
      const documentTypeLabels: Record<string, string> = {
        'aadhaar': 'Aadhaar Card',
        'pan': 'PAN Card',
        'income-certificate': 'Income Certificate',
        'caste-certificate': 'Caste Certificate',
        'domicile-certificate': 'Domicile Certificate',
        'bank-passbook': 'Bank Passbook',
        'photo': 'Passport Photo',
        'birth-certificate': 'Birth Certificate',
        'address-proof': 'Address Proof',
        'educational-certificate': 'Educational Certificate',
        'bpl-card': 'BPL Card',
      }
      
      const mappedDocs = (response.documents || []).map((doc: any) => ({
        ...doc,
        id: doc.documentId,
        name: documentTypeLabels[doc.type] || doc.type,
        uploadDate: doc.uploadedAt,
      }))
      
      setDocuments(mappedDocs)
    } catch (error) {
      console.error('❌ Error loading documents:', error)
      setDocuments([])
    } finally {
      setIsLoadingDocs(false)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
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

      // Submit to backend
      const response = await applicationsAPI.submit({
        userId: user.id,
        schemeName: scheme.name,
        schemeId: scheme.id,
        documents: attachedDocs.map(d => d.id),
        formData: {
          profile: profile,
          remarks: (e.target as any).remarks?.value || ''
        }
      })

      console.log('✅ Scheme application submitted to backend:', response)
      const id = response.trackingId
      setTrackingId(id)
      
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (error) {
      console.error('❌ Error submitting scheme application:', error)
      alert('Failed to submit application. Please try again.')
      setIsSubmitting(false)
    }
  }

  const attachedDocs = documents.filter(doc => {
    const docType = doc.type.toLowerCase()
    const docName = doc.name.toLowerCase()
    
    return scheme.documents.some(reqDoc => {
      const required = reqDoc.toLowerCase()
      
      // Match common document types
      if (required.includes('aadhaar') && (docType.includes('aadhaar') || docName.includes('aadhaar'))) return true
      if (required.includes('pan') && (docType.includes('pan') || docName.includes('pan'))) return true
      if (required.includes('bank') && (docType.includes('bank') || docName.includes('bank'))) return true
      if (required.includes('photo') && (docType.includes('photo') || docName.includes('photo'))) return true
      if (required.includes('bpl') && (docType.includes('bpl') || docName.includes('bpl'))) return true
      if (required.includes('caste') && (docType.includes('caste') || docName.includes('caste'))) return true
      if (required.includes('income') && (docType.includes('income') || docName.includes('income'))) return true
      if (required.includes('land') && (docType.includes('land') || docName.includes('land'))) return true
      if (required.includes('birth') && (docType.includes('birth') || docName.includes('birth'))) return true
      if (required.includes('death') && (docType.includes('death') || docName.includes('death'))) return true
      if (required.includes('address') && (docType.includes('address') || docName.includes('address'))) return true
      if (required.includes('admission') && (docType.includes('admission') || docName.includes('admission'))) return true
      if (required.includes('educational') && (docType.includes('education') || docName.includes('education'))) return true
      if (required.includes('business') && (docType.includes('business') || docName.includes('business'))) return true
      if (required.includes('age') && (docType.includes('age') || docName.includes('age'))) return true
      
      return false
    })
  })

  console.log('📄 Total documents in vault:', documents.length)
  console.log('📋 Required documents for scheme:', scheme.documents)
  console.log('✅ Auto-attached documents:', attachedDocs.length, attachedDocs.map(d => d.name))

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your application for <span className="font-semibold">{scheme.name}</span> has been successfully submitted.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-1">Tracking ID:</p>
              <p className="text-lg font-bold text-blue-900">{trackingId}</p>
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-4 mb-4 text-sm">
              <p className="font-semibold text-gray-900 mb-2">Application Summary:</p>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Profile auto-filled</li>
                <li>✓ {attachedDocs.length} documents auto-attached</li>
                <li>✓ Verification pending</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} className="flex-1 bg-[#2c5282] hover:bg-[#1e3a5f]">
                Close
              </Button>
              <Button
                onClick={() => window.location.href = '/track-application'}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Track Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {scheme.name}</h2>
            <p className="text-gray-600">{scheme.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auto-filled Profile Section */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-600" size={20} />
                <h3 className="font-bold text-green-900">✓ Auto-Filled from Your Profile</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={profile.name} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={profile.age} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input value={profile.gender} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={profile.category} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Annual Income</Label>
                  <Input value={`₹${profile.income.toLocaleString()}`} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Occupation</Label>
                  <Input value={profile.occupation} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Mobile Number</Label>
                  <Input value={profile.mobile} disabled className="bg-white" />
                </div>
                <div>
                  <Label>Aadhaar Number</Label>
                  <Input value={profile.aadhaar} disabled className="bg-white" />
                </div>
              </div>
            </div>

            {/* Auto-attached Documents Section */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-blue-600" size={20} />
                <h3 className="font-bold text-blue-900">📎 Auto-Attached Documents from Vault</h3>
              </div>
              
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                  <span className="ml-2 text-blue-800">Loading documents...</span>
                </div>
              ) : attachedDocs.length > 0 ? (
                <div className="space-y-2">
                  {attachedDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={18} />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-600">
                            {doc.fileName} • {(doc.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                        {doc.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-yellow-600" size={18} />
                    <p className="text-sm text-yellow-800">
                      No documents found in vault. Please upload required documents first.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Any additional information you want to provide..."
                rows={3}
              />
            </div>

            {/* Declaration */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <p className="text-sm text-gray-700">
                  I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
                  I understand that any false information may lead to rejection of my application.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  '🚀 Submit Application'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
