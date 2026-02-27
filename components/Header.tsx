"use client"

import { useState, useEffect } from 'react'
import { Menu, X, Building2, ShieldCheck, Shield, User, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { isCitizenLoggedIn, getLoggedInCitizen, logoutCitizen } from '@/lib/citizenAuth'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [citizenName, setCitizenName] = useState('')
  const router = useRouter()

  useEffect(() => {
    setIsLoggedIn(isCitizenLoggedIn())
    const citizen = getLoggedInCitizen()
    if (citizen) {
      setCitizenName(citizen.name.split(' ')[0]) // First name only
    }
  }, [])

  const handleLogout = () => {
    logoutCitizen()
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="bg-[#2c5282] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <a href="/" className="flex items-center space-x-2">
            <Building2 className="text-white" size={20} />
            <h1 className="text-white font-semibold text-base sm:text-lg">OneGov</h1>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <a href="/" className="text-white hover:text-gray-200 transition text-sm">Home</a>
            <a href="/citizen-services" className="text-white hover:text-gray-200 transition text-sm">Services</a>
            <a href="/scheme-eligibility" className="text-white hover:text-gray-200 transition text-sm">Schemes</a>
            <a href="/document-vault" className="text-white hover:text-gray-200 transition text-sm">Documents</a>
            <a href="/voice-assistant" className="text-white hover:text-gray-200 transition text-sm">Voice</a>
            <a href="/track-application" className="text-white hover:text-gray-200 transition text-sm">Track</a>
            <a href="#contact" className="text-white hover:text-gray-200 transition text-sm">Contact</a>
            <div className="flex gap-2 items-center">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                    <User size={16} className="text-white" />
                    <span className="text-white text-sm font-medium">{citizenName}</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900" onClick={handleLogout}>
                    <LogOut size={14} className="mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/citizen/login">
                  <Button size="sm" className="bg-white text-blue-900 hover:bg-gray-100 font-semibold">
                    <User size={16} className="mr-2" />
                    Login
                  </Button>
                </Link>
              )}
              <Link href="/officer/login">
                <Button size="sm" className="bg-white text-blue-900 hover:bg-gray-100 font-semibold">
                  <ShieldCheck size={16} className="mr-2" />
                  Officer
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700 font-semibold border-2 border-purple-400">
                  <Shield size={16} className="mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/officer/login">
              <Button size="sm" className="bg-white text-blue-900 hover:bg-gray-100 text-xs px-2">
                <ShieldCheck size={14} />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700 text-xs px-2">
                <Shield size={14} />
              </Button>
            </Link>
            <Button 
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-700">
            <a href="/" className="block py-2 text-white hover:text-gray-200">Home</a>
            <a href="/citizen-services" className="block py-2 text-white hover:text-gray-200">Services</a>
            <a href="/scheme-eligibility" className="block py-2 text-white hover:text-gray-200">Schemes</a>
            <a href="/document-vault" className="block py-2 text-white hover:text-gray-200">Documents</a>
            <a href="/voice-assistant" className="block py-2 text-white hover:text-gray-200">Voice</a>
            <a href="/track-application" className="block py-2 text-white hover:text-gray-200">Track</a>
            <a href="#contact" className="block py-2 text-white hover:text-gray-200">Contact</a>
            <div className="pt-3 mt-3 border-t border-blue-700 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white">
                    <User size={16} />
                    <span className="text-sm font-medium">{citizenName}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-white border-white hover:bg-white hover:text-blue-900" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/citizen/login" className="block">
                  <Button size="sm" className="w-full bg-white text-blue-900 hover:bg-gray-100 font-semibold">
                    <User size={16} className="mr-2" />
                    Citizen Login
                  </Button>
                </Link>
              )}
              <Link href="/officer/login" className="block">
                <Button size="sm" className="w-full bg-white text-blue-900 hover:bg-gray-100 font-semibold">
                  <ShieldCheck size={16} className="mr-2" />
                  Officer Login
                </Button>
              </Link>
              <Link href="/admin/login" className="block">
                <Button size="sm" className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold">
                  <Shield size={16} className="mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
