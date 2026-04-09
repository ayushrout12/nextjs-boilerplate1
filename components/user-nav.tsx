"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, FolderOpen, Settings } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-xl bg-card/50 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild className="rounded-xl font-light tracking-wide">
          <Link href="/auth/login">sign in</Link>
        </Button>
        <Button size="sm" asChild className="rounded-xl bg-primary hover:bg-primary/90 font-light tracking-wide">
          <Link href="/auth/sign-up">begin creating</Link>
        </Button>
      </>
    )
  }

  // Get user display name from metadata or email
  const displayName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split("@")[0] || 
                      "user"
  
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-xl h-10 px-3 gap-2 font-light tracking-wide hover:bg-card/50">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={28}
              height={28}
              className="rounded-lg"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
          <span className="hidden sm:inline text-sm">{displayName.toLowerCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/30 bg-card/95 backdrop-blur-xl">
        <div className="px-3 py-2">
          <p className="text-sm font-light tracking-wide">{displayName.toLowerCase()}</p>
          <p className="text-xs text-muted-foreground font-light">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border/30" />
        <DropdownMenuItem asChild className="cursor-pointer font-light tracking-wide">
          <Link href="/projects">
            <FolderOpen className="w-4 h-4 mr-2" />
            my projects
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer font-light tracking-wide">
          <Link href="/builder">
            <Settings className="w-4 h-4 mr-2" />
            builder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/30" />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer font-light tracking-wide text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
