"use client"

import { useState } from 'react'
import { Zap, Droplet, ShoppingBag, Wallet, ChevronRight } from 'lucide-react'
import StateSelectorModal from '../revenue/StateSelectorModal'
import UtilityRedirectModal from './UtilityRedirectModal'
import { statePortals } from '@/lib/govLinks'

const utilityServices = [
  {
    id: 'electricity',
    title: 'Electricity Connection',
    iconName: 'Zap',
    serviceKey: 'electricity' as const,
  },
  {
    id: 'water',
    title: 'Water Connection',
    iconName: 'Droplet',
    serviceKey: 'water' as const,
  },
  {
    id: 'ration',
    title: 'Ration Card',
    iconName: 'ShoppingBag',
    serviceKey: 'ration' as const,
  },
  {
    id: 'pension',
    title: 'Pension Application',
    iconName: 'Wallet',
    serviceKey: 'pension' as const,
  },
]

const iconMap: Record<string, any> = {
  Zap,
  Droplet,
  ShoppingBag,
  Wallet,
}

export default function UtilityServices() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [isStateSelectorOpen, setIsStateSelectorOpen] = useState(false)
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof utilityServices[0] | null>(null)

  const handleServiceClick = (service: typeof utilityServices[0]) => {
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
      const url = statePortals[selectedState].utility[selectedService.serviceKey]
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
        <div className="border-b bg-gradient-to-r from-orange-50 to-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Utility Services</h2>
              <p className="text-sm text-gray-600 mt-1">
                Access essential utility and welfare services
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
            {utilityServices.map((service) => {
              const Icon = iconMap[service.iconName]
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Icon className="text-orange-600" size={20} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {service.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Redirects to official government portal
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" 
                    size={20} 
                  />
                </button>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
              <p>
                All services redirect to the official State Department portals for secure processing.
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

      <UtilityRedirectModal
        isOpen={isRedirectModalOpen}
        onClose={handleCloseRedirect}
        onConfirm={handleConfirm}
        serviceName={selectedService?.title || ''}
        stateName={selectedState ? statePortals[selectedState].name : ''}
      />
    </>
  )
}
