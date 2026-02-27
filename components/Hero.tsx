"use client"

import { Button } from './ui/button'
import { ArrowRight, FileText, ShieldCheck, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isCitizenLoggedIn } from '@/lib/citizenAuth'
import { useLanguage } from '@/lib/languageContext'
import { getTranslation } from '@/lib/translations'

export default function Hero() {
  const router = useRouter()
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)
  const handleViewServices = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isCitizenLoggedIn()) {
      router.push('/citizen-services')
    } else {
      router.push('/citizen/login')
    }
  }

  const handleFileComplaint = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isCitizenLoggedIn()) {
      router.push('/file-complaint')
    } else {
      router.push('/citizen/login')
    }
  }
  return (
    <section className="relative bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button 
              size="lg"
              onClick={handleViewServices}
              className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all group"
            >
              {t('hero.viewServices')}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              onClick={handleFileComplaint}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto transition-all group"
            >
              <FileText size={18} className="mr-2" />
              {t('hero.fileComplaint')}
            </Button>
            <div className="hidden sm:block w-px h-10 bg-white/30" />
            <Link href="/officer/login">
              <Button 
                size="lg"
                className="bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all group border-2 border-indigo-400"
              >
                <ShieldCheck size={18} className="mr-2" />
                {t('hero.officerPortal')}
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button 
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all group border-2 border-purple-400"
              >
                <Shield size={18} className="mr-2" />
                {t('hero.adminPortal')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
