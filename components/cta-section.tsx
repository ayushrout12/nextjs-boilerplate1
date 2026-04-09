import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join creators who are already building beautiful websites with Lotus. 
            Start creating — it&apos;s free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="btn-pill px-8 h-12 text-base font-medium">
              <Link href="/builder">
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="btn-pill px-8 h-12 text-base font-medium">
              <Link href="/auth/sign-up">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
