"use client"

import { X } from 'lucide-react'
import { Button } from '../ui/button'

interface UtilityRedirectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  serviceName: string
  stateName: string
}

export default function UtilityRedirectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  serviceName,
  stateName 
}: UtilityRedirectModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Redirect to Official Government Website
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You are being redirected to the official department portal of <span className="font-medium text-gray-900">{stateName}</span> for <span className="font-medium text-gray-900">{serviceName}</span>.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-medium rounded">
                Official Government Portal
              </span>
            </div>
            <p className="text-sm text-orange-800">
              <span className="font-medium">Note:</span> This will open in a new tab. Please ensure you have your documents ready.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-[#2c5282] hover:bg-[#1e3a5f] text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
