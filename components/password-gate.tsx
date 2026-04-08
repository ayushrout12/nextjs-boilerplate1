"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, ArrowRight, AlertCircle } from "lucide-react"

const CORRECT_PASSWORD = "lotuswaitlist"
const AUTH_KEY = "lotus_site_access"

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user has already authenticated
    const stored = sessionStorage.getItem(AUTH_KEY)
    if (stored === "true") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Small delay to prevent brute force
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, "true")
        setIsAuthenticated(true)
      } else {
        setError("incorrect password")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl overflow-hidden animate-pulse">
          <Image
            src="/lotus-icon.jpg"
            alt="lotus"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }

  // User is authenticated - show the site
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Show password gate
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden lotus-glow">
              <Image
                src="/lotus-icon.jpg"
                alt="lotus"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-3xl font-serif font-normal tracking-wide mb-3 text-gradient-lotus">
            lotus
          </h1>
          <p className="text-muted-foreground font-light tracking-wide">
            enter the garden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="enter password"
              className="pl-11 pr-4 h-14 rounded-2xl bg-card/50 border-border/30 backdrop-blur-xl font-light tracking-wide text-center placeholder:text-muted-foreground/50"
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

        <p className="text-center text-xs text-muted-foreground/50 mt-10 font-light tracking-wide">
          this site is currently in private beta
        </p>
      </div>
    </div>
  )
}
