"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Zap, Droplet, Flame, CheckCircle, Loader2, CreditCard, Download, ArrowLeft } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

type Step = 'service-select' | 'consumer-number' | 'bill-display' | 'payment' | 'success'
type ServiceType = 'electricity' | 'water' | 'gas' | null

export default function BillPaymentAssistance() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('service-select')
  const [selectedService, setSelectedService] = useState<ServiceType>(null)
  const [consumerNumber, setConsumerNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const billData = {
    electricity: { amount: 842, dueDate: '28 March 2026', provider: 'State Electricity Board' },
    water: { amount: 320, dueDate: '30 March 2026', provider: 'Municipal Water Supply' },
    gas: { amount: 1250, dueDate: '25 March 2026', provider: 'City Gas Distribution' }
  }

  const serviceInfo = {
    electricity: { icon: Zap, title: 'बिजली बिल', subtitle: 'Electricity Bill', color: 'bg-yellow-50 text-yellow-600' },
    water: { icon: Droplet, title: 'पानी बिल', subtitle: 'Water Bill', color: 'bg-blue-50 text-blue-600' },
    gas: { icon: Flame, title: 'गैस बिल', subtitle: 'Gas / PNG Bill', color: 'bg-orange-50 text-orange-600' }
  }

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
    setStep('consumer-number')
  }

  const handleFetchBill = () => {
    if (consumerNumber.length < 10) {
      alert('कृपया 10 अंकों का Consumer Number डालिए।')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('bill-display')
    }, 1500)
  }

  const handlePayment = () => {
    setStep('payment')
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setStep('success')
    }, 2500)
  }

  const resetFlow = () => {
    setStep('service-select')
    setSelectedService(null)
    setConsumerNumber('')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/citizen-services')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Services</span>
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Bill Payment</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Pay your electricity, water, and gas bills online
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Service Selection */}
          {step === 'service-select' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Select Bill Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(serviceInfo).map(([key, info]) => {
                  const Icon = info.icon
                  return (
                    <Card 
                      key={key}
                      className="border-2 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleServiceSelect(key as ServiceType)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-4`}>
                          <Icon size={32} strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-sm text-gray-600">{info.subtitle}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Consumer Number Input */}
          {step === 'consumer-number' && selectedService && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Enter Consumer Number</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="consumer-number" className="text-lg">Consumer Number</Label>
                    <Input
                      id="consumer-number"
                      type="text"
                      placeholder="1234567890"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="text-lg h-12"
                      maxLength={10}
                    />
                    <p className="text-sm text-gray-600">
                      Enter your 10-digit consumer number from your bill
                    </p>
                  </div>

                  <Button
                    onClick={handleFetchBill}
                    disabled={consumerNumber.length < 10 || isLoading}
                    className="w-full h-12 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Fetching Bill...
                      </>
                    ) : (
                      'Fetch Bill'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Display */}
          {step === 'bill-display' && selectedService && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Bill Details</CardTitle>
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-semibold">{billData[selectedService].provider}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Consumer Number:</span>
                    <span className="font-semibold">{consumerNumber}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-gray-700">Bill Amount:</span>
                      <span className="text-3xl font-bold text-green-600">₹{billData[selectedService].amount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-red-600">{billData[selectedService].dueDate}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="mr-2" size={20} />
                  Pay ₹{billData[selectedService].amount}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Processing */}
          {step === 'payment' && (
            <Card className="border-2">
              <CardContent className="p-12 text-center space-y-6">
                <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Processing Payment...</h2>
                <p className="text-gray-600">Please wait while we process your payment</p>
              </CardContent>
            </Card>
          )}

          {/* Success */}
          {step === 'success' && selectedService && (
            <Card className="border-2">
              <CardContent className="p-8 space-y-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="text-lg text-gray-600">Your payment of ₹{billData[selectedService].amount} has been processed</p>

                <div className="bg-gray-50 rounded-xl p-6 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono font-semibold">TXN{Date.now().toString().slice(-10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold">{new Date().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-green-600">₹{billData[selectedService].amount}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2" size={18} />
                    Download Receipt
                  </Button>
                  <Button onClick={resetFlow} className="flex-1">
                    Pay Another Bill
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
