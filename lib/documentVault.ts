// Document Vault Data Management

export type DocumentType =
  | 'aadhaar'
  | 'pan'
  | 'income-certificate'
  | 'caste-certificate'
  | 'domicile-certificate'
  | 'bank-passbook'
  | 'photo'
  | 'birth-certificate'
  | 'address-proof'
  | 'educational-certificate'
  | 'bpl-card'

export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface Document {
  id: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: number
  uploadDate: string
  verificationStatus: VerificationStatus
  fileUrl?: string // For demo, we'll use placeholder
}

export const documentTypeLabels: Record<DocumentType, string> = {
  'aadhaar': 'Aadhaar Card',
  'pan': 'PAN Card',
  'income-certificate': 'Income Certificate',
  'caste-certificate': 'Caste Certificate',
  'domicile-certificate': 'Domicile Certificate',
  'bank-passbook': 'Bank Passbook',
  'photo': 'Passport Photo',
  'birth-certificate': 'Birth Certificate',
  'address-proof': 'Address Proof',
  'educational-certificate': 'Educational Certificate',
  'bpl-card': 'BPL Card',
}

export const requiredDocuments: DocumentType[] = [
  'aadhaar',
  'pan',
  'income-certificate',
  'bank-passbook',
  'photo',
]

// Get all documents from localStorage
export function getDocuments(): Document[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('documentVault')
  return stored ? JSON.parse(stored) : []
}

// Save documents to localStorage
export function saveDocuments(documents: Document[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('documentVault', JSON.stringify(documents))
}

// Add a new document
export function addDocument(document: Omit<Document, 'id' | 'uploadDate'>): Document {
  const newDoc: Document = {
    ...document,
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    uploadDate: new Date().toISOString(),
  }
  
  const documents = getDocuments()
  documents.push(newDoc)
  saveDocuments(documents)
  
  return newDoc
}

// Delete a document
export function deleteDocument(id: string): void {
  const documents = getDocuments().filter(doc => doc.id !== id)
  saveDocuments(documents)
}

// Get document by type
export function getDocumentByType(type: DocumentType): Document | undefined {
  return getDocuments().find(doc => doc.type === type)
}

// Check if all required documents are uploaded
export function hasAllRequiredDocuments(): boolean {
  const documents = getDocuments()
  return requiredDocuments.every(type => 
    documents.some(doc => doc.type === type)
  )
}

// Get missing required documents
export function getMissingRequiredDocuments(): DocumentType[] {
  const documents = getDocuments()
  return requiredDocuments.filter(type => 
    !documents.some(doc => doc.type === type)
  )
}

// Demo: Initialize with sample documents
export function initializeDemoDocuments(): void {
  const existing = getDocuments()
  if (existing.length > 0) return // Already has documents

  const demoDocuments: Omit<Document, 'id' | 'uploadDate'>[] = [
    {
      type: 'aadhaar',
      name: 'Aadhaar Card',
      fileName: 'aadhaar_card.pdf',
      fileSize: 245000,
      verificationStatus: 'verified',
    },
    {
      type: 'pan',
      name: 'PAN Card',
      fileName: 'pan_card.pdf',
      fileSize: 180000,
      verificationStatus: 'verified',
    },
    {
      type: 'photo',
      name: 'Passport Photo',
      fileName: 'passport_photo.jpg',
      fileSize: 95000,
      verificationStatus: 'verified',
    },
    {
      type: 'bank-passbook',
      name: 'Bank Passbook',
      fileName: 'bank_passbook.pdf',
      fileSize: 320000,
      verificationStatus: 'pending',
    },
  ]

  demoDocuments.forEach(doc => addDocument(doc))
}
