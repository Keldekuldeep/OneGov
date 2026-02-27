import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GlobalAIHelper from "@/components/GlobalAIHelper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneGov Portal - Digital India Initiative",
  description: "Empowering Citizens Through Technology - Access government services, file complaints, and track status online",
  keywords: ["e-governance", "government portal", "digital india", "citizen services"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <GlobalAIHelper />
      </body>
    </html>
  )
}
