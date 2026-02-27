// Gemini AI Integration for OneGov Portal
// This provides intelligent, context-aware assistance

interface GeminiResponse {
  text: string
  suggestions?: string[]
}

// System context about the OneGov portal
const SYSTEM_CONTEXT = `
You are an AI assistant for OneGov Portal - a government services platform in India.

Available Services:
1. Health Services: Birth Certificate, Death Certificate, Health Card, Vaccination Certificate
2. Education Services: School Admission, Scholarship, Transfer Certificate
3. Revenue Services: Income Certificate, Caste Certificate, Domicile Certificate, Land Records
4. Transport Services: Driving License, Learner's License, Vehicle Registration, Road Tax
5. Utility Services: Electricity Connection, Water Connection, Ration Card, Pension
6. Bill Payment: Pay electricity, water, and gas bills
7. Complaint System: File and track complaints
8. Application Tracking: Track service applications

User Roles:
- Citizens: Can apply for services, pay bills, file complaints
- Officers: Can process applications, handle complaints
- Admins: Can manage officers, citizens, and system

Your job:
- Help users navigate to the right service
- Explain processes in simple Hindi/English
- Provide step-by-step guidance
- Answer questions about documents, fees, timelines
- Be friendly, helpful, and concise

Always respond in a mix of Hindi and English (Hinglish) for better understanding.
Keep responses short (2-3 sentences max) unless explaining a process.
`

// Mock Gemini API call (replace with actual API when key is available)
export async function getGeminiResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[],
  currentPage?: string
): Promise<GeminiResponse> {
  
  // For now, using intelligent pattern matching
  // TODO: Replace with actual Gemini API call when API key is available
  
  const message = userMessage.toLowerCase()
  
  // Context-aware responses based on current page
  const pageContext = currentPage ? `User is currently on: ${currentPage}` : ''
  
  // Intelligent response generation
  if (message.includes('birth') || message.includes('जन्म')) {
    return {
      text: 'Birth Certificate के लिए Health Services में जाएं। Documents चाहिए: Hospital certificate, Parents Aadhaar, Address proof। Processing time: 7-10 days।',
      suggestions: ['Health Services खोलें', 'Documents की list', 'Fees कितनी है?']
    }
  }
  
  if (message.includes('driving') || message.includes('ड्राइविंग')) {
    return {
      text: 'Driving License के लिए Transport Services में apply करें। Pehle Learner\'s License लेना होगा, फिर 30 days बाद permanent license। Fees: ₹200-500।',
      suggestions: ['Transport Services खोलें', 'Eligibility क्या है?', 'Test कैसे होता है?']
    }
  }
  
  if (message.includes('bill') || message.includes('बिल')) {
    return {
      text: 'Bill Payment section में जाकर बिजली, पानी या गैस का बिल भर सकते हैं। Consumer number डालें और instant payment करें।',
      suggestions: ['Bill Payment खोलें', 'Consumer number कहाँ मिलेगा?', 'Safe है?']
    }
  }
  
  if (message.includes('complaint') || message.includes('शिकायत')) {
    return {
      text: 'Complaint दर्ज करने के लिए File Complaint page पर जाएं। Details भरें, documents attach करें। Complaint number मिलेगा जिससे track कर सकते हैं।',
      suggestions: ['Complaint Page खोलें', 'क्या जानकारी चाहिए?', 'कितना समय लगेगा?']
    }
  }
  
  if (message.includes('track') || message.includes('ट्रैक')) {
    return {
      text: 'Application track करने के लिए Track Application page पर जाएं। Application number डालें और real-time status देखें।',
      suggestions: ['Track Application खोलें', 'Application number कहाँ मिलेगा?']
    }
  }
  
  if (message.includes('document') || message.includes('दस्तावेज़')) {
    return {
      text: 'आमतौर पर चाहिए: Aadhaar Card, Address Proof, Passport Photo, Mobile Number। Specific service के लिए अलग documents हो सकते हैं।',
      suggestions: ['Birth Certificate documents', 'Driving License documents', 'Income Certificate documents']
    }
  }
  
  if (message.includes('fees') || message.includes('शुल्क') || message.includes('cost')) {
    return {
      text: 'Fees service के अनुसार: Certificates ₹50-100, Driving License ₹200-500, Bills instant payment। Exact fees service select करने पर दिखेगी।',
      suggestions: ['Birth Certificate fees', 'Driving License fees', 'Bill Payment charges']
    }
  }
  
  if (message.includes('time') || message.includes('समय') || message.includes('कितना')) {
    return {
      text: 'Processing time: Certificates 7-15 days, Licenses 15-30 days, Bills instant। Application submit करने के बाद track कर सकते हैं।',
      suggestions: ['Fast track option है?', 'Status कैसे check करें?']
    }
  }
  
  if (message.includes('income') || message.includes('आय')) {
    return {
      text: 'Income Certificate के लिए Revenue Services में apply करें। Documents: Salary slip/Income proof, Aadhaar, Address proof। Fees: ₹50, Time: 10-15 days।',
      suggestions: ['Revenue Services खोलें', 'Documents list', 'Online apply कर सकते हैं?']
    }
  }
  
  if (message.includes('ration') || message.includes('राशन')) {
    return {
      text: 'Ration Card के लिए Utility Services में apply करें। Family details, Income proof, Address proof चाहिए। Processing: 30 days।',
      suggestions: ['Utility Services खोलें', 'Eligibility criteria', 'Types of ration cards']
    }
  }
  
  if (message.includes('scholarship') || message.includes('छात्रवृत्ति')) {
    return {
      text: 'Scholarship के लिए Education Services में apply करें। Marksheet, Income certificate, Bank details चाहिए। Multiple schemes available हैं।',
      suggestions: ['Education Services खोलें', 'Eligibility', 'Amount कितनी मिलती है?']
    }
  }
  
  if (message.includes('help') || message.includes('मदद') || message.includes('guide')) {
    return {
      text: 'मैं आपकी पूरी मदद करूंगा! आप किसी भी service के बारे में पूछ सकते हैं - documents, fees, process, timeline। बस बताइए क्या चाहिए?',
      suggestions: ['सभी services दिखाओ', 'Popular services', 'कैसे शुरू करें?']
    }
  }
  
  // Default intelligent response
  return {
    text: 'मुझे समझ नहीं आया। क्या आप यह जानना चाहते हैं:\n• कोई certificate चाहिए?\n• Bill payment करना है?\n• Complaint दर्ज करनी है?\n• Application track करना है?',
    suggestions: ['Birth Certificate', 'Bill Payment', 'Driving License', 'Complaint', 'Track Application']
  }
}

// Function to integrate actual Gemini API (when API key is available)
export async function callGeminiAPI(
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_CONTEXT}\n\nUser: ${prompt}\n\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      }
    )
    
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API Error:', error)
    return 'Sorry, I encountered an error. Please try again.'
  }
}

// Export for use in components
export { SYSTEM_CONTEXT }
