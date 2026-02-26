import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Users, MessageSquare, FileText, Search, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Users,
    title: 'Citizen Services',
    description: 'Access various government services online',
    link: 'Learn More',
    href: '/citizen-services',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'File Complaint',
    description: 'Submit and track your complaints online',
    link: 'File Now',
    href: '/file-complaint',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'Download certificates and forms',
    link: 'Download',
    href: '/documents',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Search,
    title: 'Track Status',
    description: 'Check your complaint status',
    link: 'Track Now',
    href: '/track-complaint',
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access comprehensive government services designed for citizen convenience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <a key={index} href={service.href} className="group">
                <Card className="h-full border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} strokeWidth={2} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      <span>{service.link}</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
