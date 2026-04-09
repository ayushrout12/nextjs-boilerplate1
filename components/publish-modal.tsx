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
      <DialogContent className="sm:max-w-md bg-card border-border/30 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-serif font-normal tracking-wide flex items-center justify-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            publish to the web
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light tracking-wide">
            share your creation with the world
          </DialogDescription>
        </DialogHeader>

        {publishedUrl ? (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-serif font-normal tracking-wide">your site is live!</p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-xl border border-border/30">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-light tracking-wide truncate flex-1">
                {publishedUrl}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg flex-shrink-0"
                onClick={copyUrl}
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-light tracking-wide"
                onClick={handleClose}
              >
                done
              </Button>
              <Button
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-light tracking-wide"
                onClick={() => window.open(publishedUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                visit site
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-light tracking-wide text-muted-foreground">
                choose your subdomain
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
                    className="pr-10 rounded-xl bg-background/50 border-border/30 font-light tracking-wide"
                    disabled={publishing}
                  />
                  {checking && (
                    <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                  {!checking && availability && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {availability.available ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground font-light">.trylotus.app</span>
              </div>

              {availability && (
                <p className={`text-xs font-light tracking-wide ${
                  availability.available ? "text-green-500" : "text-destructive"
                }`}>
                  {availability.reason}
                </p>
              )}

              {error && (
                <p className="text-xs font-light tracking-wide text-destructive">
                  {error}
                </p>
              )}
            </div>

            <Button
              onClick={handlePublish}
              disabled={!subdomain || !availability?.available || publishing}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 font-light tracking-wide h-12"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  publish site
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground/70 font-light tracking-wide">
              your site will be live at {subdomain || "yoursite"}.trylotus.app
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
