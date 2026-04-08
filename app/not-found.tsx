"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to homepage
    router.replace("/")
  }, [router])

  // Show nothing while redirecting (or a brief loading state)
  return null
}
