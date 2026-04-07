"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const [prompt, setPrompt] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // Encode the prompt and navigate to builder
      const encodedPrompt = encodeURIComponent(prompt.trim())
      router.push(`/builder?prompt=${encodedPrompt}`)
    }
  }

  const examplePrompts = [
    "A modern portfolio for a photographer",
    "A landing page for a SaaS startup",
    "An e-commerce site for handmade jewelry",
    "A restaurant website with online ordering",
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
      </div>

      <div className="container py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Website Builder</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-balance">
            Describe your vision.
            <br />
            <span className="text-muted-foreground">Lotus AI will build it.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty">
            Transform your ideas into stunning, production-ready websites in seconds. 
            No coding required — just describe what you want.
          </p>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
              <div className="relative bg-card rounded-xl border border-border p-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the website you want to create..."
                  className="min-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                />
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground pl-2">
                    Press Enter or click to generate
                  </span>
                  <Button type="submit" disabled={!prompt.trim()} className="gap-2">
                    Generate
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Example prompts */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-1.5 rounded-full border border-border/50 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          {/* Lotus Hero Image */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <Image
                src="/lotus-hero.jpg"
                alt="Lotus AI - Create beautiful websites with AI"
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
