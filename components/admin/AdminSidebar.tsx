"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, LayoutDashboard, Users, UserCheck, Gift, Briefcase, FileText, MessageSquare, BarChart3, FileBarChart, ScrollText, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Officers', href: '/admin/officers', badge: 45 },
  { icon: UserCheck, label: 'Citizens', href: '/admin/citizens', badge: 1247 },
  { icon: Gift, label: 'Schemes', href: '/admin/schemes', badge: 12 },
  { icon: Briefcase, label: 'Services', href: '/admin/services' },
  { icon: FileText, label: 'Applications', href: '/admin/applications', badge: 234 },
  { icon: MessageSquare, label: 'Complaints', href: '/admin/complaints', badge: 14 },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: FileBarChart, label: 'Reports', href: '/admin/reports' },
  { icon: ScrollText, label: 'Audit Logs', href: '/admin/audit-logs' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
  { icon: User, label: 'Profile', href: '/admin/profile' },
]

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile) */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-purple-700">
            <h2 className="text-lg font-bold">Admin Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X size={24} />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'text-purple-100 hover:bg-purple-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-purple-700 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-purple-700">
            <p className="text-xs text-purple-300 text-center">
              OneGov Admin Portal v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
