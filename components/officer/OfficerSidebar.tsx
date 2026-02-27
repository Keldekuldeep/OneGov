"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Heart, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  User,
  X
} from 'lucide-react'

interface OfficerSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function OfficerSidebar({ isOpen = true, onClose }: OfficerSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/officer/dashboard',
      badge: null,
    },
    {
      label: 'Health Services',
      icon: Heart,
      href: '/officer/health-services',
      badge: 12,
    },
    {
      label: 'Applications',
      icon: FileText,
      href: '/officer/applications',
      badge: 8,
    },
    {
      label: 'Documents',
      icon: FolderOpen,
      href: '/officer/documents',
      badge: 15,
    },
    {
      label: 'Complaints',
      icon: MessageSquare,
      href: '/officer/complaints',
      badge: 5,
    },
    {
      label: 'Profile',
      icon: User,
      href: '/officer/profile',
      badge: null,
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white
          w-64 z-50 transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-blue-700 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h2 className="text-2xl font-bold">OneGov</h2>
          <p className="text-sm text-blue-200">Officer Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-700 text-white shadow-lg' 
                    : 'text-blue-100 hover:bg-blue-700/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <p className="text-xs text-blue-200 text-center">
            © 2026 OneGov Portal
          </p>
        </div>
      </aside>
    </>
  )
}
