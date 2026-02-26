"use client"

import { useState } from 'react'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { complaintsAPI, authAPI } from '@/lib/api'

export default function FileComplaint() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    subject: '',
    description: '',
    priority: 'medium'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      // Submit to backend
      const response = await complaintsAPI.file({
        userId: user.id,
        type: formData.department,
        category: formData.subject,
        description: formData.description,
        priority: formData.priority
      })

      console.log('✅ Complaint filed to backend:', response)
      setTrackingId(response.trackingId)
      setShowSuccess(true)
      
      // Success message 10 seconds tak dikhega (pehle 5 seconds tha)
      setTimeout(() => {
        setShowSuccess(false)
      }, 10000) // 10 seconds
    } catch (error) {
      console.error('❌ Error filing complaint:', error)
      alert('Failed to file complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      subject: '',
      description: '',
      priority: 'medium'
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2c5282] to-[#3b82f6] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">File a Complaint</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Submit your grievances and we'll address them promptly
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Success Message */}
          {showSuccess && (
            <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">Complaint Filed Successfully!</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-green-700">Your tracking ID:</p>
                      <code className="bg-green-200 text-green-900 px-3 py-1 rounded font-mono font-bold">
                        {trackingId}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(trackingId)
                          alert('Tracking ID copied to clipboard!')
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Copy ID
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      💡 Save this ID to track your complaint later
                    </p>
                  </div>
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
                    placeholder="Enter your full name"
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
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <Label htmlFor="department" className="text-gray-700 font-medium">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({...formData, department: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health Services</SelectItem>
                      <SelectItem value="education">Education Services</SelectItem>
                      <SelectItem value="revenue">Revenue Services</SelectItem>
                      <SelectItem value="transport">Transport Services</SelectItem>
                      <SelectItem value="utility">Utility Services</SelectItem>
                      <SelectItem value="police">Police Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="subject" className="text-gray-700 font-medium">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Brief description of your complaint"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="mt-2"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Detailed Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide complete details about your complaint"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={6}
                    className="mt-2 resize-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority" className="text-gray-700 font-medium">
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
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
                      'Submit Complaint'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    size="lg"
                    variant="outline"
                    onClick={handleClear}
                    className="border-2"
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="mt-8 border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Important Information</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>You will receive a tracking ID after submission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Keep your tracking ID safe for future reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>We aim to respond within 7 working days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>You can track your complaint status anytime</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
