"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { 
  Loader2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Code,
  Sparkles,
  LogOut
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface SavedWebsite {
  id: string
  title: string
  prompt: string
  html_content: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [websites, setWebsites] = useState<SavedWebsite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      setUser(user)
      fetchWebsites()
    }

    loadData()
  }, [router, supabase])

  const fetchWebsites = async () => {
    try {
      const response = await fetch("/api/websites")
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "failed to load websites")
        return
      }
      
      setWebsites(data.websites || [])
    } catch {
      setError("failed to load websites")
    } finally {
      setLoading(false)
    }
  }

  const deleteWebsite = async (id: string) => {
    if (deleting) return
    
    setDeleting(id)
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setWebsites(websites.filter(w => w.id !== id))
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(null)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 animate-pulse">
          <Image 
            src="/lotus-icon.jpg" 
            alt="lotus" 
            width={64} 
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto">
          {/* header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide mb-2">
                your garden
              </h1>
              <p className="text-muted-foreground font-light tracking-wide">
                welcome back, {user?.email?.split("@")[0]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild className="rounded-2xl">
                <Link href="/builder">
                  <Plus className="w-4 h-4 mr-2" />
                  create new
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-xl font-light tracking-wide">
                <LogOut className="w-4 h-4 mr-2" />
                sign out
              </Button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-light tracking-wide mb-6">{error}</p>
              <Button onClick={fetchWebsites} className="rounded-2xl">try again</Button>
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-3xl overflow-hidden mx-auto mb-8 opacity-30 animate-float">
                <Image 
                  src="/lotus-icon.jpg" 
                  alt="lotus" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground font-light tracking-wide mb-2">your garden is empty</p>
              <p className="text-sm text-muted-foreground/70 font-light tracking-wide mb-8">
                create your first website and save it here
              </p>
              <Button asChild className="rounded-2xl">
                <Link href="/builder">
                  <Plus className="w-4 h-4 mr-2" />
                  create website
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {websites.map((website) => (
                <Card 
                  key={website.id} 
                  className="bg-card/50 backdrop-blur-xl border-border/30 hover:border-primary/30 transition-all duration-500 rounded-2xl overflow-hidden group"
                >
                  {/* preview thumbnail */}
                  <div className="relative h-48 bg-muted/30 overflow-hidden">
                    <iframe
                      srcDoc={website.html_content}
                      className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none"
                      title={website.title}
                      sandbox=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-xl font-light tracking-wide"
                        onClick={() => {
                          const win = window.open("", "_blank")
                          if (win) {
                            win.document.write(website.html_content)
                            win.document.close()
                          }
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        preview
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-serif font-normal tracking-wide line-clamp-1">
                        {website.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 rounded-xl h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteWebsite(website.id)}
                        disabled={deleting === website.id}
                      >
                        {deleting === website.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {website.prompt && (
                      <p className="text-sm text-muted-foreground font-light tracking-wide line-clamp-2 mb-4">
                        {website.prompt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1.5 font-light tracking-wide">
                        <Calendar className="w-3 h-3" />
                        {formatDate(website.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5 font-light tracking-wide">
                        <Code className="w-3 h-3" />
                        html
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* bio footer */}
      <footer className="border-t border-border/30 bg-background/50 backdrop-blur-xl py-10">
        <div className="container max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-serif font-normal tracking-wide">crafted by ayush rout</span>
          </div>
          <p className="text-sm text-muted-foreground font-light tracking-wide leading-relaxed">
            a passionate 14 year old who loves to vibe code with the help of ai and turn things into unimaginable results. 
            three apps published on the app store. coding since age seven. if you can dream it, you can build it.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-4 font-light tracking-widest">— signed a.r.</p>
        </div>
      </footer>
    </div>
  )
}
