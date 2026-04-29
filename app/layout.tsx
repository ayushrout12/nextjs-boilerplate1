import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif"
})

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trylotus.dev'),
  title: "Lotus — The World's Best Designer",
  description: 'describe your vision, and lotus will craft it. no code, just creativity.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// 🔒 TOGGLE THIS
const SITE_LIVE = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        {SITE_LIVE ? (
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <p className="text-black text-2xl font-medium">
              This Site Is Currently Unavailable
            </p>
          </div>
        )}
        <Analytics />
      </body>
    </html>
  )
}