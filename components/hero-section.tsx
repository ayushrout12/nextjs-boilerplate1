"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [prompt, setPrompt] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      const encodedPrompt = encodeURIComponent(prompt.trim())
      router.push(`/builder?prompt=${encodedPrompt}`)
    }
  }

  const examplePrompts = [
    "a minimal portfolio",
    "a landing page for an app",
    "an elegant hotel website",
    "a creative agency site",
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Heading */}
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl mb-6 text-balance leading-[1.1]">
            Describe your vision.
            <br />
            <span className="text-gradient-apple">Lotus will build it.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            Transform your ideas into stunning websites in moments. 
            No code needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="btn-pill px-8 h-12 text-base font-medium"
              onClick={() => router.push('/builder')}
            >
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="btn-pill px-8 h-12 text-base font-medium"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Prompt input card */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div className="relative bg-card rounded-2xl border border-border shadow-lg">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to create..."
                className="min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg p-6 placeholder:text-muted-foreground/60"
              />
              <div className="flex items-center justify-between p-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Press enter or click to create
                </span>
                <Button 
                  type="submit" 
                  disabled={!prompt.trim()} 
                  className="btn-pill px-6"
                >
                  Create
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Example prompts */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-sm text-primary hover:text-primary/80 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-20 relative mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/lotus-hero.jpg"
              alt="Lotus — Create beautiful websites with AI"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
