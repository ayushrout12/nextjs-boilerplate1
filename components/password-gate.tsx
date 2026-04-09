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

    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setIsAuthenticated(true)
      } else {
        setError("Incorrect password")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              src="/lotus-icon.jpg"
              alt="Lotus"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Lotus
          </h1>
          <p className="text-muted-foreground">
            Enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            placeholder="Password"
            className="h-12 rounded-xl bg-secondary border-0 text-center text-lg tracking-widest placeholder:tracking-normal"
            autoFocus
            autoComplete="off"
            disabled={isLoading}
          />

          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!password || isLoading}
            className="w-full h-12 btn-pill text-base font-medium"
          >
            {isLoading ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          This site is currently in private beta
        </p>
      </div>
    </div>
  )
}
