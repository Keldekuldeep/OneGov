import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1a365d] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm">
          <p className="mb-2">© 2026 OneGov Portal | Developed by Team CodeSphere</p>
          <div className="flex items-center justify-center gap-6 text-xs">
            <a href="mailto:support@onegov.in" className="flex items-center gap-1 hover:text-gray-300">
              <Mail size={14} />
              support@onegov.in
            </a>
            <span>|</span>
            <a href="tel:18001234567" className="flex items-center gap-1 hover:text-gray-300">
              <Phone size={14} />
              1800 XXXXXXX
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
