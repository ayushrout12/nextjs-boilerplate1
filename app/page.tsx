"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { BlogSection } from "@/components/blog-section"
import { FounderSection } from "@/components/founder-section"
import { CTASection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

// 🔒 TOGGLE THIS (must match layout.tsx)
const SITE_LIVE = false

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has access via /enter password
    const accessGranted = localStorage.getItem("lotus_access_granted") === "true"
    setHasAccess(accessGranted)
    setIsLoading(false)
  }, [])

  // Show loading state briefly while checking access
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  // Show unavailable message when site is not live AND user doesn't have access
  if (!SITE_LIVE && !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black text-2xl font-medium">
          This Site Is Currently Unavailable
        </p>
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
