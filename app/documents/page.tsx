import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { FileText, ClipboardList, ScrollText, Info, Download, AlertCircle } from 'lucide-react'

const documentCategories = [
  {
    icon: FileText,
    title: 'Application Forms',
    color: 'bg-purple-50 text-purple-600',
    documents: [
      'Birth Certificate Form',
      'Caste Certificate Form',
      'Income Certificate Form',
      'Domicile Certificate Form',
    ],
  },
  {
    icon: ClipboardList,
    title: 'Guidelines',
    color: 'bg-orange-50 text-orange-600',
    documents: [
      'Service Application Guidelines',
      'Document Submission Rules',
      'Fee Structure',
      'Processing Time',
    ],
  },
  {
    icon: ScrollText,
    title: 'Policies',
    color: 'bg-yellow-50 text-yellow-600',
    documents: [
      'Privacy Policy',
      'Terms of Service',
      'Refund Policy',
      'Data Protection Policy',
    ],
  },
  {
    icon: Info,
    title: 'Information Brochures',
    color: 'bg-blue-50 text-blue-600',
    documents: [
      'E-Governance Initiative',
      'Digital India Program',
      'Citizen Rights',
      'Service Catalogue',
    ],
  },
]

export default function Documents() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2c5282] to-[#3b82f6] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Download Documents</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Access forms, certificates, and official documents
          </p>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {documentCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center space-y-4 pb-4">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto`}>
                      <Icon size={32} strokeWidth={2} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a 
                            href="#" 
                            className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50 group"
                          >
                            <span className="text-sm">{doc}</span>
                            <Download size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Download Instructions */}
          <Card className="max-w-4xl mx-auto border-l-4 border-l-red-500 bg-blue-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Download Instructions</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>All documents are available in PDF format</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Please use Adobe Reader or similar PDF viewer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Fill forms clearly in BLOCK LETTERS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Attach required supporting documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>For queries, contact our helpline</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
