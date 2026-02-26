"use client"

import { useState } from 'react'
import { CheckCircle, AlertCircle, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SchemeWithEligibility, CitizenProfile } from '@/lib/schemeData'
import { getDocuments } from '@/lib/documentVault'
import SchemeApplicationForm from './SchemeApplicationForm'

interface SchemeCardProps {
  scheme: SchemeWithEligibility
  profile: CitizenProfile
}

export default function SchemeCard({ scheme, profile }: SchemeCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const isEligible = scheme.eligibilityStatus === 'eligible'
  const uploadedDocs = getDocuments()

  const handleApply = () => {
    setShowApplicationForm(true)
  }

  return (
    <>
      <div
        className={`rounded-xl shadow-lg overflow-hidden transition-all ${
          isEligible ? 'border-2 border-green-500 bg-white' : 'border-2 border-yellow-400 bg-yellow-50'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isEligible ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <AlertCircle className="text-yellow-600" size={24} />
                )}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    isEligible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isEligible ? 'ELIGIBLE' : 'NEARLY ELIGIBLE'}
                </span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">{scheme.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {scheme.category}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Benefits:</p>
            <p className="text-sm text-blue-800">{scheme.benefits}</p>
          </div>

          {!isEligible && scheme.missingCriteria && scheme.missingCriteria.length > 0 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">Missing Criteria:</p>
              <ul className="text-sm text-yellow-800 list-disc list-inside">
                {scheme.missingCriteria.map((criteria, idx) => (
                  <li key={idx}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            {showDetails ? '▼ Hide Details' : '▶ Show Required Documents'}
          </button>

          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Required Documents:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {scheme.documents.map((doc, idx) => {
                  const hasDoc = uploadedDocs.some(d => 
                    d.name.toLowerCase().includes(doc.toLowerCase().split(' ')[0])
                  )
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      {hasDoc ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <FileText size={14} className="text-gray-500" />
                      )}
                      <span className={hasDoc ? 'text-green-700 font-medium' : ''}>
                        {doc} {hasDoc && '✓ Available in Vault'}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {uploadedDocs.length > 0 && (
                <p className="text-xs text-green-700 mt-2 font-medium">
                  📎 Documents will be auto-attached from your vault
                </p>
              )}
            </div>
          )}

          {isEligible && (
            <Button
              onClick={handleApply}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              🚀 Apply Now - Auto-Filled & Auto-Attached
            </Button>
          )}

          {!isEligible && (
            <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
              Not Eligible Yet
            </Button>
          )}
        </div>
      </div>

      <SchemeApplicationForm
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        scheme={scheme}
        profile={profile}
      />
    </>
  )
}
