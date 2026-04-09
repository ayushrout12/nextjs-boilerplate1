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
    "a minimal portfolio",
    "a landing page for an app",
    "an elegant hotel website",
    "a creative agency site",
  ]

  return (
    <section className="relative overflow-hidden lotus-gradient">
      <div className="container py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-light tracking-wide">ai-powered web creation</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-serif tracking-wide sm:text-6xl md:text-7xl mb-6 text-balance leading-[1.1] animate-fade-in-up-delay-1">
            describe your vision.
            <br />
            <span className="text-gradient-lotus animate-shimmer">lotus will bloom it.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed font-light animate-fade-in-up-delay-2">
            transform your ideas into stunning websites in moments. no code needed — just whisper what you dream.
          </p>

          {/* Prompt input card */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl mb-8 animate-fade-in-up-delay-3">
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-lg lotus-glow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-float">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="describe the website you envision..."
                className="min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg p-6 placeholder:text-muted-foreground/50 font-light"
              />
              <div className="flex items-center justify-between p-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground font-light">
                  press enter or click to create
                </span>
                <Button 
                  type="submit" 
                  disabled={!prompt.trim()} 
                  className="rounded-xl px-6"
                >
                  bloom
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Example prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2 font-light">try:</span>
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-sm text-primary hover:text-primary/80 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors font-light"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
