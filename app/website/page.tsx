"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

const CORRECT_PASSWORD = "lotuswaitlist"

export default function WebsitePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [typedText, setTypedText] = useState("")

  const fullText = "lotus"

  // Typewriter effect
  useEffect(() => {
    if (showTransition && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 150)
      return () => clearTimeout(timeout)
    } else if (showTransition && typedText.length === fullText.length) {
      // Store access in localStorage and redirect to home
      localStorage.setItem("lotus_access", "granted")
      const timeout = setTimeout(() => {
        router.push("/")
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [showTransition, typedText, router])

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!password) {
      setError("please enter the password")
      return
    }
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

  // Typewriter transition screen
  if (isAuthenticated && showTransition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-3xl overflow-hidden mb-8">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="h-16 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-serif tracking-wide">
              {typedText}
              <span className="animate-pulse text-primary">|</span>
            </h1>
          </div>
          
          <p className="text-muted-foreground/50 font-light text-sm mt-8 animate-pulse">
            entering the garden...
          </p>
        </div>
      </div>
    )
  }

  // Password entry page
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        {/* Logo and name */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl overflow-hidden">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-2xl font-serif">lotus</span>
        </div>
        
        {/* Enter password heading */}
        <h1 className="text-2xl md:text-3xl font-serif mb-3">Enter password</h1>
        <p className="text-muted-foreground font-light mb-8">
          This site is in private beta. Enter the password to continue.
        </p>
        
        {/* Password input */}
        <div className="mb-6">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            placeholder="Password"
            className="h-12 rounded-lg bg-background border-border font-light text-center"
            autoComplete="off"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
            }}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-destructive text-sm font-light mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {/* Continue button */}
        <Button
          type="button"
          disabled={isLoading}
          onClick={() => handleSubmit()}
          className="w-full h-12 rounded-lg font-light bg-foreground text-background hover:bg-foreground/90 mb-6"
        >
          {isLoading ? (
            <span className="animate-pulse">verifying...</span>
          ) : (
            "Continue"
          )}
        </Button>
        
        {/* Back to waitlist link */}
        <button
          onClick={() => router.push("/")}
          className="text-primary hover:underline font-light text-sm"
        >
          Back to waitlist
        </button>
      </div>
    </div>
  )
}
