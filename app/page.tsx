"use client"

import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Statistics from "@/components/Statistics"
import QuickLinks from "@/components/QuickLinks"
import Footer from "@/components/Footer"
import { LanguageProvider } from "@/lib/languageContext"

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen">
        <Header />
        <Hero />
        <Services />
        <Statistics />
        <QuickLinks />
        <Footer />
      </main>
    </LanguageProvider>
  )
}
