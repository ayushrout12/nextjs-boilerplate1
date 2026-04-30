"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BuilderClient from "./builder-client"

// 🔒 TOGGLE THIS (must match layout.tsx)
const SITE_LIVE = false

export default function Page() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const accessGranted = localStorage.getItem("lotus_access_granted") === "true"
    if (!SITE_LIVE && !accessGranted) {
      router.push("/")
      return
    }
    setHasAccess(true)
    setIsLoading(false)
  }, [router])

  if (isLoading || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          Loading Builder...
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  )
}
