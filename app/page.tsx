"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BlogSection } from "@/components/blog-section"
import { FounderSection } from "@/components/founder-section"
import { CTASection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

// 🔒 TOGGLE THIS (must match layout.tsx)
// false = Shows "Site Unavailable" with simple password bypass
// true = Shows full waitlist page (handled by PasswordGate in layout)
const SITE_LIVE = false
const ACCESS_PASSWORD = "Ayush@2012USA"

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(SITE_LIVE)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ACCESS_PASSWORD) {
      setHasAccess(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  // When SITE_LIVE = false, show unavailable message with password bypass
  // When SITE_LIVE = true, the PasswordGate in layout handles access
  if (!SITE_LIVE && !hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <p className="text-black text-2xl font-medium">
          This Site Is Currently Unavailable
        </p>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="Enter password"
            className="px-4 py-2 border border-gray-300 rounded-lg text-black text-center focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Enter
          </button>
          {error && (
            <p className="text-red-500 text-sm">Incorrect password</p>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BlogSection />
        <FounderSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
