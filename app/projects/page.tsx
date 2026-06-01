"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Code,
  Calendar,
  Sparkles,
  Globe
} from "lucide-react"
import { PublishModal } from "@/components/publish-modal"
import type { User } from "@supabase/supabase-js"

interface SavedWebsite {
  id: string
  title: string
  prompt: string
  html_content: string
  created_at: string
  updated_at: string
}

interface PublishedSite {
  id: string
  subdomain: string
  website_id: string | null
}

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [websites, setWebsites] = useState<SavedWebsite[]>([])
  const [publishedSites, setPublishedSites] = useState<PublishedSite[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState<SavedWebsite | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      setUser(user)
      
      const { data, error } = await supabase
        .from("saved_websites")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (!error && data) {
        setWebsites(data)
      }
      
      // Fetch published sites
      const { data: publishedData } = await supabase
        .from("published_sites")
        .select("id, subdomain, website_id")
      
      if (publishedData) {
        setPublishedSites(publishedData)
      }
      
      setLoading(false)
    }
    
    init()
  }, [supabase, router])

  const deleteWebsite = async (id: string) => {
    setDeleting(id)
    
    const { error } = await supabase
      .from("saved_websites")
      .delete()
      .eq("id", id)
    
    if (!error) {
      setWebsites(websites.filter(w => w.id !== id))
    }
    
    setDeleting(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).toLowerCase()
  }

  const getPublishedUrl = (websiteId: string) => {
    const published = publishedSites.find(p => p.website_id === websiteId)
    if (!published) return null
    const domain = process.env.NEXT_PUBLIC_PUBLISH_DOMAIN || "lotus.app"
    const wildcardReady = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN_READY === "true"
    // Use the subdomain URL once the wildcard domain is live; otherwise use the
    // path-based fallback on the current origin so the link always works.
    if (wildcardReady) return `https://${published.subdomain}.${domain}`
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}/s/${published.subdomain}`
  }

  const openPublishModal = (website: SavedWebsite) => {
    setSelectedWebsite(website)
    setPublishModalOpen(true)
  }

  // Get user display name
  const displayName = user?.user_metadata?.full_name || 
                      user?.user_metadata?.name || 
                      user?.email?.split("@")[0] || 
                      "user"

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden lotus-glow animate-petal">
            <Image
              src="/lotus-icon.jpg"
              alt="lotus"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-muted-foreground font-light tracking-wide animate-pulse">loading your garden...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    {selectedWebsite && (
      <PublishModal
        open={publishModalOpen}
        onOpenChange={(open) => {
          setPublishModalOpen(open)
          if (!open) setSelectedWebsite(null)
        }}
        htmlContent={selectedWebsite.html_content}
        title={selectedWebsite.title}
        websiteId={selectedWebsite.id}
      />
    )}
    <div className="min-h-screen bg-background lotus-gradient">
      <SiteHeader />
      
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.12_350_/_0.06),transparent)]" />
      </div>

      <main className="container py-12 md:py-20 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-wide mb-4">
            {displayName.toLowerCase()}&apos;s garden
          </h1>
          <p className="text-muted-foreground font-light tracking-wide text-lg max-w-md mx-auto">
            your collection of bloomed creations
          </p>
        </div>

        {/* Projects Grid */}
        {websites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-serif font-normal tracking-wide mb-3">
              no projects yet
            </h3>
            <p className="text-muted-foreground font-light tracking-wide mb-8 max-w-sm mx-auto">
              start creating beautiful websites with lotus and they&apos;ll appear here
            </p>
            <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 font-light tracking-wide h-12 px-8">
              <Link href="/builder">
                <Plus className="w-4 h-4 mr-2" />
                create your first project
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-8">
              <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 font-light tracking-wide">
                <Link href="/builder">
                  <Plus className="w-4 h-4 mr-2" />
                  new project
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="group relative bg-card/50 backdrop-blur-xl border border-border/30 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
                  onMouseEnter={() => setPreviewId(website.id)}
                  onMouseLeave={() => setPreviewId(null)}
                >
                  {/* Preview */}
                  <div className="aspect-video bg-background/50 relative overflow-hidden">
                    {previewId === website.id ? (
                      <iframe
                        srcDoc={website.html_content}
                        className="w-full h-full border-0 pointer-events-none"
                        title={website.title}
                        sandbox="allow-scripts"
                        style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Code className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif font-normal tracking-wide mb-2 truncate">
                      {website.title.toLowerCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light tracking-wide line-clamp-2 mb-4">
                      {website.prompt.toLowerCase()}
                    </p>
                    
                    {/* Published status */}
                    {getPublishedUrl(website.id) && (
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <Globe className="w-3 h-3 text-green-500" />
                        <a 
                          href={getPublishedUrl(website.id)!} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline font-light tracking-wide truncate"
                        >
                          {getPublishedUrl(website.id)!.replace("https://", "")}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 font-light tracking-wide">
                        <Calendar className="w-3 h-3" />
                        {formatDate(website.created_at)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPublishModal(website)}
                          className="h-8 rounded-lg text-muted-foreground hover:text-primary font-light tracking-wide text-xs"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {getPublishedUrl(website.id) ? "update" : "publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWebsite(website.id)}
                          disabled={deleting === website.id}
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          {deleting === website.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                        >
                          <Link href={`/builder?project=${website.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer bio */}
        <div className="mt-20 pt-12 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/50 font-light tracking-wide max-w-lg mx-auto leading-relaxed">
            crafted by ayush rout — a passionate 14 year old who loves to vibe code with ai. 
            three apps on the app store. coding since age seven. 
            if you can dream it, you can build it. — signed a.r.
          </p>
        </div>
      </main>
    </div>
    </>
  )
}
