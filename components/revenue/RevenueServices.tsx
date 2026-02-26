"use client"

import { useState } from 'react'
import { FileText, Award, Home, MapPin, ChevronRight } from 'lucide-react'
import StateSelectorModal from './StateSelectorModal'
import RevenueRedirectModal from './RevenueRedirectModal'
import { statePortals } from '@/lib/govLinks'

const revenueServices = [
  {
    id: 'land-records',
    title: 'Land Records',
    iconName: 'MapPin',
    serviceKey: 'land' as const,
  },
  {
    id: 'income-certificate',
    title: 'Income Certificate',
    iconName: 'FileText',
    serviceKey: 'income' as const,
  },
  {
    id: 'caste-certificate',
    title: 'Caste Certificate',
    iconName: 'Award',
    serviceKey: 'caste' as const,
  },
  {
    id: 'domicile-certificate',
    title: 'Domicile Certificate',
    iconName: 'Home',
    serviceKey: 'domicile' as const,
  },
]

const iconMap: Record<string, any> = {
  MapPin,
  FileText,
  Award,
  Home,
}

export default function RevenueServices() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [isStateSelectorOpen, setIsStateSelectorOpen] = useState(false)
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof revenueServices[0] | null>(null)

  const handleServiceClick = (service: typeof revenueServices[0]) => {
    if (!selectedState) {
      setIsStateSelectorOpen(true)
      setSelectedService(service)
    } else {
      setSelectedService(service)
      setIsRedirectModalOpen(true)
    }
  }

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId)
    if (selectedService) {
      setIsRedirectModalOpen(true)
    }
  }

  const handleConfirm = () => {
    if (selectedState && selectedService) {
      const url = statePortals[selectedState].revenue[selectedService.serviceKey]
      window.open(url, '_blank')
      setIsRedirectModalOpen(false)
      setSelectedService(null)
    }
  }

  const handleCloseRedirect = () => {
    setIsRedirectModalOpen(false)
    setSelectedService(null)
  }

  const handleCloseStateSelector = () => {
    setIsStateSelectorOpen(false)
  }

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl bg-white">
        <div className="border-b bg-gradient-to-r from-green-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Services</h2>
              <p className="text-sm text-gray-600 mt-1">
                Access official revenue and certificate services
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {selectedState && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Selected State:</span> {statePortals[selectedState].name}
                </p>
              </div>
              <button
                onClick={() => setIsStateSelectorOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Change
              </button>
            </div>
          )}

          <div className="space-y-3">
            {revenueServices.map((service) => {
              const Icon = iconMap[service.iconName]
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Icon className="text-green-600" size={20} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                        {service.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Redirects to official state government portal
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" 
                    size={20} 
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
              <p>
                All services redirect to the official State Revenue Department portal for secure processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StateSelectorModal
        isOpen={isStateSelectorOpen}
        onClose={handleCloseStateSelector}
        onSelectState={handleStateSelect}
      />

      <RevenueRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={handleCloseRedirect}
        onConfirm={handleConfirm}
        serviceName={selectedService?.title || ''}
        stateName={selectedState ? statePortals[selectedState].name : ''}
      />
    </>
  )
}
