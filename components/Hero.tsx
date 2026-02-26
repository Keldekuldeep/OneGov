import { Button } from './ui/button'
import { ArrowRight, FileText } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Digital India Initiative</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to OneGov Portal
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering citizens through seamless digital governance and accessible public services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/citizen-services">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all group"
              >
                View Services
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="/file-complaint">
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto transition-all group"
              >
                <FileText size={18} className="mr-2" />
                File Complaint
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
