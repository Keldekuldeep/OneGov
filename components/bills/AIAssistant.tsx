"use client"

import { useState, useEffect } from 'react'
import { Bot, X, RotateCcw, HelpCircle } from 'lucide-react'

interface AIAssistantProps {
  message: string
  onUserAction?: (action: string) => void
  showRepeat?: boolean
  showHelp?: boolean
}

export default function AIAssistant({ message, onUserAction, showRepeat = true, showHelp = true }: AIAssistantProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!isVisible) return null

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce"
      >
        <Bot size={28} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 z-50 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold">AI सहायक</h3>
            <p className="text-xs text-white/80">आपकी मदद के लिए</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Message Body */}
      <div className="p-5 space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-gray-800 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {showRepeat && (
            <button
              onClick={() => onUserAction?.('repeat')}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
            >
              <RotateCcw size={16} />
              दोबारा बताएं
            </button>
          )}
          {showHelp && (
            <button
              onClick={() => onUserAction?.('help')}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
            >
              <HelpCircle size={16} />
              समझ नहीं आया
            </button>
          )}
        </div>
      </div>

      {/* Pulse indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  )
}
