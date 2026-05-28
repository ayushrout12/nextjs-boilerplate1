import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PasswordGate } from "@/components/password-gate"

import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://trylotus.dev"),
  title: "Lotus — The World's Best Designer",
  description: "Describe your vision, and Lotus will craft it. No code, just creativity.",
  openGraph: {
    title: "Lotus — The World's Best Designer",
    description: "Describe your vision, and Lotus will craft it. No code, just creativity.",
    url: "https://trylotus.dev",
    siteName: "Lotus",
    type: "website",
    images: [
      {
        url: "https://trylotus.dev/lotus-preview.png",
        width: 1200,
        height: 630,
        alt: "Lotus preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lotus — The World's Best Designer",
    description: "Describe your vision, and Lotus will craft it. No code, just creativity.",
    images: ["https://trylotus.dev/lotus-preview.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <PasswordGate>
            {children}
          </PasswordGate>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
