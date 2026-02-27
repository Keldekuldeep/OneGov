import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatsCardProps {
  icon: LucideIcon
  title: string
  value: number | string
  trend?: {
    value: number
    isPositive: boolean
  }
  color: string
  href?: string
}

export default function StatsCard({ icon: Icon, title, value, trend, color, href }: StatsCardProps) {
  const CardWrapper = href ? Link : 'div'
  
  return (
    <CardWrapper href={href || '#'} className={href ? 'block' : ''}>
      <div className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 ${
        href ? 'hover:shadow-xl hover:border-purple-300 cursor-pointer' : ''
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon size={24} className="text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </CardWrapper>
  )
}
