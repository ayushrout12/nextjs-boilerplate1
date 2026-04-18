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
  verification: {
    google: 'Fu8TU5tLcz_FIVidS4ADOG2WffSgr8j9bxL1cjEfzK0',
  },
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
  openGraph: {
    title: "Lotus — The World's Best Designer",
    description: 'describe your vision, and lotus will craft it. no code, just creativity.',
    images: [{ url: '/lotus-icon.jpg', width: 512, height: 512, alt: 'Lotus' }],
    siteName: 'Lotus',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Lotus — The World's Best Designer",
    description: 'describe your vision, and lotus will craft it. no code, just creativity.',
    images: ['/lotus-icon.jpg'],
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
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${playfair.variable} ${jetbrains.variable} bg-background`}>
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
export const metadata = {
  title: "lotus",
  description: "the world's best designer",
  openGraph: {
    title: "lotus",
    description: "the world's best designer",
    url: "https://trylotus.dev",
    images: [
      {
        url: "https://trylotus.dev/preview.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lotus",
    description: "the world's best designer",
    images: ["https://trylotus.dev/preview.png"],
  },
};
