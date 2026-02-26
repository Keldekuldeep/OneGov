// Voice Assistant NLP Processing (Simulated)

export interface ComplaintData {
  problem: string
  department: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  assignedOfficer: string
  expectedResolution: string
  detectedLanguage: string
}

export const languages: Record<string, string> = {
  'hi-IN': 'हिंदी (Hindi)',
  'mr-IN': 'मराठी (Marathi)',
  'ta-IN': 'தமிழ் (Tamil)',
  'te-IN': 'తెలుగు (Telugu)',
  'bn-IN': 'বাংলা (Bengali)',
  'gu-IN': 'ગુજરાતી (Gujarati)',
  'kn-IN': 'ಕನ್ನಡ (Kannada)',
  'ml-IN': 'മലയാളം (Malayalam)',
  'pa-IN': 'ਪੰਜਾਬੀ (Punjabi)',
  'en-IN': 'English',
}

export const samplePhrases: Record<string, string[]> = {
  'hi-IN': [
    '3 दिन से पानी नहीं आ रहा है',
    'बिजली 5 घंटे से गई हुई है',
    'सड़क पर बड़ा गड्ढा है',
  ],
  'mr-IN': [
    '3 दिवसापासून पाणी येत नाही',
    'वीज 5 तासांपासून गेली आहे',
    'रस्त्यावर मोठा खड्डा आहे',
  ],
  'ta-IN': [
    '3 நாளாக தண்ணீர் வரவில்லை',
    'மின்சாரம் 5 மணி நேரமாக இல்லை',
    'சாலையில் பெரிய குழி உள்ளது',
  ],
  'en-IN': [
    'No water supply for 3 days',
    'Power cut for 5 hours',
    'Big pothole on the road',
  ],
}

// Simulated NLP Processing
export function processVoiceInput(text: string, language: string): ComplaintData {
  const lowerText = text.toLowerCase()
  
  // Detect problem type based on keywords
  let problem = 'General Issue'
  let department = 'General Administration'
  let category = 'Other'
  let priority: 'High' | 'Medium' | 'Low' = 'Medium'
  let assignedOfficer = 'Support Officer'
  let expectedResolution = '5-7 days'

  // Water-related keywords
  if (
    lowerText.includes('पानी') || lowerText.includes('paani') || lowerText.includes('water') ||
    lowerText.includes('पाणी') || lowerText.includes('தண்ணீர்') || lowerText.includes('నీరు') ||
    lowerText.includes('জল') || lowerText.includes('ನೀರು') || lowerText.includes('nal')
  ) {
    problem = 'Water Supply Issue'
    department = 'Water Works Department'
    category = 'No Supply'
    priority = 'High'
    assignedOfficer = 'Ramesh Kumar (Water Officer)'
    expectedResolution = '2-3 days'
  }
  
  // Electricity-related keywords
  else if (
    lowerText.includes('बिजली') || lowerText.includes('bijli') || lowerText.includes('electricity') ||
    lowerText.includes('power') || lowerText.includes('वीज') || lowerText.includes('மின்சாரம்') ||
    lowerText.includes('విద్యుత్') || lowerText.includes('বিদ্যুৎ') || lowerText.includes('ವಿದ್ಯುತ್')
  ) {
    problem = 'Electricity Issue'
    department = 'Electricity Board'
    category = 'Power Cut'
    priority = 'High'
    assignedOfficer = 'Suresh Sharma (Electrical Engineer)'
    expectedResolution = '1-2 days'
  }
  
  // Road-related keywords
  else if (
    lowerText.includes('सड़क') || lowerText.includes('sadak') || lowerText.includes('road') ||
    lowerText.includes('गड्ढा') || lowerText.includes('pothole') || lowerText.includes('रस्ता') ||
    lowerText.includes('சாலை') || lowerText.includes('రోడ్డు') || lowerText.includes('রাস্তা')
  ) {
    problem = 'Road Maintenance Issue'
    department = 'Public Works Department'
    category = 'Road Damage'
    priority = 'Medium'
    assignedOfficer = 'Vijay Singh (PWD Inspector)'
    expectedResolution = '7-10 days'
  }
  
  // Garbage/Sanitation keywords
  else if (
    lowerText.includes('कचरा') || lowerText.includes('garbage') || lowerText.includes('safai') ||
    lowerText.includes('कूड़ा') || lowerText.includes('waste') || lowerText.includes('குப்பை') ||
    lowerText.includes('చెత్త') || lowerText.includes('আবর্জনা')
  ) {
    problem = 'Sanitation Issue'
    department = 'Sanitation Department'
    category = 'Garbage Collection'
    priority = 'Medium'
    assignedOfficer = 'Prakash Yadav (Sanitation Officer)'
    expectedResolution = '3-5 days'
  }

  // Check for urgency indicators
  if (
    lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('तुरंत') ||
    lowerText.includes('जल्दी') || lowerText.includes('तातडीचे') || lowerText.includes('அவசரம்')
  ) {
    priority = 'High'
    expectedResolution = '24-48 hours'
  }

  return {
    problem,
    department,
    category,
    priority,
    assignedOfficer,
    expectedResolution,
    detectedLanguage: languages[language] || 'Unknown',
  }
}
