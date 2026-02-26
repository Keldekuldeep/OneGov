"use client"

import { useState } from 'react'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Loader2, Search, CheckCircle, Clock, XCircle } from 'lucide-react'
import { complaintsAPI } from '@/lib/api'

interface Complaint {
  id: string
  trackingId: string
  type: string
  category: string
  description: string
  status: string
  priority: string
  filedDate: string
  resolution?: string
}

export default function TrackComplaint() {
  const [trackingId, setTrackingId] = useState('')
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setIsSearching(true)
    try {
      const response = await complaintsAPI.track(trackingId.trim())
      console.log('✅ Complaint found:', response)
      setComplaint(response.complaint)
    } catch (err) {
      console.error('❌ Error tracking complaint:', err)
      setError('Complaint not found. Please check your tracking ID.')
      setComplaint(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="text-green-600" size={24} />
      case 'in_progress':
        return <Clock className="text-blue-600" size={24} />
      case 'rejected':
        return <XCircle className="text-red-600" size={24} />
      default:
        return <Clock className="text-yellow-600" size={24} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2c5282] to-[#3b82f6] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Track Your Complaint</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Enter your tracking ID to check the status
          </p>
        </div>
      </section>

      {/* Tracking Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <Label htmlFor="trackingId" className="text-gray-700 font-medium text-lg mb-3 block">
                    Complaint Tracking ID
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="trackingId"
                      type="text"
                      placeholder="Enter your tracking ID"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      required
                      className="h-14 text-base flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-8"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Track
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Complaint Details */}
          {complaint && (
            <Card className="mt-8 border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{complaint.category}</h2>
                    <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{complaint.trackingId}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{complaint.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Filed On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(complaint.filedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="text-green-600" size={20} />
                      <p className="font-semibold text-green-900">Resolution</p>
                    </div>
                    <p className="text-green-800">{complaint.resolution}</p>
                  </div>
                )}

                {complaint.status === 'pending' && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      ⏳ Your complaint is being reviewed. We'll update you soon.
                    </p>
                  </div>
                )}

                {complaint.status === 'in_progress' && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      🔄 Your complaint is being processed by the concerned department.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
