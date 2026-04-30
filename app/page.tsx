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
  // Show unavailable message when site is not live
  if (!SITE_LIVE) {
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
