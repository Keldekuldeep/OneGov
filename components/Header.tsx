"use client"

import { useState } from 'react'
import { Menu, X, Building2 } from 'lucide-react'
import { Button } from './ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
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
          </nav>
        )}
      </div>
    </header>
  )
}
