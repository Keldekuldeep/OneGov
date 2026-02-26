import { Card, CardContent } from './ui/card'
import { TrendingUp, CheckCircle, Star, Clock } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '1,234',
    label: 'Services Delivered',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: CheckCircle,
    value: '567',
    label: 'Complaints Resolved',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Star,
    value: '89%',
    label: 'Satisfaction Rate',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Online Support',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
]

export default function Statistics() {
  return (
    <section id="statistics" className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Portal Statistics</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time insights into our service delivery and performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto`}>
                    <Icon className={stat.color} size={24} strokeWidth={2} />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
