import Header from "../../../../components/Header"
import Footer from "../../../../components/Footer"
import DeathCertificateForm from "../../../../components/DeathCertificateForm"

export default function DeathCertificate() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-br from-[#2c5282] to-[#3b82f6] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Death Certificate Registration</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Complete the form below to register a death certificate
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <DeathCertificateForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
