"use client"

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProfileForm from '@/components/schemes/ProfileForm'
import SchemeCard from '@/components/schemes/SchemeCard'
import { CitizenProfile, getEligibleSchemes, SchemeWithEligibility } from '@/lib/schemeData'

export default function SchemeEligibilityPage() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null)
  const [eligibleSchemes, setEligibleSchemes] = useState<SchemeWithEligibility[]>([])
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('citizenProfile')
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile(parsedProfile)
      const schemes = getEligibleSchemes(parsedProfile)
      setEligibleSchemes(schemes)
    } else {
      setShowProfileForm(true)
    }
  }, [])

  const handleProfileSave = (newProfile: CitizenProfile) => {
    setProfile(newProfile)
    localStorage.setItem('citizenProfile', JSON.stringify(newProfile))
    const schemes = getEligibleSchemes(newProfile)
    setEligibleSchemes(schemes)
    setShowProfileForm(false)
  }

  const handleEditProfile = () => {
    setShowProfileForm(true)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const eligibleCount = eligibleSchemes.filter((s) => s.eligibilityStatus === 'eligible').length
  const nearlyEligibleCount = eligibleSchemes.filter((s) => s.eligibilityStatus === 'nearly-eligible').length

  if (showProfileForm) {
    return <ProfileForm onSave={handleProfileSave} initialProfile={profile} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Smart Scheme Eligibility Engine</h1>
          <p className="text-blue-100 text-lg">
            Personalized government scheme recommendations based on your profile
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {profile && (
          <div className="max-w-6xl mx-auto">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">
                      {profile.age} years • {profile.occupation} • {profile.category}
                    </p>
                  </div>
                </div>
                <Button onClick={handleEditProfile} variant="outline">
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Annual Income</p>
                  <p className="font-semibold text-gray-900">₹{profile.income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State</p>
                  <p className="font-semibold text-gray-900">{profile.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">BPL Card</p>
                  <p className="font-semibold text-gray-900">{profile.hasBPLCard ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold text-gray-900">{profile.gender}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <p className="text-3xl font-bold text-green-900">{eligibleCount}</p>
                    <p className="text-green-700">Schemes You're Eligible For</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-yellow-600" size={32} />
                  <div>
                    <p className="text-3xl font-bold text-yellow-900">{nearlyEligibleCount}</p>
                    <p className="text-yellow-700">Nearly Eligible Schemes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible Schemes */}
            {eligibleSchemes.filter((s) => s.eligibilityStatus === 'eligible').length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ You're Eligible - Apply Now!</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {eligibleSchemes
                    .filter((s) => s.eligibilityStatus === 'eligible')
                    .map((scheme) => (
                      <SchemeCard key={scheme.id} scheme={scheme} profile={profile} />
                    ))}
                </div>
              </div>
            )}

            {/* Nearly Eligible Schemes */}
            {eligibleSchemes.filter((s) => s.eligibilityStatus === 'nearly-eligible').length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Nearly Eligible - 1 Condition Missing</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {eligibleSchemes
                    .filter((s) => s.eligibilityStatus === 'nearly-eligible')
                    .map((scheme) => (
                      <SchemeCard key={scheme.id} scheme={scheme} profile={profile} />
                    ))}
                </div>
              </div>
            )}

            {eligibleSchemes.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Schemes Found</h3>
                <p className="text-gray-600 mb-4">
                  Based on your current profile, no schemes match your eligibility criteria.
                </p>
                <Button onClick={handleEditProfile}>Update Profile</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
