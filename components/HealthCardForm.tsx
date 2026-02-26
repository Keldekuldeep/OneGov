"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Checkbox } from './ui/checkbox'
import { CheckCircle2, Upload, Loader2 } from 'lucide-react'
import { healthServicesAPI, authAPI } from '@/lib/api'

export default function HealthCardForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    aadhaarNumber: '',
    mobileNumber: '',
    email: '',
    bloodGroup: '',
    height: '',
    weight: '',
    address: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    emergencyContact: '',
    emergencyRelation: '',
    medicalHistory: '',
    allergies: '',
    declaration: false,
  })

  const [files, setFiles] = useState({
    photo: null as File | null,
    aadhaarCard: null as File | null,
    addressProof: null as File | null,
  })

  const validateFile = (file: File | null) => {
    if (!file) return true
    return file.size <= 2 * 1024 * 1024
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const file = e.target.files?.[0] || null
    if (file && !validateFile(file)) {
      setErrors({...errors, [field]: 'File size must be less than 2MB'})
      return
    }
    setFiles({...files, [field]: file})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Aadhaar must be 12 digits'
    if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile must be 10 digits'
    if (!formData.declaration) newErrors.declaration = 'You must accept the declaration'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Get current user or use demo user
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      // Submit to backend
      const response = await healthServicesAPI.submit({
        userId: user.id,
        serviceType: 'health-card',
        formData: formData
      })

      console.log('✅ Health Card submitted to backend:', response)
      setTrackingId(response.trackingId)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error('❌ Error submitting Health Card:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      gender: '',
      dateOfBirth: '',
      fatherName: '',
      motherName: '',
      aadhaarNumber: '',
      mobileNumber: '',
      email: '',
      bloodGroup: '',
      height: '',
      weight: '',
      address: '',
      state: '',
      district: '',
      city: '',
      pinCode: '',
      emergencyContact: '',
      emergencyRelation: '',
      medicalHistory: '',
      allergies: '',
      declaration: false,
    })
    setFiles({ photo: null, aadhaarCard: null, addressProof: null })
    setErrors({})
  }

  return (
    <>
      {showSuccess && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">Application Submitted Successfully!</p>
              <p className="text-sm text-green-700">Your tracking ID: {trackingId || 'HEALTH' + Date.now()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Details */}
            <div className="space-y-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">1️⃣ Personal Details</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="mt-2"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label>Gender <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="mt-2"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({...formData, bloodGroup: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">2️⃣ Contact Details</CardTitle>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="aadhaarNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                    maxLength={12}
                    placeholder="12 digits"
                    className="mt-2"
                  />
                  {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    maxLength={10}
                    placeholder="10 digits"
                    className="mt-2"
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    maxLength={10}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelation">Relation</Label>
                  <Input
                    id="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({...formData, emergencyRelation: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">3️⃣ Address Details</CardTitle>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tripura">Tripura</SelectItem>
                      <SelectItem value="assam">Assam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">City/Village</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode">Pin Code</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                    maxLength={6}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">4️⃣ Medical Information</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="medicalHistory">Medical History (if any)</Label>
                <Input
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  placeholder="Diabetes, Hypertension, etc."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="allergies">Allergies (if any)</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  placeholder="Food, Medicine, etc."
                  className="mt-2"
                />
              </div>
            </div>

            {/* Upload Documents */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">5️⃣ Upload Documents</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="photo">Passport Size Photo <span className="text-red-500">*</span></Label>
                <div className="mt-2">
                  <label htmlFor="photo" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.photo ? files.photo.name : 'Upload JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'photo')}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="aadhaarCard">Aadhaar Card <span className="text-red-500">*</span></Label>
                <div className="mt-2">
                  <label htmlFor="aadhaarCard" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.aadhaarCard ? files.aadhaarCard.name : 'Upload PDF/JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="aadhaarCard"
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addressProof">Address Proof</Label>
                <div className="mt-2">
                  <label htmlFor="addressProof" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.addressProof ? files.addressProof.name : 'Upload PDF/JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="addressProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'addressProof')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="space-y-4">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">6️⃣ Declaration</CardTitle>
              </CardHeader>
              
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Checkbox
                  id="declaration"
                  checked={formData.declaration}
                  onCheckedChange={(checked) => setFormData({...formData, declaration: checked as boolean})}
                />
                <Label htmlFor="declaration" className="font-normal cursor-pointer leading-relaxed">
                  I hereby declare that the information provided is correct and I take full responsibility for its accuracy.
                </Label>
              </div>
              {errors.declaration && <p className="text-red-500 text-sm">{errors.declaration}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <Button 
                type="button" 
                size="lg" 
                variant="outline" 
                onClick={handleReset} 
                className="border-2 px-8"
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
