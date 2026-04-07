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
      const encodedPrompt = encodeURIComponent(prompt.trim())
      router.push(`/builder?prompt=${encodedPrompt}`)
    }
  }

  const examplePrompts = [
    "a dreamy portfolio for a florist",
    "a minimal landing page for a wellness app",
    "an elegant site for a boutique hotel",
    "a serene blog for poetry and prose",
  ]

  return (
    <section className="relative overflow-hidden">
      {/* botanical gradient background */}
      <div className="absolute inset-0 -z-10 lotus-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.12_350_/_0.08),transparent)]" />
      </div>

      <div className="container py-28 md:py-36 lg:py-44">
        <div className="mx-auto max-w-4xl text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/40 bg-card/50 backdrop-blur-sm px-5 py-2 text-sm text-muted-foreground mb-10">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-light tracking-wide">ai-powered web creation</span>
          </div>

          {/* heading */}
          <h1 className="text-4xl font-serif font-normal tracking-wide sm:text-5xl md:text-6xl lg:text-7xl mb-8 text-balance leading-tight">
            describe your vision.
            <br />
            <span className="text-gradient-lotus">lotus will bloom it.</span>
          </h1>

          {/* subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 text-pretty font-light leading-relaxed tracking-wide">
            transform your ideas into stunning websites in moments. 
            no code needed — just whisper what you dream.
          </p>

          {/* prompt input */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/40 p-3 lotus-glow-sm">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="describe the website you envision..."
                  className="min-h-[130px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-light tracking-wide placeholder:text-muted-foreground/60"
                />
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground pl-3 font-light tracking-wide">
                    press enter or click to create
                  </span>
                  <Button type="submit" disabled={!prompt.trim()} className="gap-2.5 rounded-xl font-light tracking-wide">
                    create
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* example prompts */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-sm text-muted-foreground font-light tracking-wide">try:</span>
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-card/60 px-4 py-2 rounded-full border border-border/40 transition-all duration-300 font-light tracking-wide backdrop-blur-sm"
              >
                {example}
              </button>
            ))}
          </div>

          {/* lotus hero image */}
          <div className="mt-20 relative mx-auto max-w-3xl">
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 rounded-[2rem] blur-3xl opacity-60 animate-petal" />
            <div className="relative rounded-3xl overflow-hidden border border-border/30 lotus-glow">
              <Image
                src="/lotus-hero.jpg"
                alt="lotus — create beautiful websites with ai"
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
