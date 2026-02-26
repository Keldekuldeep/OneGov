"use client"

import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, CheckCircle, Loader2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  processVoiceInput,
  ComplaintData,
  languages,
  samplePhrases,
} from '@/lib/voiceAssistant'

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN')
  const [isProcessing, setIsProcessing] = useState(false)
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState('')
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        
        recognitionInstance.onresult = (event: any) => {
          const text = event.results[0][0].transcript
          setTranscript(text)
          setIsListening(false)
          handleProcessSpeech(text)
        }

        recognitionInstance.onerror = () => {
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const startListening = () => {
    if (recognition) {
      recognition.lang = selectedLanguage
      recognition.start()
      setIsListening(true)
      setTranscript('')
      setComplaintData(null)
      setShowConfirmation(false)
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const handleProcessSpeech = async (text: string) => {
    setIsProcessing(true)
    
    // Simulate NLP processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const data = processVoiceInput(text, selectedLanguage)
    setComplaintData(data)
    setIsProcessing(false)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setSubmitted(true)
    const id = `VOICE-${Date.now()}`
    setComplaintId(id)
  }

  const handleReset = () => {
    setTranscript('')
    setComplaintData(null)
    setShowConfirmation(false)
    setSubmitted(false)
    setComplaintId('')
  }

  const useSamplePhrase = (phrase: string) => {
    setTranscript(phrase)
    handleProcessSpeech(phrase)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">शिकायत दर्ज हो गई!</h2>
          <p className="text-gray-600 mb-6">Complaint Registered Successfully!</p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">शिकायत संख्या / Complaint ID:</p>
            <p className="text-2xl font-bold text-blue-900 font-mono">{complaintId}</p>
          </div>

          {complaintData && (
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">विभाग / Department:</span>
                <span className="font-semibold">{complaintData.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">जिम्मेदार अधिकारी / Officer:</span>
                <span className="font-semibold">{complaintData.assignedOfficer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">अनुमानित समय / Expected:</span>
                <span className="font-semibold">{complaintData.expectedResolution}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleReset} className="w-full bg-[#2c5282] hover:bg-[#1e3a5f]">
              नई शिकायत दर्ज करें / New Complaint
            </Button>
            <Button
              onClick={() => window.location.href = '/track-complaint'}
              variant="outline"
              className="w-full"
            >
              शिकायत ट्रैक करें / Track Complaint
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle size={40} />
            <h1 className="text-4xl font-bold">Voice Assistant</h1>
          </div>
          <p className="text-blue-100 text-lg">
            बोलकर शिकायत दर्ज करें • Speak to file complaint • Multilingual support
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Language Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              अपनी भाषा चुनें / Select Your Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voice Input */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="mb-6">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <MicOff className="text-white" size={48} />
                  ) : (
                    <Mic className="text-white" size={48} />
                  )}
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isListening ? 'सुन रहे हैं... / Listening...' : 'माइक दबाएं / Tap to Speak'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {isListening
                  ? 'अपनी शिकायत बोलें / Speak your complaint'
                  : 'अपनी भाषा में बोलें / Speak in your language'}
              </p>

              {!recognition && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sample Phrases */}
          {!transcript && !isProcessing && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-blue-900 mb-3">उदाहरण / Sample Phrases:</h4>
              <div className="space-y-2">
                {samplePhrases[selectedLanguage]?.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => useSamplePhrase(phrase)}
                    className="w-full text-left p-3 bg-white rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Volume2 size={16} className="inline mr-2 text-blue-600" />
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">आपने कहा / You said:</h4>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-lg text-gray-800">{transcript}</p>
              </div>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                <h4 className="font-bold text-gray-900 mb-2">समझ रहे हैं... / Processing...</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ भाषा पहचान / Language detection</p>
                  <p>✓ शिकायत विश्लेषण / Complaint analysis</p>
                  <p>✓ विभाग चयन / Department selection</p>
                </div>
              </div>
            </div>
          )}

          {/* Auto-Generated Form */}
          {showConfirmation && complaintData && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">
                शिकायत विवरण / Complaint Details
              </h4>
              
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-semibold text-green-900">स्वचालित रूप से भरा गया / Auto-Filled</span>
                  </div>
                  
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">समस्या / Problem:</span>
                      <span className="font-semibold text-gray-900">{complaintData.problem}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">विभाग / Department:</span>
                      <span className="font-semibold text-gray-900">{complaintData.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">श्रेणी / Category:</span>
                      <span className="font-semibold text-gray-900">{complaintData.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">प्राथमिकता / Priority:</span>
                      <span className={`font-semibold px-2 py-1 rounded text-xs ${
                        complaintData.priority === 'High' ? 'bg-red-100 text-red-800' :
                        complaintData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaintData.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">जिम्मेदार अधिकारी / Officer:</span>
                      <span className="font-semibold text-gray-900">{complaintData.assignedOfficer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">अनुमानित समाधान / Expected:</span>
                      <span className="font-semibold text-gray-900">{complaintData.expectedResolution}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">पुष्टि करें / Confirm:</span> क्या आप यह शिकायत दर्ज करना चाहते हैं?
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    रद्द करें / Cancel
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
                    पुष्टि करें / Confirm
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">🎤 कैसे उपयोग करें / How to Use:</h4>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>✓ अपनी भाषा चुनें / Select your language</li>
              <li>✓ माइक बटन दबाएं / Tap the mic button</li>
              <li>✓ अपनी शिकायत बोलें / Speak your complaint</li>
              <li>✓ सिस्टम स्वचालित रूप से समझेगा / System will understand automatically</li>
              <li>✓ विवरण की पुष्टि करें / Confirm the details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
