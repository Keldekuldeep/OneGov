"use client"

import { Shield, Menu, Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLoggedInAdmin, logoutAdmin } from '@/lib/adminAuth'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter()
  const admin = getLoggedInAdmin()

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={24} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Shield className="text-purple-600" size={24} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
              <p className="text-xs text-gray-500">System Administration</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <div className="hidden md:flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{admin?.name}</p>
              <p className="text-xs text-purple-600 capitalize">{admin?.role.replace('-', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="text-purple-600" size={20} />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}
