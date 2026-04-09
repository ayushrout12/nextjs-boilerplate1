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
import { User, LogOut, FolderOpen, Sparkles } from "lucide-react"
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
      <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
    )
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="btn-pill text-xs px-4">
          <Link href="/builder">Get Started</Link>
        </Button>
      </>
    )
  }

  const displayName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split("@")[0] || 
                      "User"
  
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 gap-2">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
          )}
          <span className="hidden sm:inline text-xs">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/projects">
            <FolderOpen className="w-4 h-4 mr-2" />
            My Projects
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/builder">
            <Sparkles className="w-4 h-4 mr-2" />
            Builder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
