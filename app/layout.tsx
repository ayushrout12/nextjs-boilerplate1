import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { PasswordGate } from '@/components/password-gate'
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

  generator: 'Lotus',
  keywords: ['ai website builder', 'no code', 'website generator', 'ai design', 'lotus', 'web creation'],
  authors: [{ name: 'Lotus' }],
  creator: 'Lotus',
  publisher: 'Lotus',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: 'https://trylotus.dev',
  },

  icons: {
    icon: [
      { url: '/lotus-icon.jpg', sizes: 'any' },
      { url: '/lotus-icon.jpg', type: 'image/jpeg', sizes: '192x192' },
    ],
    shortcut: '/lotus-icon.jpg',
    apple: [
      { url: '/lotus-icon.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },

  // ✅ FIXED OPEN GRAPH
  openGraph: {
    title: "Lotus — The World's Best Designer",
    description: 'describe your vision, and lotus will craft it. no code, just creativity.',
    url: 'https://trylotus.dev',
    siteName: 'Lotus',
    images: [
      {
        url: '/lotus-preview.png', // ← your Canva image
        width: 1200,
        height: 630,
        alt: 'Lotus Preview',
      },
    ],
    type: 'website',
  },

  // ✅ FIXED TWITTER (X) CARD
  twitter: {
    card: 'summary_large_image', // ← makes it BIG
    title: "Lotus — The World's Best Designer",
    description: 'describe your vision, and lotus will craft it. no code, just creativity.',
    images: ['/lotus-preview.png'], // ← same image
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1516' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${playfair.variable} ${jetbrains.variable} bg-background`}
    >
      <body className="font-sans antialiased lowercase">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PasswordGate>
            {children}
          </PasswordGate>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
