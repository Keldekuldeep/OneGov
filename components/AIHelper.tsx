"use client"

import { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Message {
  type: 'bot' | 'user'
  text: string
  suggestions?: string[]
}

interface AIHelperProps {
  onNavigate?: (path: string) => void
}

export default function AIHelper({ onNavigate }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Welcome message after 2 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true)
        addBotMessage(
          'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ। आप क्या करना चाहते हैं?',
          [
            'Birth Certificate चाहिए',
            'Driving License के लिए apply करना है',
            'Bill Payment करना है',
            'Complaint दर्ज करनी है',
            'Application Track करना है'
          ]
        )
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const addBotMessage = (text: string, suggestions?: string[]) => {
    setMessages(prev => [...prev, { type: 'bot', text, suggestions }])
  }

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { type: 'user', text }])
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleUserInput(suggestion)
  }

  const handleUserInput = async (userInput: string) => {
    const input = userInput.toLowerCase()
    addUserMessage(userInput)
    setInput('')

    // Try Gemini AI first, fallback to pattern matching
    try {
      // Check if Gemini API key is available (from environment variable)
      const apiKey = typeof window !== 'undefined' ? 
        (window as any).NEXT_PUBLIC_GEMINI_API_KEY || 
        'AIzaSyCEAn4pdfBW5Lkd5M8OaLU4ptjB1kXuKog' : 
        'AIzaSyCEAn4pdfBW5Lkd5M8OaLU4ptjB1kXuKog'
      
      if (apiKey) {
        console.log('🤖 Trying Gemini AI...')
        // Use real Gemini AI
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an AI assistant for OneGov Portal - a government services platform in India.

Available Services: Health (Birth/Death Certificate), Education (Scholarship), Revenue (Income/Caste Certificate), Transport (Driving License), Utility (Ration Card), Bill Payment, Complaints, Application Tracking.

User asked: "${userInput}"

Respond in simple Hindi/English mix (Hinglish). Keep it short (2-3 sentences). Be helpful and friendly. If they want to navigate, suggest the service name.`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150,
              }
            })
          }
        )
        
        const data = await response.json()
        console.log('✅ Gemini Response:', data)
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (aiText) {
          addBotMessage(aiText)
          return
        }
      } else {
        console.log('⚠️ No API key found, using fallback')
      }
    } catch (error) {
      console.log('❌ Gemini API error, using fallback:', error)
    }

    // Fallback to pattern matching
    console.log('📝 Using pattern matching fallback')
    setTimeout(() => {
      // Check for specific service names in suggestions
      if (input === 'birth certificate चाहिए' || input === 'birth certificate') {
        addBotMessage(
          'Birth Certificate के लिए आपको Health Services में जाना होगा। मैं आपको वहाँ ले जाता हूँ।',
          ['हाँ, ले चलो', 'Documents क्या चाहिए?', 'कितना समय लगेगा?']
        )
      } else if (input === 'driving license के लिए apply करना है' || input === 'driving license') {
        addBotMessage(
          'Driving License के लिए Transport Services में apply कर सकते हैं।',
          ['Transport Services खोलें', 'Eligibility क्या है?', 'Fees कितनी है?']
        )
      } else if (input === 'bill payment करना है' || input === 'bill payment') {
        addBotMessage(
          'Bill Payment के लिए मैं आपको Bill Payment section में ले जाता हूँ। वहाँ आप बिजली, पानी और गैस का बिल भर सकते हैं।',
          ['Bill Payment खोलें', 'कैसे भरें?']
        )
      } else if (input === 'complaint दर्ज करनी है' || input === 'complaint') {
        addBotMessage(
          'Complaint दर्ज करने के लिए File Complaint section में जाएं।',
          ['Complaint Page खोलें', 'क्या जानकारी चाहिए?']
        )
      } else if (input === 'application track करना है' || input === 'track application') {
        addBotMessage(
          'Application track करने के लिए Track Application page पर जाएं। वहाँ आप अपना Application Number डालकर status देख सकते हैं।',
          ['Track Application खोलें']
        )
      } else if (input.includes('birth') || input.includes('जन्म')) {
        addBotMessage(
          'Birth Certificate के लिए आपको Health Services में जाना होगा। मैं आपको वहाँ ले जाता हूँ।',
          ['हाँ, ले चलो', 'Documents क्या चाहिए?', 'कितना समय लगेगा?']
        )
      } else if (input.includes('death') || input.includes('मृत्यु')) {
        addBotMessage(
          'Death Certificate के लिए Health Services section में जाएं।',
          ['Health Services खोलें', 'Documents बताओ']
        )
      } else if (input.includes('driving') || input.includes('ड्राइविंग')) {
        addBotMessage(
          'Driving License के लिए Transport Services में apply कर सकते हैं।',
          ['Transport Services खोलें', 'Eligibility क्या है?', 'Fees कितनी है?']
        )
      } else if (input.includes('bill') || input.includes('बिल')) {
        addBotMessage(
          'Bill Payment के लिए मैं आपको Bill Payment section में ले जाता हूँ। वहाँ आप बिजली, पानी और गैस का बिल भर सकते हैं।',
          ['Bill Payment खोलें', 'कैसे भरें?']
        )
      } else if (input.includes('complaint') || input.includes('शिकायत')) {
        addBotMessage(
          'Complaint दर्ज करने के लिए File Complaint section में जाएं।',
          ['Complaint Page खोलें', 'क्या जानकारी चाहिए?']
        )
      } else if (input.includes('track') || input.includes('ट्रैक')) {
        addBotMessage(
          'Application track करने के लिए Track Application page पर जाएं। वहाँ आप अपना Application Number डालकर status देख सकते हैं।',
          ['Track Application खोलें']
        )
      } else if (input.includes('income') || input.includes('आय')) {
        addBotMessage(
          'Income Certificate के लिए Revenue Services में apply करें।',
          ['Revenue Services खोलें', 'Documents list']
        )
      } else if (input.includes('caste') || input.includes('जाति')) {
        addBotMessage(
          'Caste Certificate के लिए Revenue Services section में जाएं।',
          ['Revenue Services खोलें']
        )
      } else if (input.includes('ration') || input.includes('राशन')) {
        addBotMessage(
          'Ration Card के लिए Utility Services में apply कर सकते हैं।',
          ['Utility Services खोलें', 'Eligibility']
        )
      } else if (input.includes('scholarship') || input.includes('छात्रवृत्ति')) {
        addBotMessage(
          'Scholarship के लिए Education Services में apply करें।',
          ['Education Services खोलें', 'कौन apply कर सकता है?']
        )
      } else if (input.includes('document') || input.includes('दस्तावेज़')) {
        addBotMessage(
          'आमतौर पर चाहिए:\n• Aadhaar Card\n• Address Proof\n• Passport Size Photo\n• Mobile Number\n\nकिस service के लिए documents चाहिए?',
          ['Birth Certificate', 'Driving License', 'Income Certificate']
        )
      } else if (input.includes('time') || input.includes('समय') || input.includes('कितना')) {
        addBotMessage(
          'Processing time service के हिसाब से अलग होता है:\n• Certificates: 7-15 days\n• Licenses: 15-30 days\n• Bills: Instant\n\nकिस service के बारे में जानना है?'
        )
      } else if (input.includes('fees') || input.includes('शुल्क')) {
        addBotMessage(
          'Fees service के अनुसार:\n• Birth/Death Certificate: ₹50-100\n• Driving License: ₹200-500\n• Income Certificate: ₹50\n\nकिस service की fees जाननी है?'
        )
      } else if (input.includes('हाँ') || input.includes('yes') || input.includes('खोलें') || input.includes('open')) {
        // Navigate based on previous context
        const lastBotMsg = messages[messages.length - 1]?.text.toLowerCase()
        
        if (lastBotMsg?.includes('birth')) {
          onNavigate?.('/services/health/birth-certificate')
          addBotMessage('आपको Birth Certificate page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('death')) {
          onNavigate?.('/services/health/death-certificate')
          addBotMessage('आपको Death Certificate page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('driving')) {
          onNavigate?.('/services/transport/driving-license')
          addBotMessage('आपको Driving License page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('bill') || lastBotMsg?.includes('बिल')) {
          onNavigate?.('/bill-payment')
          addBotMessage('आपको Bill Payment page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('complaint')) {
          onNavigate?.('/file-complaint')
          addBotMessage('आपको Complaint page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('track')) {
          onNavigate?.('/track-application')
          addBotMessage('आपको Track Application page पर ले जा रहा हूँ...')
        } else if (lastBotMsg?.includes('revenue')) {
          addBotMessage('Revenue Services में कौन सा certificate चाहिए?', [
            'Income Certificate',
            'Caste Certificate',
            'Domicile Certificate'
          ])
        } else if (lastBotMsg?.includes('education')) {
          addBotMessage('Education Services में क्या चाहिए?', [
            'Scholarship',
            'School Admission',
            'Transfer Certificate'
          ])
        }
      } else if (input.includes('कैसे') || input.includes('how') || input.includes('process') || input.includes('steps')) {
        // Explain process
        const lastBotMsg = messages[messages.length - 1]?.text.toLowerCase()
        
        if (lastBotMsg?.includes('bill') || lastBotMsg?.includes('बिल')) {
          addBotMessage(
            'Bill Payment करने के steps:\n\n1. Service select करें (बिजली/पानी/गैस)\n2. Consumer Number डालें (10 अंक)\n3. "Fetch Bill" दबाएं\n4. Bill details check करें\n5. "Pay" button दबाएं\n6. Payment complete!\n\nक्या अब Bill Payment page खोलूं?',
            ['हाँ, खोलें', 'और जानकारी चाहिए']
          )
        } else if (lastBotMsg?.includes('birth')) {
          addBotMessage(
            'Birth Certificate के लिए:\n\n1. Form भरें\n2. Documents upload करें:\n   • Hospital Certificate\n   • Parents Aadhaar\n   • Address Proof\n3. Submit करें\n4. 7-10 days में certificate मिलेगा\n\nक्या अब form खोलूं?',
            ['हाँ, खोलें', 'Documents के बारे में']
          )
        } else {
          addBotMessage(
            'किस service के बारे में जानना है?',
            ['Birth Certificate', 'Bill Payment', 'Driving License', 'Complaint']
          )
        }
      } else if (input.includes('और') || input.includes('more') || input.includes('detail')) {
        addBotMessage(
          'मैं आपकी और मदद कर सकता हूँ। क्या जानना चाहते हैं?',
          ['Documents list', 'Processing time', 'Fees', 'Eligibility']
        )
      } else {
        addBotMessage(
          'मुझे समझ नहीं आया। कृपया फिर से बताएं या नीचे दिए गए options में से चुनें:',
          [
            'Birth Certificate',
            'Driving License',
            'Bill Payment',
            'Complaint',
            'Track Application'
          ]
        )
      }
    }, 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleUserInput(input)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 animate-bounce"
      >
        <Bot size={28} />
      </button>
    )
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50"
      >
        <Bot size={28} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold">AI सहायक</h3>
            <p className="text-xs text-white/80">हमेशा आपकी मदद के लिए</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-3 shadow-sm`}>
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              {msg.suggestions && (
                <div className="mt-3 space-y-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना सवाल पूछें..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  )
}
