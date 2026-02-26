"use client"

import { ChevronRight } from 'lucide-react'
import React from 'react'

interface ServiceItemProps {
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  title: string
  onClick: () => void
}

export default function ServiceItem({ icon, title, onClick }: ServiceItemProps) {
  const IconComponent = icon

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <IconComponent className="text-blue-600" size={20} strokeWidth={2} />
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Redirects to official government portal
          </p>
        </div>
      </div>
      <ChevronRight 
        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
        size={20} 
      />
    </button>
  )
}
