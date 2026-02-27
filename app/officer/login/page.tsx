"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginOfficer, isOfficerLoggedIn, demoOfficers, DEMO_PASSWORD } from '@/lib/officerAuth'
import { authAPI } from '@/lib/api'

export default function OfficerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Redirect if already logged in
    if (isOfficerLoggedIn()) {
      router.push('/officer/dashboard')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Call backend API
      const response = await authAPI.officerLogin(email, password)
      
      if (response.token && response.officer) {
        console.log('✅ Officer logged in:', response.officer)
        router.push('/officer/dashboard')
      } else {
        setError('Login failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (officerEmail: string) => {
    setEmail(officerEmail)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={48} className="text-blue-300" />
            <div>
              <h1 className="text-4xl font-bold">OneGov Portal</h1>
              <p className="text-blue-200">Officer Management System</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Access</h3>
                <p className="text-blue-200 text-sm">Role-based authentication for government officers</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Process Applications</h3>
                <p className="text-blue-200 text-sm">Manage citizen applications efficiently</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-time Updates</h3>
                <p className="text-blue-200 text-sm">Track and update application status instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Officer Login</h2>
            <p className="text-gray-600">Sign in to access the officer portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@gov.in"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 font-semibold">Demo Officer Accounts:</p>
            <div className="space-y-2">
              {demoOfficers.map((officer) => (
                <button
                  key={officer.id}
                  onClick={() => fillDemoCredentials(officer.email)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{officer.name}</p>
                      <p className="text-xs text-gray-600">{officer.designation}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {officer.department}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Password for all demo accounts: <code className="bg-gray-100 px-2 py-1 rounded">{DEMO_PASSWORD}</code>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700">
              ← Back to Citizen Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
