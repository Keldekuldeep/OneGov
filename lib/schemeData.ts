// Scheme Eligibility Rules and Data

export interface SchemeRule {
  id: string
  name: string
  description: string
  category: string
  benefits: string
  rules: {
    minAge?: number
    maxAge?: number
    maxIncome?: number
    categories?: string[] // General, OBC, SC, ST
    gender?: string[] // Male, Female, Other
    occupation?: string[] // Student, Farmer, Worker, Business, Unemployed
    bplCard?: boolean
    state?: string[]
  }
  documents: string[]
  applicationUrl?: string
}

export interface CitizenProfile {
  name: string
  age: number
  gender: string
  category: string
  income: number
  occupation: string
  hasBPLCard: boolean
  state: string
  mobile: string
  email: string
  aadhaar: string
}

export const schemes: SchemeRule[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Yojana',
    description: 'Financial assistance of ₹6000 per year to farmer families',
    category: 'Agriculture',
    benefits: '₹2000 every 4 months (₹6000/year)',
    rules: {
      occupation: ['Farmer'],
      maxIncome: 200000,
    },
    documents: ['Aadhaar Card', 'Bank Passbook', 'Land Records'],
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'Free health insurance coverage up to ₹5 lakh per family',
    category: 'Health',
    benefits: '₹5 lakh health insurance coverage',
    rules: {
      maxIncome: 100000,
      bplCard: true,
    },
    documents: ['Aadhaar Card', 'BPL Card', 'Family Photo'],
  },
  {
    id: 'scholarship-sc-st',
    name: 'Post Matric Scholarship (SC/ST)',
    description: 'Financial assistance for SC/ST students pursuing higher education',
    category: 'Education',
    benefits: '₹10,000 - ₹50,000 per year',
    rules: {
      minAge: 16,
      maxAge: 30,
      categories: ['SC', 'ST'],
      occupation: ['Student'],
      maxIncome: 250000,
    },
    documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Admission Proof'],
  },
  {
    id: 'scholarship-obc',
    name: 'Post Matric Scholarship (OBC)',
    description: 'Financial assistance for OBC students pursuing higher education',
    category: 'Education',
    benefits: '₹8,000 - ₹40,000 per year',
    rules: {
      minAge: 16,
      maxAge: 30,
      categories: ['OBC'],
      occupation: ['Student'],
      maxIncome: 150000,
    },
    documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Admission Proof'],
  },
  {
    id: 'widow-pension',
    name: 'Widow Pension Scheme',
    description: 'Monthly pension for widows',
    category: 'Social Welfare',
    benefits: '₹500 - ₹1000 per month',
    rules: {
      minAge: 18,
      gender: ['Female'],
      maxIncome: 100000,
    },
    documents: ['Aadhaar Card', 'Death Certificate of Husband', 'Bank Passbook'],
  },
  {
    id: 'old-age-pension',
    name: 'Old Age Pension',
    description: 'Monthly pension for senior citizens',
    category: 'Social Welfare',
    benefits: '₹500 - ₹1500 per month',
    rules: {
      minAge: 60,
      maxIncome: 100000,
    },
    documents: ['Aadhaar Card', 'Age Proof', 'Bank Passbook', 'Income Certificate'],
  },
  {
    id: 'mudra-loan',
    name: 'Pradhan Mantri MUDRA Yojana',
    description: 'Loan up to ₹10 lakh for small businesses',
    category: 'Business',
    benefits: 'Loan up to ₹10 lakh at low interest',
    rules: {
      minAge: 18,
      occupation: ['Business', 'Worker'],
    },
    documents: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Bank Statement'],
  },
  {
    id: 'ujjwala-yojana',
    name: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connection for BPL families',
    category: 'Welfare',
    benefits: 'Free LPG connection + subsidy',
    rules: {
      gender: ['Female'],
      minAge: 18,
      bplCard: true,
    },
    documents: ['Aadhaar Card', 'BPL Card', 'Address Proof', 'Photo'],
  },
  {
    id: 'skill-india',
    name: 'Skill India Mission',
    description: 'Free skill training and certification',
    category: 'Employment',
    benefits: 'Free training + ₹1500 stipend',
    rules: {
      minAge: 18,
      maxAge: 35,
      occupation: ['Unemployed', 'Worker'],
    },
    documents: ['Aadhaar Card', 'Educational Certificate'],
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana',
    description: 'Savings scheme for girl child',
    category: 'Savings',
    benefits: 'High interest savings (7.6% p.a.)',
    rules: {
      maxAge: 10,
      gender: ['Female'],
    },
    documents: ['Birth Certificate', 'Parent Aadhaar', 'Address Proof'],
  },
]

export type EligibilityStatus = 'eligible' | 'nearly-eligible' | 'not-eligible'

export interface SchemeWithEligibility extends SchemeRule {
  eligibilityStatus: EligibilityStatus
  missingCriteria?: string[]
}

export function checkEligibility(
  profile: CitizenProfile,
  scheme: SchemeRule
): { status: EligibilityStatus; missing: string[] } {
  const missing: string[] = []

  // Check age
  if (scheme.rules.minAge && profile.age < scheme.rules.minAge) {
    missing.push(`Minimum age: ${scheme.rules.minAge} years`)
  }
  if (scheme.rules.maxAge && profile.age > scheme.rules.maxAge) {
    missing.push(`Maximum age: ${scheme.rules.maxAge} years`)
  }

  // Check income
  if (scheme.rules.maxIncome && profile.income > scheme.rules.maxIncome) {
    missing.push(`Maximum income: ₹${scheme.rules.maxIncome.toLocaleString()}`)
  }

  // Check category
  if (scheme.rules.categories && !scheme.rules.categories.includes(profile.category)) {
    missing.push(`Category: ${scheme.rules.categories.join(', ')}`)
  }

  // Check gender
  if (scheme.rules.gender && !scheme.rules.gender.includes(profile.gender)) {
    missing.push(`Gender: ${scheme.rules.gender.join(', ')}`)
  }

  // Check occupation
  if (scheme.rules.occupation && !scheme.rules.occupation.includes(profile.occupation)) {
    missing.push(`Occupation: ${scheme.rules.occupation.join(', ')}`)
  }

  // Check BPL card
  if (scheme.rules.bplCard && !profile.hasBPLCard) {
    missing.push('BPL Card required')
  }

  // Determine status
  if (missing.length === 0) {
    return { status: 'eligible', missing: [] }
  } else if (missing.length === 1) {
    return { status: 'nearly-eligible', missing }
  } else {
    return { status: 'not-eligible', missing }
  }
}

export function getEligibleSchemes(profile: CitizenProfile): SchemeWithEligibility[] {
  return schemes
    .map((scheme) => {
      const { status, missing } = checkEligibility(profile, scheme)
      return {
        ...scheme,
        eligibilityStatus: status,
        missingCriteria: missing,
      }
    })
    .filter((scheme) => scheme.eligibilityStatus !== 'not-eligible')
    .sort((a, b) => {
      // Sort: eligible first, then nearly-eligible
      if (a.eligibilityStatus === 'eligible' && b.eligibilityStatus !== 'eligible') return -1
      if (a.eligibilityStatus !== 'eligible' && b.eligibilityStatus === 'eligible') return 1
      return 0
    })
}
