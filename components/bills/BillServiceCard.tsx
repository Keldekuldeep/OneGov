"use client"

import { LucideIcon } from 'lucide-react'

interface BillServiceCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  color: string
  isHighlighted?: boolean
  onClick: () => void
}

export default function BillServiceCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  color, 
  isHighlighted = false,
  onClick 
}: BillServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
        isHighlighted 
          ? 'border-blue-500 shadow-2xl scale-105 ring-4 ring-blue-200 animate-pulse-border' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon size={32} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      
      {isHighlighted && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
          यहाँ क्लिक करें
        </div>
      )}
    </button>
  )
}
