"use client"

import { useEffect } from "react"

/**
 * Recovers from transient ChunkLoadErrors that can occur after a deploy or dev
 * server restart, when the browser holds a stale reference to a chunk that no
 * longer exists. When detected, we reload the page once (guarded by sessionStorage
 * so we never get stuck in a reload loop) to pull the fresh build.
 */
export function ChunkErrorHandler() {
  useEffect(() => {
    const RELOAD_KEY = "chunk-reload-attempt"

    const isChunkError = (message?: string) =>
      !!message &&
      (message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to load chunk") ||
        message.includes("error loading dynamically imported module"))

    const handleAndMaybeReload = (message?: string) => {
      if (!isChunkError(message)) return
      // Only reload once per session to avoid infinite loops
      if (sessionStorage.getItem(RELOAD_KEY)) return
      sessionStorage.setItem(RELOAD_KEY, "1")
      window.location.reload()
    }

    const onError = (event: ErrorEvent) => {
      handleAndMaybeReload(event.message || event.error?.message)
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message = typeof reason === "string" ? reason : reason?.message
      handleAndMaybeReload(message)
    }

    // Clear the guard once a normal load succeeds so future stale chunks can recover
    const clearGuard = () => sessionStorage.removeItem(RELOAD_KEY)

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)
    window.addEventListener("load", clearGuard)

    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
      window.removeEventListener("load", clearGuard)
    }
  }, [])

  return null
}
