"use client"

import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: string
  onUpdate: (newStatus: string, certificateNumber?: string, remarks?: string) => void
  showCertificateNumber?: boolean
  type: 'health' | 'application' | 'document' | 'complaint'
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
  showCertificateNumber = false,
  type,
}: StatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [certificateNumber, setCertificateNumber] = useState('')
  const [remarks, setRemarks] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const getStatusOptions = () => {
    switch (type) {
      case 'health':
        return [
          { value: 'submitted', label: 'Submitted' },
          { value: 'verified', label: 'Verified' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'issued', label: 'Issued' },
          { value: 'rejected', label: 'Rejected' },
        ]
      case 'application':
        return [
          { value: 'submitted', label: 'Submitted' },
          { value: 'verified', label: 'Verified' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]
      case 'document':
        return [
          { value: 'pending', label: 'Pending' },
          { value: 'verified', label: 'Verified' },
          { value: 'rejected', label: 'Rejected' },
        ]
      case 'complaint':
        return [
          { value: 'pending', label: 'Pending' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'rejected', label: 'Rejected' },
        ]
      default:
        return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    onUpdate(newStatus, certificateNumber || undefined, remarks || undefined)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Status</h2>
          <p className="text-gray-600">Change the status and add remarks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Current Status:</p>
            <p className="font-semibold text-gray-900 capitalize">
              {currentStatus.replace('_', ' ')}
            </p>
          </div>

          {/* New Status */}
          <div>
            <Label htmlFor="status">New Status *</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Certificate Number (for health services) */}
          {showCertificateNumber && newStatus === 'issued' && (
            <div>
              <Label htmlFor="certificateNumber">Certificate Number *</Label>
              <Input
                id="certificateNumber"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="e.g., BIRTH-2026-001234"
                required
              />
            </div>
          )}

          {/* Remarks */}
          <div>
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes or comments..."
              rows={3}
            />
          </div>

          {/* Buttons */}
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Updating...'
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
