"use client"

import { useState } from 'react'
import { Car, FileText, CreditCard, BadgeCheck, ChevronRight } from 'lucide-react'
import RedirectModal from './RedirectModal'

const transportServices = [
  {
    id: 'driving-license',
    title: 'Driving Licence',
    iconName: 'BadgeCheck',
    url: 'https://parivahan.gov.in/parivahan/',
  },
  {
    id: 'learner-license',
    title: "Learner's Licence",
    iconName: 'FileText',
    url: 'https://parivahan.gov.in/parivahan/',
  },
  {
    id: 'vehicle-registration',
    title: 'Vehicle Registration',
    iconName: 'Car',
    url: 'https://parivahan.gov.in/parivahan/',
  },
  {
    id: 'road-tax',
    title: 'Road Tax Payment',
    iconName: 'CreditCard',
    url: 'https://parivahan.gov.in/parivahan/',
  },
]

const iconMap: Record<string, any> = {
  BadgeCheck,
  FileText,
  Car,
  CreditCard,
}

export default function TransportServices() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof transportServices[0] | null>(null)

  const handleServiceClick = (service: typeof transportServices[0]) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleConfirm = () => {
    if (selectedService) {
      window.open(selectedService.url, '_blank')
      setIsModalOpen(false)
      setSelectedService(null)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl bg-white">
        <div className="border-b bg-gradient-to-r from-blue-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transport Services</h2>
              <p className="text-sm text-gray-600 mt-1">
                Access official transport and vehicle-related services
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {transportServices.map((service) => {
              const Icon = iconMap[service.iconName]
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Icon className="text-blue-600" size={20} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Redirects to official government portal
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                    size={20} 
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p>
                All services redirect to the official Ministry of Road Transport & Highways portal (Parivahan Sewa) for secure processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RedirectModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        serviceName={selectedService?.title || ''}
      />
    </>
  )
}
