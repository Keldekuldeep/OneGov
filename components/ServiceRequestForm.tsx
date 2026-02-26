"use client"

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { applicationsAPI, authAPI } from '@/lib/api'

interface ServiceRequestFormProps {
  serviceName: string
  serviceType?: string
}

export default function ServiceRequestForm({ serviceName, serviceType }: ServiceRequestFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: serviceType || '',
    details: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      // Get current user or use demo user
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      // Submit to backend
      const response = await applicationsAPI.submit({
        userId: user.id,
        schemeName: serviceName,
        schemeId: serviceName.toLowerCase().replace(/\s+/g, '-'),
        documents: [],
        formData: formData
      })

      console.log(`✅ ${serviceName} submitted to backend:`, response)
      setTrackingId(response.trackingId)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error(`❌ Error submitting ${serviceName}:`, error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      serviceType: serviceType || '',
      details: ''
    })
  }

  return (
    <>
      {showSuccess && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">Application Submitted Successfully!</p>
              <p className="text-sm text-green-700">Your tracking ID: {trackingId || 'APP' + Date.now()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="text-gray-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              className="mt-2"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="mt-2"
              />
            </div>
          </div>

          {/* Service Type */}
          {!serviceType && (
            <div>
              <Label htmlFor="serviceType" className="text-gray-700 font-medium">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({...formData, serviceType: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Application</SelectItem>
                  <SelectItem value="renewal">Renewal</SelectItem>
                  <SelectItem value="duplicate">Duplicate Copy</SelectItem>
                  <SelectItem value="correction">Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Request Details */}
          <div>
            <Label htmlFor="details" className="text-gray-700 font-medium">
              Request Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="details"
              placeholder="Provide necessary details for your service request"
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
              required
              rows={6}
              className="mt-2 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              size="lg"
              className="bg-[#2c5282] hover:bg-[#1e3a5f] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
            <Button 
              type="button" 
              size="lg"
              variant="outline"
              onClick={handleClear}
              className="border-2 bg-gray-500 text-white hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}
