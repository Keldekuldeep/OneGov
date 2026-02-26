"use client"

import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { getStatesList } from '@/lib/govLinks'

interface StateSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectState: (stateId: string) => void
}

export default function StateSelectorModal({ isOpen, onClose, onSelectState }: StateSelectorModalProps) {
  if (!isOpen) return null

  const states = getStatesList()

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
              Select Your State
            </h3>
            <p className="text-gray-600 text-sm">
              Please select your state to access the official revenue department portal.
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => {
                  onSelectState(state.id)
                  onClose()
                }}
                className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <p className="font-medium text-gray-900">{state.name}</p>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full border-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
