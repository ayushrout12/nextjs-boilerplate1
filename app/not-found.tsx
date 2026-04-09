"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to homepage (password gate)
    router.replace("/")
  }, [router])

  // Show lotus loading while redirecting - matches site aesthetic
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 rounded-2xl overflow-hidden animate-pulse">
        <Image
          src="/lotus-icon.jpg"
          alt="lotus"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-muted-foreground font-light tracking-widest text-sm lowercase">
        redirecting...
      </p>
    </div>
  )
}
