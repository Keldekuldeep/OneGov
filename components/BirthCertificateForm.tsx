"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Checkbox } from './ui/checkbox'
import { CheckCircle2, Upload, Loader2 } from 'lucide-react'
import { healthServicesAPI, authAPI } from '@/lib/api'

export default function BirthCertificateForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    // Child Details
    childName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    hospitalName: '',
    birthAddress: '',
    
    // Parent Details
    fatherName: '',
    fatherAadhaar: '',
    fatherMobile: '',
    motherName: '',
    motherAadhaar: '',
    motherMobile: '',
    
    // Address Details
    state: '',
    district: '',
    city: '',
    pinCode: '',
    
    // Declaration
    declaration: false,
  })

  const [files, setFiles] = useState({
    dischargeCertificate: null as File | null,
    aadhaarCard: null as File | null,
    affidavit: null as File | null,
  })

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar)
  }

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile)
  }

  const validatePinCode = (pinCode: string) => {
    return /^\d{6}$/.test(pinCode)
  }

  const validateFile = (file: File | null) => {
    if (!file) return true
    const maxSize = 2 * 1024 * 1024 // 2MB
    return file.size <= maxSize
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const file = e.target.files?.[0] || null
    if (file && !validateFile(file)) {
      setErrors({...errors, [field]: 'File size must be less than 2MB'})
      return
    }
    setFiles({...files, [field]: file})
    if (errors[field]) {
      const newErrors = {...errors}
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.childName) newErrors.childName = 'Child name is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.fatherName) newErrors.fatherName = 'Father name is required'
    if (!formData.motherName) newErrors.motherName = 'Mother name is required'
    
    // Validate Aadhaar
    if (!validateAadhaar(formData.fatherAadhaar)) {
      newErrors.fatherAadhaar = 'Aadhaar must be 12 digits'
    }
    if (!validateAadhaar(formData.motherAadhaar)) {
      newErrors.motherAadhaar = 'Aadhaar must be 12 digits'
    }
    
    // Validate Mobile
    if (!validateMobile(formData.fatherMobile)) {
      newErrors.fatherMobile = 'Mobile must be 10 digits'
    }
    if (!validateMobile(formData.motherMobile)) {
      newErrors.motherMobile = 'Mobile must be 10 digits'
    }
    
    // Validate Pin Code
    if (!validatePinCode(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits'
    }
    
    // Validate files
    if (!files.dischargeCertificate) {
      newErrors.dischargeCertificate = 'Hospital discharge certificate is required'
    }
    if (!files.aadhaarCard) {
      newErrors.aadhaarCard = 'Parent Aadhaar card is required'
    }
    
    // Validate declaration
    if (!formData.declaration) {
      newErrors.declaration = 'You must accept the declaration'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 🔗 BACKEND CONNECTION: Submit to API
    setIsSubmitting(true)
    try {
      // Get current user or create demo user
      let user = authAPI.getCurrentUser()
      if (!user) {
        user = { id: 'demo-user-' + Date.now() }
      }

      const response = await healthServicesAPI.submit({
        userId: user.userId,
        serviceType: 'birth-certificate',
        formData: {
          ...formData,
          files: {
            dischargeCertificate: files.dischargeCertificate?.name,
            aadhaarCard: files.aadhaarCard?.name,
            affidavit: files.affidavit?.name,
          }
        }
      })

      console.log('✅ Birth Certificate submitted to backend:', response)
      setTrackingId(response.trackingId)
      setShowSuccess(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
        handleReset()
      }, 5000)
    } catch (error: any) {
      console.error('❌ Error submitting birth certificate:', error)
      alert(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      childName: '',
      gender: '',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      hospitalName: '',
      birthAddress: '',
      fatherName: '',
      fatherAadhaar: '',
      fatherMobile: '',
      motherName: '',
      motherAadhaar: '',
      motherMobile: '',
      state: '',
      district: '',
      city: '',
      pinCode: '',
      declaration: false,
    })
    setFiles({
      dischargeCertificate: null,
      aadhaarCard: null,
      affidavit: null,
    })
    setErrors({})
    setTrackingId('')
  }

  return (
    <>
      {showSuccess && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">✅ Birth Certificate Application Submitted!</p>
              <p className="text-sm text-green-700">Tracking ID: <span className="font-mono font-bold">{trackingId}</span></p>
              <p className="text-xs text-green-600 mt-1">Saved to backend database</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Child Details Section */}
            <div className="space-y-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">1️⃣ Child Details</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="childName">Child Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => setFormData({...formData, childName: e.target.value})}
                  className="mt-2"
                />
                {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
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
                  <Label htmlFor="timeOfBirth">Time of Birth</Label>
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                <Select
                  value={formData.placeOfBirth}
                  onValueChange={(value) => setFormData({...formData, placeOfBirth: value})}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select place of birth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.placeOfBirth === 'hospital' && (
                <div>
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="birthAddress">Birth Address</Label>
                <Textarea
                  id="birthAddress"
                  value={formData.birthAddress}
                  onChange={(e) => setFormData({...formData, birthAddress: e.target.value})}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>

            {/* 2. Parent Details Section */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">2️⃣ Parent Details</CardTitle>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="fatherName">Father's Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    className="mt-2"
                  />
                  {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                </div>
                <div>
                  <Label htmlFor="fatherAadhaar">Father's Aadhaar <span className="text-red-500">*</span></Label>
                  <Input
                    id="fatherAadhaar"
                    value={formData.fatherAadhaar}
                    onChange={(e) => setFormData({...formData, fatherAadhaar: e.target.value})}
                    placeholder="12 digits"
                    maxLength={12}
                    className="mt-2"
                  />
                  {errors.fatherAadhaar && <p className="text-red-500 text-sm mt-1">{errors.fatherAadhaar}</p>}
                </div>
                <div>
                  <Label htmlFor="fatherMobile">Father's Mobile <span className="text-red-500">*</span></Label>
                  <Input
                    id="fatherMobile"
                    value={formData.fatherMobile}
                    onChange={(e) => setFormData({...formData, fatherMobile: e.target.value})}
                    placeholder="10 digits"
                    maxLength={10}
                    className="mt-2"
                  />
                  {errors.fatherMobile && <p className="text-red-500 text-sm mt-1">{errors.fatherMobile}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="motherName">Mother's Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                    className="mt-2"
                  />
                  {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>}
                </div>
                <div>
                  <Label htmlFor="motherAadhaar">Mother's Aadhaar <span className="text-red-500">*</span></Label>
                  <Input
                    id="motherAadhaar"
                    value={formData.motherAadhaar}
                    onChange={(e) => setFormData({...formData, motherAadhaar: e.target.value})}
                    placeholder="12 digits"
                    maxLength={12}
                    className="mt-2"
                  />
                  {errors.motherAadhaar && <p className="text-red-500 text-sm mt-1">{errors.motherAadhaar}</p>}
                </div>
                <div>
                  <Label htmlFor="motherMobile">Mother's Mobile <span className="text-red-500">*</span></Label>
                  <Input
                    id="motherMobile"
                    value={formData.motherMobile}
                    onChange={(e) => setFormData({...formData, motherMobile: e.target.value})}
                    placeholder="10 digits"
                    maxLength={10}
                    className="mt-2"
                  />
                  {errors.motherMobile && <p className="text-red-500 text-sm mt-1">{errors.motherMobile}</p>}
                </div>
              </div>
            </div>

            {/* 3. Address Details */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">3️⃣ Address Details</CardTitle>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({...formData, state: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tripura">Tripura</SelectItem>
                      <SelectItem value="assam">Assam</SelectItem>
                      <SelectItem value="westbengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({...formData, district: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agartala">Agartala</SelectItem>
                      <SelectItem value="udaipur">Udaipur</SelectItem>
                      <SelectItem value="dharmanagar">Dharmanagar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">City/Village <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode">Pin Code <span className="text-red-500">*</span></Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                    placeholder="6 digits"
                    maxLength={6}
                    className="mt-2"
                  />
                  {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* 4. Upload Documents */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">4️⃣ Upload Documents</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="dischargeCertificate">Hospital Discharge Certificate <span className="text-red-500">*</span></Label>
                <div className="mt-2">
                  <label htmlFor="dischargeCertificate" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.dischargeCertificate ? files.dischargeCertificate.name : 'Upload PDF/JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="dischargeCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'dischargeCertificate')}
                    className="hidden"
                  />
                </div>
                {errors.dischargeCertificate && <p className="text-red-500 text-sm mt-1">{errors.dischargeCertificate}</p>}
              </div>

              <div>
                <Label htmlFor="aadhaarCard">Parent Aadhaar Card <span className="text-red-500">*</span></Label>
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
                {errors.aadhaarCard && <p className="text-red-500 text-sm mt-1">{errors.aadhaarCard}</p>}
              </div>

              <div>
                <Label htmlFor="affidavit">Affidavit (Optional)</Label>
                <div className="mt-2">
                  <label htmlFor="affidavit" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.affidavit ? files.affidavit.name : 'Upload PDF/JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="affidavit"
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'affidavit')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* 5. Declaration */}
            <div className="space-y-4">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">5️⃣ Declaration</CardTitle>
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

            {/* 6. Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="bg-[#2c5282] hover:bg-[#1e3a5f] text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting to Backend...
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
                disabled={isSubmitting}
                className="border-2 px-8"
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
