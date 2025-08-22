import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CookieConsentProvider } from "@/providers/CookieConsentProvider"
import CookieConsentWrapper from "@/components/consent/CookieConsentWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Log-K - Professional Pilot Logbook",
  description: "Digital flight logbook with EASA/FAA compliance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <CookieConsentProvider>
          {children}
          <CookieConsentWrapper />
        </CookieConsentProvider>
      </body>
    </html>
  )
}