import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-28 md:py-36 lotus-gradient">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary/90 backdrop-blur-xl p-10 md:p-20 lotus-glow">
          {/* soft pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
          
          <div className="relative text-center">
            <h2 className="text-3xl font-serif font-normal tracking-wide sm:text-4xl md:text-5xl mb-6 text-primary-foreground">
              ready to let your ideas bloom?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed tracking-wide">
              join creators who are already nurturing beautiful websites with lotus. 
              begin your journey — no barriers, just possibilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="gap-2.5 rounded-xl font-light tracking-wide">
                <Link href="/builder">
                  begin creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-xl font-light tracking-wide">
                <Link href="/auth/sign-up">
                  join lotus
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
