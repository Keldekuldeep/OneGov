"use client"

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bot, X, Send, Minimize2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Message {
  type: 'bot' | 'user'
  text: string
  suggestions?: string[]
}

export default function GlobalAIHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message on first load
  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        addBotMessage(
          'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ। आप क्या करना चाहते हैं?',
          [
            'Birth Certificate चाहिए',
            'Driving License apply करना है',
            'Bill Payment करना है',
            'Complaint दर्ज करनी है',
            'Application Track करना है'
          ]
        )
        setHasGreeted(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasGreeted])

  // Page-specific guidance when navigating
  useEffect(() => {
    if (hasGreeted && pathname) {
      providePageGuidance(pathname)
    }
  }, [pathname, hasGreeted])

  const providePageGuidance = (path: string) => {
    // Only provide guidance if AI is open and user has navigated
    if (!isOpen || messages.length === 0) return

    setTimeout(() => {
      if (path.includes('/birth-certificate')) {
        addBotMessage(
          '✅ आप Birth Certificate page पर हैं!\n\nयहाँ करना है:\n1. Form में details भरें\n2. Documents upload करें\n3. Submit करें\n\nक्या मदद चाहिए?',
          ['Documents क्या चाहिए?', 'Fees कितनी है?', 'कितना समय लगेगा?']
        )
      } else if (path.includes('/death-certificate')) {
        addBotMessage(
          '✅ आप Death Certificate page पर हैं!\n\nजरूरी documents:\n• Death report\n• Deceased Aadhaar\n• Applicant ID proof\n\nकोई सवाल?',
          ['Form कैसे भरें?', 'Processing time?', 'Fees?']
        )
      } else if (path.includes('/driving-license')) {
        addBotMessage(
          '✅ आप Driving License page पर हैं!\n\nध्यान दें:\n• पहले Learner\'s License चाहिए\n• Age: 18+ years\n• Medical certificate जरूरी\n\nमदद चाहिए?',
          ['Eligibility क्या है?', 'Documents list', 'Test कैसे होता है?']
        )
      } else if (path.includes('/bill-payment')) {
        addBotMessage(
          '✅ आप Bill Payment page पर हैं!\n\nStep-by-step:\n1. Service चुनें (बिजली/पानी/गैस)\n2. Consumer number डालें\n3. Bill fetch करें\n4. Pay करें\n\nशुरू करें?',
          ['Consumer number कहाँ है?', 'Safe है?', 'Receipt मिलेगी?']
        )
      } else if (path.includes('/income-certificate')) {
        addBotMessage(
          '✅ आप Income Certificate page पर हैं!\n\nDocuments:\n• Salary slip/Income proof\n• Aadhaar card\n• Address proof\n\nFees: ₹50 | Time: 10-15 days',
          ['Form भरने में मदद', 'Eligibility', 'Online submit?']
        )
      } else if (path.includes('/scholarship')) {
        addBotMessage(
          '✅ आप Scholarship page पर हैं!\n\nजरूरी:\n• Marksheet (60%+)\n• Income certificate\n• Bank details\n\nकई schemes available हैं!',
          ['Eligibility check करें', 'Amount कितनी?', 'Documents']
        )
      } else if (path.includes('/file-complaint')) {
        addBotMessage(
          '✅ आप Complaint page पर हैं!\n\nComplaint दर्ज करने के लिए:\n1. Category चुनें\n2. Details लिखें\n3. Documents attach करें\n4. Submit करें\n\nComplaint number मिलेगा!',
          ['Categories क्या हैं?', 'कितना समय लगेगा?', 'Track कैसे करें?']
        )
      } else if (path.includes('/track-application')) {
        addBotMessage(
          '✅ आप Track Application page पर हैं!\n\nApplication number डालें और real-time status देखें। SMS/Email से भी number मिला होगा।',
          ['Number कहाँ मिलेगा?', 'Status का मतलब?']
        )
      }
    }, 800)
  }

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

    // Track conversation context
    const conversationContext = messages.map(m => m.text.toLowerCase()).join(' ')

    setTimeout(() => {
      // Eligibility queries
      if (input.includes('eligibility') || input.includes('योग्यता') || input.includes('eligible')) {
        const currentPath = pathname || ''
        
        if (currentPath.includes('birth-certificate')) {
          addBotMessage(
            '📋 Birth Certificate Eligibility:\n\n✅ कोई भी apply कर सकता है:\n• Parents\n• Guardian\n• Family member\n\n✅ जरूरी:\n• Birth 21 days के अंदर register करें\n• Late registration के लिए affidavit चाहिए',
            ['Documents क्या चाहिए?', 'Fees?', 'Form भरें']
          )
        } else if (currentPath.includes('driving-license')) {
          addBotMessage(
            '📋 Driving License Eligibility:\n\n✅ Age:\n• 2-wheeler: 16+ years\n• 4-wheeler: 18+ years\n• Commercial: 20+ years\n\n✅ जरूरी:\n• Learner\'s License (पहले)\n• Medical fitness\n• Address proof',
            ['Learner\'s License कैसे?', 'Test details', 'Documents']
          )
        } else if (currentPath.includes('scholarship')) {
          addBotMessage(
            '📋 Scholarship Eligibility:\n\n✅ Academic:\n• Minimum 60% marks\n• Regular student\n\n✅ Financial:\n• Family income < ₹2.5 lakh/year\n\n✅ Documents:\n• Marksheet\n• Income certificate\n• Bank details',
            ['Apply करें', 'Amount कितनी?', 'Last date?']
          )
        } else if (currentPath.includes('income-certificate')) {
          addBotMessage(
            '📋 Income Certificate Eligibility:\n\n✅ कोई भी resident apply कर सकता है\n\n✅ Purpose:\n• Scholarship\n• Loan\n• Government schemes\n• Fee concession\n\n✅ Valid: 6 months',
            ['Documents?', 'Fees?', 'Apply करें']
          )
        } else if (currentPath.includes('ration-card')) {
          addBotMessage(
            '📋 Ration Card Eligibility:\n\n✅ Types:\n• APL: Income > ₹1 lakh\n• BPL: Income < ₹1 lakh\n• AAY: Poorest families\n\n✅ जरूरी:\n• Permanent address\n• Income proof\n• Family details',
            ['Documents?', 'Apply करें', 'Benefits?']
          )
        } else {
          addBotMessage(
            '📋 Eligibility किस service के लिए जानना है?\n\nमैं बता सकता हूँ:',
            ['Birth Certificate', 'Driving License', 'Scholarship', 'Income Certificate', 'Ration Card']
          )
        }
        return
      }

      // Documents queries
      if (input.includes('document') || input.includes('दस्तावेज़') || input.includes('papers')) {
        const currentPath = pathname || ''
        
        if (currentPath.includes('birth-certificate')) {
          addBotMessage(
            '📄 Birth Certificate Documents:\n\n✅ जरूरी:\n• Hospital birth certificate\n• Parents Aadhaar card\n• Parents marriage certificate\n• Address proof\n• Passport size photos\n\n💡 Tip: सभी documents की photocopy रखें',
            ['Form भरें', 'Fees?', 'कितना समय?']
          )
        } else if (currentPath.includes('driving-license')) {
          addBotMessage(
            '📄 Driving License Documents:\n\n✅ जरूरी:\n• Learner\'s License\n• Age proof (Aadhaar/Birth cert)\n• Address proof\n• Medical certificate\n• Passport photos (4)\n• Form 2 & 4\n\n💡 Original + 2 photocopies',
            ['Fees?', 'Test booking', 'Apply करें']
          )
        } else if (currentPath.includes('scholarship')) {
          addBotMessage(
            '📄 Scholarship Documents:\n\n✅ जरूरी:\n• Latest marksheet\n• Income certificate\n• Caste certificate (if applicable)\n• Bank passbook\n• Aadhaar card\n• Bonafide certificate\n\n💡 Self-attested copies',
            ['Eligibility?', 'Apply करें', 'Amount?']
          )
        } else {
          addBotMessage(
            '📄 Documents किस service के लिए चाहिए?\n\nबताइए:',
            ['Birth Certificate', 'Driving License', 'Scholarship', 'Income Certificate']
          )
        }
        return
      }

      // Fees queries
      if (input.includes('fees') || input.includes('शुल्क') || input.includes('cost') || input.includes('charge')) {
        const currentPath = pathname || ''
        const alreadySeenFees = conversationContext.includes('fees:') || conversationContext.includes('शुल्क')
        
        if (alreadySeenFees) {
          // User already saw fees, provide payment guidance
          addBotMessage(
            '💳 Payment कैसे करें:\n\n1️⃣ Form submit करने के बाद payment link मिलेगा\n\n2️⃣ Payment Method चुनें:\n• UPI (instant)\n• Card (Debit/Credit)\n• Net Banking\n• Wallets\n\n3️⃣ Payment Complete करें\n• OTP verify करें\n• Receipt save करें\n\n4️⃣ Confirmation:\n• SMS आएगा\n• Email confirmation\n• Application processing शुरू\n\n💡 Payment safe और secure है!',
            ['Payment safe है?', 'Refund policy?', 'Form भरें']
          )
          return
        }
        
        if (currentPath.includes('birth-certificate')) {
          addBotMessage(
            '💰 Birth Certificate Fees:\n\n• Within 21 days: FREE\n• After 21 days - 1 year: ₹50\n• After 1 year: ₹100\n• Duplicate copy: ₹50\n\n💳 Payment: Online/Offline',
            ['Apply करें', 'Documents?', 'Processing time?']
          )
        } else if (currentPath.includes('driving-license')) {
          addBotMessage(
            '💰 Driving License Fees:\n\n• Learner\'s License: ₹150\n• Permanent DL (2-wheeler): ₹200\n• Permanent DL (4-wheeler): ₹300\n• Test fees: ₹50\n• Smart card: ₹200\n\nTotal: ₹500-600 approx',
            ['Apply करें', 'Eligibility?', 'Documents?']
          )
        } else if (currentPath.includes('income-certificate')) {
          addBotMessage(
            '💰 Income Certificate Fees:\n\n• Application: ₹50\n• Duplicate: ₹30\n\n⏱️ Processing: 10-15 days\n✅ Valid: 6 months',
            ['Apply करें', 'Documents?', 'Eligibility?']
          )
        } else {
          addBotMessage(
            '💰 Fees किस service की जाननी है?',
            ['Birth Certificate', 'Driving License', 'Income Certificate', 'Scholarship']
          )
        }
        return
      }

      // Time/Duration queries
      if (input.includes('time') || input.includes('समय') || input.includes('कितना') || input.includes('duration')) {
        addBotMessage(
          '⏱️ Processing Time:\n\n• Birth/Death Certificate: 7-10 days\n• Income Certificate: 10-15 days\n• Driving License: 15-30 days\n• Scholarship: 30-60 days\n• Bill Payment: Instant\n• Ration Card: 30 days\n\n💡 Track करने के लिए application number use करें',
          ['Track Application', 'Fast track option?']
        )
        return
      }

      // Service-specific queries
      if (input.includes('birth') || input.includes('जन्म')) {
        addBotMessage(
          'Birth Certificate के लिए Health Services में जाएं।\n\n📋 Quick Info:\n• Fees: FREE (21 days में)\n• Time: 7-10 days\n• Documents: Hospital cert, Parents Aadhaar\n\nक्या page खोलूं?',
          ['हाँ, ले चलो', 'Documents detail', 'Eligibility']
        )
      } else if (input.includes('death') || input.includes('मृत्यु')) {
        addBotMessage(
          'Death Certificate के लिए Health Services में जाएं।\n\n📋 Quick Info:\n• Fees: ₹50\n• Time: 7-10 days\n• Documents: Death report, Deceased Aadhaar',
          ['Health Services खोलें', 'Documents detail']
        )
      } else if (input.includes('driving') || input.includes('ड्राइविंग') || input.includes('license')) {
        addBotMessage(
          'Driving License के लिए Transport Services में apply करें।\n\n📋 Quick Info:\n• Age: 18+ years\n• Fees: ₹500-600\n• Time: 15-30 days\n• पहले Learner\'s License जरूरी\n\nक्या page खोलूं?',
          ['हाँ, ले चलो', 'Eligibility detail', 'Documents']
        )
      } else if (input.includes('bill') || input.includes('बिल') || input.includes('payment')) {
        addBotMessage(
          'Bill Payment के लिए मैं आपको Bill Payment section में ले जाता हूँ।\n\n💡 यहाँ भर सकते हैं:\n• बिजली का बिल\n• पानी का बिल\n• गैस का बिल\n\nInstant payment!',
          ['हाँ, ले चलो', 'Safe है?', 'कैसे भरें?']
        )
      } else if (input.includes('complaint') || input.includes('शिकायत')) {
        addBotMessage(
          'Complaint दर्ज करने के लिए File Complaint page पर जाएं।\n\n📋 Process:\n1. Category चुनें\n2. Details भरें\n3. Documents attach करें\n4. Submit करें\n\nComplaint number मिलेगा!',
          ['हाँ, ले चलो', 'Categories?', 'Track कैसे?']
        )
      } else if (input.includes('track') || input.includes('ट्रैक') || input.includes('status')) {
        addBotMessage(
          'Application track करने के लिए Track Application page पर जाएं।\n\nApplication number डालें और real-time status देखें।',
          ['हाँ, ले चलो', 'Number कहाँ मिलेगा?']
        )
      } else if (input.includes('income') || input.includes('आय')) {
        addBotMessage(
          'Income Certificate के लिए Revenue Services में apply करें।\n\n📋 Quick Info:\n• Fees: ₹50\n• Time: 10-15 days\n• Valid: 6 months\n• Purpose: Scholarship, Loan, etc.',
          ['हाँ, ले चलो', 'Eligibility', 'Documents']
        )
      } else if (input.includes('scholarship') || input.includes('छात्रवृत्ति')) {
        addBotMessage(
          'Scholarship के लिए Education Services में apply करें।\n\n📋 Quick Info:\n• Eligibility: 60%+ marks\n• Income: < ₹2.5 lakh\n• Documents: Marksheet, Income cert\n• Multiple schemes available',
          ['हाँ, ले चलो', 'Eligibility detail', 'Amount?']
        )
      } else if (input.includes('ration') || input.includes('राशन')) {
        addBotMessage(
          'Ration Card के लिए Utility Services में apply करें।\n\n📋 Types:\n• APL Card\n• BPL Card\n• AAY Card\n\nIncome के हिसाब से मिलता है।',
          ['हाँ, ले चलो', 'Eligibility', 'Documents']
        )
      } else if (input.includes('हाँ') || input.includes('yes') || input.includes('ले चलो') || input.includes('खोलें') || input.includes('open')) {
        // Navigate based on previous context
        const lastBotMsg = messages[messages.length - 1]?.text.toLowerCase() || ''
        
        if (lastBotMsg.includes('birth')) {
          router.push('/services/health/birth-certificate')
          addBotMessage('✅ Birth Certificate page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('death')) {
          router.push('/services/health/death-certificate')
          addBotMessage('✅ Death Certificate page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('driving') || lastBotMsg.includes('license')) {
          router.push('/services/transport/driving-license')
          addBotMessage('✅ Driving License page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('bill') || lastBotMsg.includes('बिल')) {
          router.push('/bill-payment')
          addBotMessage('✅ Bill Payment page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('complaint')) {
          router.push('/file-complaint')
          addBotMessage('✅ Complaint page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('track')) {
          router.push('/track-application')
          addBotMessage('✅ Track Application page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('income')) {
          router.push('/services/revenue/income-certificate')
          addBotMessage('✅ Income Certificate page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('scholarship')) {
          router.push('/services/education/scholarship')
          addBotMessage('✅ Scholarship page खोल रहा हूँ...')
        } else if (lastBotMsg.includes('ration')) {
          router.push('/services/utility/ration-card')
          addBotMessage('✅ Ration Card page खोल रहा हूँ...')
        } else {
          addBotMessage('किस service के लिए page खोलना है?', [
            'Birth Certificate',
            'Driving License',
            'Bill Payment',
            'Scholarship'
          ])
        }
      } else if (input.includes('form') || input.includes('भरें') || input.includes('fill') || input.includes('apply करें')) {
        // Form filling guidance based on current page
        const currentPath = pathname || ''
        
        if (currentPath.includes('birth-certificate')) {
          // Check if user already saw documents and fees
          const alreadySeenDocs = conversationContext.includes('hospital birth certificate')
          const alreadySeenFees = conversationContext.includes('within 21 days: free')
          
          addBotMessage(
            '📝 Birth Certificate Form भरने के steps:\n\n1️⃣ Child Details:\n• नाम, जन्म तिथि, जन्म स्थान\n• लिंग, वजन\n\n2️⃣ Parents Details:\n• माता-पिता का नाम\n• Aadhaar number\n• पता\n\n3️⃣ Documents Upload:\n• Hospital certificate\n• Parents Aadhaar\n• Address proof\n\n4️⃣ Submit करें\n\n💡 सभी fields mandatory हैं!\n\nअब form भरना शुरू करें! 👇',
            alreadySeenDocs && alreadySeenFees 
              ? ['Form में कोई problem?', 'Submit के बाद क्या होगा?', 'Track कैसे करें?']
              : alreadySeenDocs
              ? ['Fees कितनी है?', 'Submit के बाद क्या होगा?', 'कोई doubt?']
              : ['Documents upload कैसे करें?', 'Fees?', 'कितना समय?']
          )
        } else if (currentPath.includes('driving-license')) {
          addBotMessage(
            '📝 Driving License Form भरने के steps:\n\n1️⃣ Personal Details:\n• नाम, DOB, Address\n• Aadhaar number\n\n2️⃣ License Type:\n• 2-wheeler / 4-wheeler\n• Commercial / Non-commercial\n\n3️⃣ Documents Upload:\n• Learner\'s License\n• Age proof\n• Address proof\n• Medical certificate\n\n4️⃣ Test Slot Book करें\n\n💡 Learner\'s License पहले जरूरी!',
            ['Learner\'s License कैसे?', 'Test booking', 'Fees?']
          )
        } else if (currentPath.includes('scholarship')) {
          addBotMessage(
            '📝 Scholarship Form भरने के steps:\n\n1️⃣ Student Details:\n• नाम, Class, School\n• Marks percentage\n\n2️⃣ Family Details:\n• Parents income\n• Category (if applicable)\n\n3️⃣ Bank Details:\n• Account number\n• IFSC code\n\n4️⃣ Documents Upload:\n• Marksheet\n• Income certificate\n• Bank passbook\n\n💡 60%+ marks जरूरी!',
            ['Eligibility check', 'Amount कितनी?', 'Last date?']
          )
        } else if (currentPath.includes('income-certificate')) {
          addBotMessage(
            '📝 Income Certificate Form भरने के steps:\n\n1️⃣ Personal Details:\n• नाम, पिता का नाम\n• Aadhaar, Mobile\n\n2️⃣ Income Details:\n• Occupation\n• Monthly/Annual income\n• Income source\n\n3️⃣ Documents Upload:\n• Salary slip / Income proof\n• Aadhaar card\n• Address proof\n\n4️⃣ Submit करें\n\nFees: ₹50 | Time: 10-15 days',
            ['Documents detail', 'Eligibility', 'Fees?']
          )
        } else if (currentPath.includes('bill-payment')) {
          addBotMessage(
            '📝 Bill Payment करने के steps:\n\n1️⃣ Service Select करें:\n• बिजली / पानी / गैस\n\n2️⃣ Consumer Number डालें:\n• 10 digit number\n• पुराने bill पर मिलेगा\n\n3️⃣ "Fetch Bill" दबाएं:\n• Bill amount दिखेगा\n• Due date check करें\n\n4️⃣ "Pay" करें:\n• UPI / Card / Net Banking\n\n5️⃣ Receipt Download करें\n\n💡 Consumer number सही डालें!',
            ['Consumer number कहाँ है?', 'Safe है?', 'Receipt?']
          )
        } else if (currentPath.includes('complaint')) {
          addBotMessage(
            '📝 Complaint Form भरने के steps:\n\n1️⃣ Category चुनें:\n• Service related\n• Officer behavior\n• Technical issue\n• Other\n\n2️⃣ Details लिखें:\n• क्या हुआ\n• कब हुआ\n• कहाँ हुआ\n\n3️⃣ Documents Attach करें:\n• Photos / Screenshots\n• Supporting documents\n\n4️⃣ Submit करें\n\n💡 Complaint number मिलेगा - save करें!',
            ['Track कैसे करें?', 'कितना समय?', 'Categories?']
          )
        } else {
          addBotMessage(
            '📝 Form भरने में मदद चाहिए?\n\nकिस service का form भरना है?',
            ['Birth Certificate', 'Driving License', 'Bill Payment', 'Scholarship', 'Income Certificate']
          )
        }
      } else if (input.includes('submit') || input.includes('के बाद') || input.includes('after submit')) {
        addBotMessage(
          '✅ Submit करने के बाद:\n\n1️⃣ Application Number मिलेगा\n• SMS और Email पर\n• Screen पर भी दिखेगा\n• इसे save करें!\n\n2️⃣ Payment करें (if applicable)\n• Online payment link\n• Fees के अनुसार\n\n3️⃣ Processing शुरू होगी\n• Officer को assign होगा\n• Documents verify होंगे\n\n4️⃣ Status Track करें\n• Application number से\n• Real-time updates\n\n⏱️ 7-10 days में certificate ready!',
          ['Application track कैसे करें?', 'Payment safe है?', 'Certificate कैसे मिलेगा?']
        )
      } else if (input.includes('problem') || input.includes('issue') || input.includes('error') || input.includes('गलती')) {
        addBotMessage(
          '🔧 Form में problem आ रही है?\n\nCommon issues:\n\n1️⃣ Documents upload नहीं हो रहे?\n• File size 2MB से कम करें\n• PDF या JPG format use करें\n• Internet connection check करें\n\n2️⃣ Form submit नहीं हो रहा?\n• सभी mandatory fields भरें\n• Red mark वाली fields check करें\n• Browser refresh करके try करें\n\n3️⃣ Payment fail हो गया?\n• Bank account में balance check करें\n• 30 minutes बाद retry करें\n• Different payment method try करें\n\nऔर मदद चाहिए?',
          ['Helpline number?', 'Officer से contact करें', 'Complaint करें']
        )
      } else if (input.includes('certificate') && (input.includes('मिलेगा') || input.includes('kaise') || input.includes('receive'))) {
        addBotMessage(
          '📄 Certificate कैसे मिलेगा:\n\n✅ Digital Certificate:\n• Email पर PDF\n• Portal से download\n• DigiLocker में auto-save\n\n✅ Physical Certificate:\n• Office से collect करें\n• या courier से मंगाएं (extra ₹50)\n\n✅ Verification:\n• QR code scan करें\n• Online verify करें\n• Government seal check करें\n\n💡 Digital certificate भी valid है!',
          ['DigiLocker क्या है?', 'Courier कैसे order करें?', 'Verify कैसे करें?']
        )
      } else if (input.includes('payment') && (input.includes('safe') || input.includes('secure') || input.includes('सुरक्षित'))) {
        addBotMessage(
          '🔒 Payment 100% Safe है!\n\n✅ Security Features:\n• Government portal - SSL encrypted\n• RBI approved payment gateway\n• No card details stored\n• OTP verification\n\n✅ Payment Options:\n• UPI (Google Pay, PhonePe, Paytm)\n• Debit/Credit Card\n• Net Banking\n• Wallets\n\n✅ Receipt:\n• Instant receipt\n• Email confirmation\n• Transaction ID\n\n💡 Refund policy: 7 days में auto-refund if application rejected',
          ['Refund कैसे मिलेगा?', 'Receipt download करें', 'Form भरें']
        )
      } else if (input.includes('track') && (input.includes('application') || input.includes('status') || input.includes('ट्रैक'))) {
        addBotMessage(
          '📍 Application Track करने के steps:\n\n1️⃣ Track Application page खोलें\n\n2️⃣ Application Number डालें\n• SMS/Email में मिला होगा\n• 12 digit number\n\n3️⃣ Mobile Number verify करें\n• OTP आएगा\n\n4️⃣ Status देखें:\n• ✅ Submitted\n• 🔄 Under Review\n• ✅ Approved\n• 📄 Ready for Download\n\nक्या Track Application page खोलूं?',
          ['हाँ, खोलें', 'Application number नहीं मिला', 'Status का मतलब?']
        )
      } else if (input.includes('doubt') || input.includes('confusion') || input.includes('समझ नहीं')) {
        addBotMessage(
          '🤔 कोई doubt है? मैं clear कर देता हूँ!\n\nआप पूछ सकते हैं:\n\n📋 Process के बारे में:\n• Form कैसे भरें?\n• Documents कौन से चाहिए?\n• Fees कितनी है?\n\n⏱️ Timeline के बारे में:\n• कितना समय लगेगा?\n• Fast track option है?\n\n📞 Support के बारे में:\n• Helpline number?\n• Officer से कैसे contact करें?\n\nबस पूछिए, मैं बताऊंगा!',
          ['Helpline number', 'Officer contact', 'Form guidance']
        )
      } else if (input.includes('upload') || input.includes('अपलोड') || input.includes('attach')) {
        addBotMessage(
          '📤 Documents Upload करने के steps:\n\n1️⃣ "Choose File" या "Upload" button दबाएं\n\n2️⃣ अपने device से file select करें:\n• PDF format best है\n• Image भी चलेगा (JPG/PNG)\n• Size: Max 2MB\n\n3️⃣ File name check करें\n\n4️⃣ "Upload" confirm करें\n\n💡 Tips:\n• Clear photo लें\n• सभी text readable हो\n• Original documents की scan/photo\n\nकोई और मदद?',
          ['Documents क्या चाहिए?', 'Size limit?', 'Format?']
        )
      } else if (input.includes('help') || input.includes('मदद') || input.includes('guide')) {
        addBotMessage(
          '🤝 मैं आपकी पूरी मदद करूंगा!\n\nआप पूछ सकते हैं:\n• किसी service के बारे में\n• Documents क्या चाहिए\n• Fees कितनी है\n• Eligibility क्या है\n• Processing time\n• Form कैसे भरें\n• Documents कैसे upload करें\n\nबस बताइए क्या चाहिए?',
          ['सभी services', 'Popular services', 'Bill Payment']
        )
      } else {
        addBotMessage(
          'मुझे समझ नहीं आया। 😊\n\nक्या आप यह जानना चाहते हैं?',
          [
            'Form कैसे भरें?',
            'Documents क्या चाहिए?',
            'Fees कितनी है?',
            'Eligibility क्या है?',
            'Processing time?'
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

  // Don't show on login/register pages
  if (pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/admin') || pathname?.includes('/officer')) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all z-50 animate-bounce"
        title="AI सहायक - मदद के लिए क्लिक करें"
      >
        <Bot size={28} />
      </button>
    )
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all z-50"
        title="AI सहायक खोलें"
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
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold">AI सहायक</h3>
            <p className="text-xs text-white/80">हमेशा आपके साथ 🙏</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
            title="Minimize"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.type === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-white border-2 border-blue-100'} rounded-2xl p-3 shadow-md`}>
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              {msg.suggestions && (
                <div className="mt-3 space-y-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-medium px-3 py-2 rounded-lg transition-all hover:shadow-md"
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
      <form onSubmit={handleSubmit} className="p-4 border-t-2 border-blue-100 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना सवाल पूछें..."
            className="flex-1 border-2 border-blue-200 focus:border-blue-400"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Tip: "Eligibility", "Documents", "Fees" पूछ सकते हैं
        </p>
      </form>
    </div>
  )
}
