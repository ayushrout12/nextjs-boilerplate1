"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, AlertCircle } from "lucide-react"

const CORRECT_PASSWORD = "lotuswaitlist"

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Small delay to prevent brute force
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setIsAuthenticated(true)
      } else {
        setError("incorrect password")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  // User is authenticated - show the site
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Show password gate
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none lotus-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.12_350_/_0.08),transparent)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-petal" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-petal" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-sm mx-auto text-center">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-24 h-24 rounded-3xl overflow-hidden lotus-glow mb-8">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-serif font-normal tracking-wide mb-4 text-gradient-lotus">
            lotus
          </h1>
          <p className="text-muted-foreground font-light tracking-wide text-lg">
            enter the garden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="relative">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="password"
              className="h-14 rounded-2xl bg-card/50 border-border/30 backdrop-blur-xl font-light tracking-widest text-center placeholder:text-muted-foreground/50 placeholder:tracking-wide"
              autoFocus
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm font-light tracking-wide">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!password || isLoading}
            className="w-full h-14 rounded-2xl bg-primary/90 hover:bg-primary text-primary-foreground font-light tracking-wide lotus-glow-sm transition-all duration-300"
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

        <p className="text-center text-xs text-muted-foreground/50 mt-12 font-light tracking-wide">
          this site is currently in private beta
        </p>
      </div>
    </div>
  )
}
