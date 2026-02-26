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

export default function DeathCertificateForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    deceasedName: '',
    gender: '',
    dateOfDeath: '',
    timeOfDeath: '',
    placeOfDeath: '',
    hospitalName: '',
    causeOfDeath: '',
    ageAtDeath: '',
    fatherName: '',
    motherName: '',
    informantName: '',
    informantRelation: '',
    informantMobile: '',
    informantAadhaar: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    declaration: false,
  })

  const [files, setFiles] = useState({
    deathCertificate: null as File | null,
    aadhaarCard: null as File | null,
    medicalCertificate: null as File | null,
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

    if (!formData.deceasedName) newErrors.deceasedName = 'Deceased name is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dateOfDeath) newErrors.dateOfDeath = 'Date of death is required'
    if (!formData.informantName) newErrors.informantName = 'Informant name is required'
    if (!formData.declaration) newErrors.declaration = 'You must accept the declaration'

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
        serviceType: 'death-certificate',
        formData: {
          ...formData,
          files: {
            deathCertificate: files.deathCertificate?.name,
            aadhaarCard: files.aadhaarCard?.name,
            medicalCertificate: files.medicalCertificate?.name,
          }
        }
      })

      console.log('✅ Death Certificate submitted to backend:', response)
      setTrackingId(response.trackingId)
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
        handleReset()
      }, 5000)
    } catch (error: any) {
      console.error('❌ Error submitting death certificate:', error)
      alert(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      deceasedName: '',
      gender: '',
      dateOfDeath: '',
      timeOfDeath: '',
      placeOfDeath: '',
      hospitalName: '',
      causeOfDeath: '',
      ageAtDeath: '',
      fatherName: '',
      motherName: '',
      informantName: '',
      informantRelation: '',
      informantMobile: '',
      informantAadhaar: '',
      state: '',
      district: '',
      city: '',
      pinCode: '',
      declaration: false,
    })
    setFiles({ deathCertificate: null, aadhaarCard: null, medicalCertificate: null })
    setErrors({})
  }

  return (
    <>
      {showSuccess && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-green-900">✅ Death Certificate Application Submitted!</p>
              <p className="text-sm text-green-700">Tracking ID: <span className="font-mono font-bold">{trackingId}</span></p>
              <p className="text-xs text-green-600 mt-1">Saved to backend database</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Deceased Details */}
            <div className="space-y-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">1️⃣ Deceased Person Details</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="deceasedName">Full Name of Deceased <span className="text-red-500">*</span></Label>
                <Input
                  id="deceasedName"
                  value={formData.deceasedName}
                  onChange={(e) => setFormData({...formData, deceasedName: e.target.value})}
                  className="mt-2"
                />
                {errors.deceasedName && <p className="text-red-500 text-sm mt-1">{errors.deceasedName}</p>}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="dateOfDeath">Date of Death <span className="text-red-500">*</span></Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => setFormData({...formData, dateOfDeath: e.target.value})}
                    className="mt-2"
                  />
                  {errors.dateOfDeath && <p className="text-red-500 text-sm mt-1">{errors.dateOfDeath}</p>}
                </div>
                <div>
                  <Label htmlFor="timeOfDeath">Time of Death</Label>
                  <Input
                    id="timeOfDeath"
                    type="time"
                    value={formData.timeOfDeath}
                    onChange={(e) => setFormData({...formData, timeOfDeath: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="ageAtDeath">Age at Death</Label>
                  <Input
                    id="ageAtDeath"
                    type="number"
                    value={formData.ageAtDeath}
                    onChange={(e) => setFormData({...formData, ageAtDeath: e.target.value})}
                    className="mt-2"
                  />
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

              <div>
                <Label htmlFor="placeOfDeath">Place of Death</Label>
                <Select
                  value={formData.placeOfDeath}
                  onValueChange={(value) => setFormData({...formData, placeOfDeath: value})}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select place" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.placeOfDeath === 'hospital' && (
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
                <Label htmlFor="causeOfDeath">Cause of Death</Label>
                <Textarea
                  id="causeOfDeath"
                  value={formData.causeOfDeath}
                  onChange={(e) => setFormData({...formData, causeOfDeath: e.target.value})}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Informant Details */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">2️⃣ Informant Details</CardTitle>
              </CardHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="informantName">Informant Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="informantName"
                    value={formData.informantName}
                    onChange={(e) => setFormData({...formData, informantName: e.target.value})}
                    className="mt-2"
                  />
                  {errors.informantName && <p className="text-red-500 text-sm mt-1">{errors.informantName}</p>}
                </div>
                <div>
                  <Label htmlFor="informantRelation">Relation with Deceased</Label>
                  <Input
                    id="informantRelation"
                    value={formData.informantRelation}
                    onChange={(e) => setFormData({...formData, informantRelation: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="informantMobile">Mobile Number</Label>
                  <Input
                    id="informantMobile"
                    value={formData.informantMobile}
                    onChange={(e) => setFormData({...formData, informantMobile: e.target.value})}
                    maxLength={10}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="informantAadhaar">Aadhaar Number</Label>
                  <Input
                    id="informantAadhaar"
                    value={formData.informantAadhaar}
                    onChange={(e) => setFormData({...formData, informantAadhaar: e.target.value})}
                    maxLength={12}
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

            {/* Upload Documents */}
            <div className="space-y-6">
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-gray-900 border-b pb-3">4️⃣ Upload Documents</CardTitle>
              </CardHeader>
              
              <div>
                <Label htmlFor="medicalCertificate">Medical Certificate (if applicable)</Label>
                <div className="mt-2">
                  <label htmlFor="medicalCertificate" className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {files.medicalCertificate ? files.medicalCertificate.name : 'Upload PDF/JPG (Max 2MB)'}
                    </span>
                  </label>
                  <input
                    id="medicalCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'medicalCertificate')}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="aadhaarCard">Informant Aadhaar Card</Label>
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
            </div>

            {/* Declaration */}
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

            {/* Buttons */}
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
