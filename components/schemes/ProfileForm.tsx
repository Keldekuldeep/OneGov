"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CitizenProfile } from '@/lib/schemeData'
import { User, Loader2 } from 'lucide-react'
import { profileAPI, authAPI } from '@/lib/api'

interface ProfileFormProps {
  onSave: (profile: CitizenProfile) => void
  initialProfile: CitizenProfile | null
}

export default function ProfileForm({ onSave, initialProfile }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<CitizenProfile>(
    initialProfile || {
      name: '',
      age: 25,
      gender: 'Male',
      category: 'General',
      income: 100000,
      occupation: 'Worker',
      hasBPLCard: false,
      state: 'Madhya Pradesh',
      mobile: '',
      email: '',
      aadhaar: '',
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSaving(true)
    try {
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      // Save to backend
      const response = await profileAPI.saveProfile({
        userId: user.id,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        category: formData.category,
        occupation: formData.occupation,
        income: formData.income,
        state: formData.state,
        hasBPLCard: formData.hasBPLCard,
        isMinority: false,
        hasDisability: false,
        isStudent: formData.occupation === 'Student',
        isFarmer: formData.occupation === 'Farmer',
      })

      console.log('✅ Profile saved to backend:', response)
      onSave(formData)
    } catch (error) {
      console.error('❌ Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <User size={40} />
            <h1 className="text-4xl font-bold">Create Your Profile</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Fill your details once to get personalized scheme recommendations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Economic Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economic Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Annual Income (₹) *</Label>
                  <Input
                    id="income"
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Select value={formData.occupation} onValueChange={(value) => setFormData({ ...formData, occupation: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Farmer">Farmer</SelectItem>
                      <SelectItem value="Worker">Worker</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bpl">BPL Card Holder *</Label>
                  <Select
                    value={formData.hasBPLCard ? 'yes' : 'no'}
                    onValueChange={(value) => setFormData({ ...formData, hasBPLCard: value === 'yes' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10 digits"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                    placeholder="12 digits"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-[#2c5282] hover:bg-[#1e3a5f]" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  'Save Profile & Find Schemes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
