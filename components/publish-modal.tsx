"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Globe, Loader2, Check, X, ExternalLink, Copy } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

const PUBLISH_DOMAIN = process.env.NEXT_PUBLIC_PUBLISH_DOMAIN || "lotus.app"
const WILDCARD_READY = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN_READY === "true"

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  htmlContent: string
  title?: string
  websiteId?: string
}

export function PublishModal({ 
  open, 
  onOpenChange, 
  htmlContent, 
  title,
  websiteId 
}: PublishModalProps) {
  const [subdomain, setSubdomain] = useState("")
  const [checking, setChecking] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [availability, setAvailability] = useState<{
    available: boolean
    owned?: boolean
    reason: string
  } | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const debouncedSubdomain = useDebounce(subdomain, 500)

  const checkAvailability = useCallback(async (sub: string) => {
    if (!sub || sub.length < 3) {
      setAvailability(null)
      return
    }

    setChecking(true)
    try {
      const response = await fetch(`/api/publish/check?subdomain=${encodeURIComponent(sub)}`)
      const data = await response.json()
      setAvailability(data)
    } catch {
      setAvailability({ available: false, reason: "failed to check availability" })
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedSubdomain) {
      checkAvailability(debouncedSubdomain)
    } else {
      setAvailability(null)
    }
  }, [debouncedSubdomain, checkAvailability])

  const handlePublish = async () => {
    if (!subdomain || !availability?.available) return

    setPublishing(true)
    setError(null)

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase().trim(),
          title: title || subdomain,
          html_content: htmlContent,
          website_id: websiteId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "failed to publish")
        return
      }

      setPublishedUrl(data.url)
    } catch {
      setError("an unexpected error occurred")
    } finally {
      setPublishing(false)
    }
  }

  const copyUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setSubdomain("")
    setAvailability(null)
    setPublishedUrl(null)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 rounded-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-medium text-white flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-rose-400" />
            </div>
            Publish to the Web
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm">
            Share your website with the world
          </DialogDescription>
        </DialogHeader>

        {publishedUrl ? (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-lg font-medium text-white">Your site is live!</p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <Globe className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <span className="text-sm text-zinc-300 truncate flex-1">
                {publishedUrl}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg flex-shrink-0 text-zinc-500 hover:text-zinc-300"
                onClick={copyUrl}
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-lg text-sm border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                onClick={handleClose}
              >
                Done
              </Button>
              <Button
                className="flex-1 rounded-lg text-sm bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                onClick={() => window.open(publishedUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm text-zinc-400">
                Choose your subdomain
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={subdomain}
                    onChange={(e) => {
                      setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                      setError(null)
                    }}
                    placeholder="mysite"
                    className="pr-10 rounded-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-rose-500/50 focus:border-rose-500/50"
                    disabled={publishing}
                  />
                  {checking && (
                    <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-500" />
                  )}
                  {!checking && availability && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {availability.available ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                <span className="text-sm text-zinc-500">.{PUBLISH_DOMAIN}</span>
              </div>

              {availability && (
                <p className={`text-xs ${
                  availability.available ? "text-green-400" : "text-red-400"
                }`}>
                  {availability.reason}
                </p>
              )}

              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}
            </div>

            <Button
              onClick={handlePublish}
              disabled={!subdomain || !availability?.available || publishing}
              className="w-full rounded-lg h-11 text-sm bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish Site
                </>
              )}
            </Button>

            <p className="text-xs text-center text-zinc-600">
              {WILDCARD_READY
                ? `Your site will be live at ${subdomain || "yoursite"}.${PUBLISH_DOMAIN}`
                : `Your site will be live and shareable with anyone worldwide`}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
