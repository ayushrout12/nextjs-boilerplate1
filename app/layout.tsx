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

  title: "lotus",
  description: "the world's best designer",

  keywords: ['ai website builder', 'no code', 'website generator', 'ai design', 'lotus'],
  authors: [{ name: 'Lotus' }],
  creator: 'Lotus',
  publisher: 'Lotus',

  openGraph: {
    title: "lotus",
    description: "the world's best designer",
    url: "https://trylotus.dev",
    siteName: "lotus",
    images: [
      {
        url: "https://i.imgur.com/gernMuE.png",
        width: 1200,
        height: 630,
        alt: "lotus preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "lotus",
    description: "the world's best designer",
    images: ["https://i.imgur.com/gernMuE.png"],
  },

  icons: {
    icon: '/lotus-icon.jpg',
    shortcut: '/lotus-icon.jpg',
    apple: '/lotus-icon.jpg',
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
}: {
  children: React.ReactNode
}) {
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
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
