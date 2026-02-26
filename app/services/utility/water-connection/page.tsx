import UtilityServices from '@/components/utility/UtilityServices'

export default function WaterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-[#2c5282] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Utility Services</h1>
          <p className="text-blue-100 text-lg">
            Access essential utility and welfare services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <UtilityServices />
        </div>
      </div>
    </div>
  )
}
