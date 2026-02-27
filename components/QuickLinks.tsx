import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Building2, Globe, MapPin, Activity, ExternalLink, ShieldCheck, Shield } from 'lucide-react'
import Link from 'next/link'

const links = [
  {
    icon: ShieldCheck,
    title: 'Officer Portal',
    description: 'Login for Government Officers',
    color: 'bg-indigo-50 text-indigo-600',
    href: '/officer/login',
    isInternal: true,
  },
  {
    icon: Shield,
    title: 'Admin Portal',
    description: 'System Administration',
    color: 'bg-purple-50 text-purple-600',
    href: '/admin/login',
    isInternal: true,
  },
  {
    icon: Building2,
    title: 'Government Portal',
    description: 'Official Government Website',
    color: 'bg-blue-50 text-blue-600',
    href: '#',
    isInternal: false,
  },
  {
    icon: Globe,
    title: 'Digital India',
    description: 'Digital India Initiative',
    color: 'bg-green-50 text-green-600',
    href: '#',
    isInternal: false,
  },
  {
    icon: MapPin,
    title: 'e-District',
    description: 'District Administration Services',
    color: 'bg-orange-50 text-orange-600',
    href: '#',
    isInternal: false,
  },
  {
    icon: Activity,
    title: 'Health Portal',
    description: 'Latest Health Updates',
    color: 'bg-pink-50 text-pink-600',
    href: '#',
    isInternal: false,
  },
]

export default function QuickLinks() {
  return (
    <section id="links" className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Important government portals and resources for citizens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {links.map((link, index) => {
            const Icon = link.icon
            const CardWrapper = link.isInternal ? Link : 'a'
            return (
              <CardWrapper key={index} href={link.href} className="group">
                <Card className="h-full border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <ExternalLink size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{link.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{link.description}</CardDescription>
                  </CardContent>
                </Card>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
