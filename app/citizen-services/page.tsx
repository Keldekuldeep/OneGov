"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Heart, GraduationCap, Landmark, Car, Zap, Shield, ChevronRight } from 'lucide-react'
import { isCitizenLoggedIn } from '@/lib/citizenAuth'

export default function CitizenServices() {
  const router = useRouter()

  useEffect(() => {
    if (!isCitizenLoggedIn()) {
      router.push('/citizen/login')
    }
  }, [router])
  const services = [
    {
      icon: Heart,
      title: 'Health Services',
      color: 'bg-red-50 text-red-600',
      slug: 'health',
      items: [
        { name: 'Birth Certificate', slug: 'birth-certificate' },
        { name: 'Death Certificate', slug: 'death-certificate' },
        { name: 'Health Card Application', slug: 'health-card' },
        { name: 'Vaccination Certificate', slug: 'vaccination-certificate' },
      ],
    },
    {
      icon: GraduationCap,
      title: 'Education Services',
      color: 'bg-blue-50 text-blue-600',
      slug: 'education',
      items: [
        { name: 'School Admission', slug: 'school-admission' },
        { name: 'Scholarship Application', slug: 'scholarship' },
        { name: 'Transfer Certificate', slug: 'transfer-certificate' },
      ],
    },
    {
      icon: Landmark,
      title: 'Revenue Services',
      color: 'bg-green-50 text-green-600',
      slug: 'revenue',
      items: [
        { name: 'Land Records', slug: 'land-records' },
        { name: 'Income Certificate', slug: 'income-certificate' },
        { name: 'Caste Certificate', slug: 'caste-certificate' },
        { name: 'Domicile Certificate', slug: 'domicile-certificate' },
      ],
    },
    {
      icon: Car,
      title: 'Transport Services',
      color: 'bg-purple-50 text-purple-600',
      slug: 'transport',
      items: [
        { name: 'Driving License', slug: 'driving-license' },
        { name: 'Vehicle Registration', slug: 'vehicle-registration' },
        { name: 'Road Tax Payment', slug: 'road-tax' },
        { name: "Learner's License", slug: 'learners-license' },
      ],
    },
    {
      icon: Zap,
      title: 'Utility Services',
      color: 'bg-yellow-50 text-yellow-600',
      slug: 'utility',
      items: [
        { name: 'Electricity Connection', slug: 'electricity-connection' },
        { name: 'Water Connection', slug: 'water-connection' },
        { name: 'Ration Card', slug: 'ration-card' },
        { name: 'Pension Application', slug: 'pension' },
      ],
    },
    {
      icon: Shield,
      title: 'Police Services',
      color: 'bg-indigo-50 text-indigo-600',
      slug: 'police',
      items: [
        { name: 'Police Verification', slug: 'police-verification' },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Citizen Services</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Access comprehensive government services designed for your convenience
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center`}>
                        <Icon size={28} strokeWidth={2} />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.items.map((item, idx) => (
                        <li key={idx}>
                          <a 
                            href={`/services/${service.slug}/${item.slug}`}
                            className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50 group"
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
