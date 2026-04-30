"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, AlertCircle, Check } from "lucide-react"

const CORRECT_PASSWORD = "lotuswaitlist"

// Allowed email domains
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "sbcglobal.net",
  "outlook.com",
  "live.com",
]

function validateEmail(email: string): { valid: boolean; reason?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "please enter a valid email address" }
  }
  
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
    return { valid: false, reason: "please use Gmail, Yahoo, iCloud, Hotmail, or similar" }
  }
  
  return { valid: true }
}

interface PasswordGateProps {
  children: React.ReactNode
}

// Floating lotus petal component
function FloatingPetal({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) {
  return (
    <div
      className="absolute opacity-60 pointer-events-none"
      style={{
        left,
        top: '-50px',
        animation: `floatDown ${duration}s linear ${delay}s infinite`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="8" ry="18" fill="rgba(232, 164, 184, 0.6)" transform="rotate(-15 20 20)" />
        <ellipse cx="20" cy="20" rx="6" ry="14" fill="rgba(212, 130, 154, 0.4)" transform="rotate(-15 20 20)" />
      </svg>
    </div>
  )
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
  const [showPasswordPage, setShowPasswordPage] = useState(false)

  const fullText = "lotus"

  // Typewriter effect
  useEffect(() => {
    if (showTransition && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 150)
      return () => clearTimeout(timeout)
    } else if (showTransition && typedText.length === fullText.length) {
      const timeout = setTimeout(() => {
        setShowContent(true)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [showTransition, typedText])

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

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateEmail(email)
    if (!validation.valid) {
      setWaitlistError(validation.reason || "please enter a valid email")
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
    } catch {
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
          <div className="w-32 h-32 rounded-3xl overflow-hidden animate-pulse-glow mb-8 animate-petal">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="h-16 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-serif tracking-wide text-gradient-lotus">
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

  // Password entry page (like tryjasmine.dev/website)
  if (showPasswordPage) {
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
            onClick={() => {
              if (!password) {
                setError("password is required")
                return
              }
              handleSubmit()
            }}
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
            onClick={() => {
              setShowPasswordPage(false)
              setPassword("")
              setError("")
            }}
            className="text-primary hover:underline font-light text-sm"
          >
            ← Back to waitlist
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Lotus pond background image */}
      <div className="relative lg:w-1/2 min-h-[40vh] lg:min-h-screen overflow-hidden">
        {/* Background image - positioned to show the lotus flower */}
        <Image
          src="/lotus-pond-bg.png"
          alt="Lotus pond"
          fill
          className="object-cover object-[70%_center]"
          priority
        />
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
        
        {/* Floating petals animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingPetal delay={0} duration={8} left="10%" size={30} />
          <FloatingPetal delay={2} duration={10} left="25%" size={24} />
          <FloatingPetal delay={4} duration={9} left="40%" size={28} />
          <FloatingPetal delay={1} duration={11} left="55%" size={22} />
          <FloatingPetal delay={3} duration={8} left="70%" size={26} />
          <FloatingPetal delay={5} duration={10} left="85%" size={32} />
        </div>
        
        {/* Logo and text overlay - positioned at top left like jasmine */}
        <div className="absolute top-0 left-0 right-0 p-8 lg:p-12">
          {/* Glassy icon container */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-lg flex items-center justify-center">
              <Image
                src="/lotus-icon.jpg"
                alt="lotus"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover"
              />
            </div>
            <span className="text-2xl font-serif text-white drop-shadow-lg">lotus</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-tight drop-shadow-lg">
            The World&apos;s Best
            <br />
            Designer
          </h1>
          
          <p className="text-white/80 font-light text-lg max-w-md drop-shadow-md">
            Describe what you want. Lotus crafts it. Edit, download, deploy.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="lg:w-1/2 min-h-[60vh] lg:min-h-screen bg-background flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Join the waitlist heading */}
          <h2 className="text-2xl md:text-3xl font-serif mb-2">Join the waitlist</h2>
          <p className="text-muted-foreground font-light mb-8">
            Sign up to get early access when we launch.
          </p>
          
          {/* Email field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setWaitlistError("")
                setWaitlistSuccess("")
              }}
              placeholder="you@example.com"
              className="h-12 rounded-lg bg-background border-border font-light"
              disabled={isJoiningWaitlist}
            />
          </div>
          
          {/* Error/Success messages */}
          {waitlistError && (
            <div className="flex items-center gap-2 text-destructive text-sm font-light mb-4">
              <AlertCircle className="w-4 h-4" />
              {waitlistError}
            </div>
          )}
          
          {waitlistSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-light mb-4">
              <Check className="w-4 h-4" />
              {waitlistSuccess}
            </div>
          )}
          
          {/* Join waitlist button */}
          <Button
            type="button"
            disabled={isJoiningWaitlist}
            onClick={(e) => {
              if (!email) {
                setWaitlistError("email is required")
                return
              }
              handleWaitlistSubmit(e)
            }}
            className="w-full h-12 rounded-lg font-light bg-foreground text-background hover:bg-foreground/90 mb-6"
          >
            {isJoiningWaitlist ? (
              <span className="animate-pulse">joining...</span>
            ) : (
              "Join waitlist"
            )}
          </Button>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground font-light">or</span>
            </div>
          </div>
          
          {/* Continue with Google */}
          <Button
            variant="outline"
            className="w-full h-12 rounded-lg font-light border-border"
            onClick={() => {/* Google auth would go here */}}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          {/* Already have access link */}
          <p className="text-center text-sm text-muted-foreground mt-8 font-light">
            Already have access?{" "}
            <button 
              onClick={() => setShowPasswordPage(true)}
              className="text-primary hover:underline"
            >
              Go to website
            </button>
          </p>
        </div>
      </div>
      
      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
