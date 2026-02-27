"use client"

import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCurrentOfficer, logoutOfficer, getDepartmentLabel } from '@/lib/officerAuth'
import { Button } from '@/components/ui/button'

interface OfficerHeaderProps {
  onMenuClick?: () => void
}

export default function OfficerHeader({ onMenuClick }: OfficerHeaderProps) {
  const router = useRouter()
  const officer = getCurrentOfficer()

  const handleLogout = () => {
    logoutOfficer()
    router.push('/officer/login')
  }

  if (!officer) return null

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">OneGov Officer Portal</h1>
            <p className="text-sm text-gray-600">{getDepartmentLabel(officer.department)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Officer Profile */}
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{officer.name}</p>
              <p className="text-xs text-gray-600">{officer.designation}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {officer.name.charAt(0)}
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
