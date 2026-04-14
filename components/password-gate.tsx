"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, AlertCircle, Check, Mail, Lock } from "lucide-react"

const CORRECT_PASSWORD = "lotuswaitlist"

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [waitlistError, setWaitlistError] = useState("")
  const [waitlistSuccess, setWaitlistSuccess] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false)

  const fullText = "lotus"

  // Typewriter effect
  useEffect(() => {
    if (showTransition && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 150) // Speed of typing
      return () => clearTimeout(timeout)
    } else if (showTransition && typedText.length === fullText.length) {
      // After typing completes, wait a moment then show content
      const timeout = setTimeout(() => {
        setShowContent(true)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [showTransition, typedText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setIsAuthenticated(true)
        setShowTransition(true)
      } else {
        setError("incorrect password")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setWaitlistError("please enter a valid email")
      return
    }
    
    setIsJoiningWaitlist(true)
    setWaitlistError("")
    setWaitlistSuccess("")
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (data.error === "already_registered") {
          setWaitlistError("you're already on the waitlist!")
        } else {
          setWaitlistError(data.error || "something went wrong")
        }
        return
      }
      
      setWaitlistSuccess("you're on the list!")
      setEmail("")
    } catch (err) {
      setWaitlistError("something went wrong")
    } finally {
      setIsJoiningWaitlist(false)
    }
  }

  // Show content after typewriter animation
  if (isAuthenticated && showContent) {
    return <>{children}</>
  }

  // Typewriter transition screen
  if (isAuthenticated && showTransition) {
    return (
      <div className="min-h-screen bg-background lotus-gradient flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Logo with pulse animation */}
          <div className="w-32 h-32 rounded-3xl overflow-hidden animate-pulse-glow mb-8 animate-petal">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Typewriter text */}
          <div className="h-16 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-serif tracking-wide text-gradient-lotus">
              {typedText}
              <span className="animate-pulse text-primary">|</span>
            </h1>
          </div>
          
          {/* Subtle loading indicator */}
          <p className="text-muted-foreground/50 font-light text-sm mt-8 animate-pulse">
            entering the garden...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background lotus-gradient flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo centered above */}
        <div className="flex flex-col items-center justify-center mb-12">
          <a href="/" className="block">
            <div className="w-24 h-24 rounded-3xl overflow-hidden lotus-glow mb-6 animate-petal cursor-pointer hover:scale-105 transition-transform">
              <Image
                src="/lotus-icon.jpg"
                alt="lotus"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </a>
          <h1 className="text-4xl font-serif tracking-wide text-gradient-lotus">
            lotus
          </h1>
          <p className="text-muted-foreground mt-2 font-light">
            ai-powered web creation
          </p>
        </div>

        {/* Split view */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left side - Waitlist */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif">join the waitlist</h2>
                <p className="text-sm text-muted-foreground font-light">get early access</p>
              </div>
            </div>
            
            <p className="text-muted-foreground font-light mb-6 leading-relaxed">
              be the first to know when lotus blooms. enter your email to join our exclusive waitlist and get notified when we launch.
            </p>
            
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setWaitlistError("")
                  setWaitlistSuccess("")
                }}
                placeholder="your@email.com"
                className="h-12 rounded-xl bg-background/50 border-border/50 font-light"
                disabled={isJoiningWaitlist}
              />
              
              {waitlistError && (
                <div className="flex items-center gap-2 text-destructive text-sm font-light">
                  <AlertCircle className="w-4 h-4" />
                  {waitlistError}
                </div>
              )}
              
              {waitlistSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-light">
                  <Check className="w-4 h-4" />
                  {waitlistSuccess}
                </div>
              )}
              
              <Button
                type="submit"
                variant="outline"
                disabled={!email || isJoiningWaitlist}
                className="w-full h-12 rounded-xl font-light border-primary/30 hover:bg-primary/5 hover:border-primary/50"
              >
                {isJoiningWaitlist ? (
                  <span className="animate-pulse">joining...</span>
                ) : (
                  <>
                    join waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right side - Password */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif">enter the garden</h2>
                <p className="text-sm text-muted-foreground font-light">private beta access</p>
              </div>
            </div>
            
            <p className="text-muted-foreground font-light mb-6 leading-relaxed">
              already have access? enter your password below to unlock the full lotus experience and start creating.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="password"
                className="h-12 rounded-xl bg-background/50 border-border/50 font-light tracking-widest text-center placeholder:tracking-normal"
                autoComplete="off"
                disabled={isLoading}
              />

              {error && (
                <div className="flex items-center justify-center gap-2 text-destructive text-sm font-light">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={!password || isLoading}
                className="w-full h-12 rounded-xl font-light lotus-glow-sm"
              >
                {isLoading ? (
                  <span className="animate-pulse">verifying...</span>
                ) : (
                  <>
                    unlock
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 font-light">
          this site is currently in private beta
        </p>
      </div>
    </div>
  )
}
