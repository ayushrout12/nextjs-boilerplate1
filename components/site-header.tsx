"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { Moon, Sun } from "lucide-react"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl overflow-hidden lotus-glow-sm animate-petal">
            <Image 
              src="/lotus-icon.jpg" 
              alt="lotus" 
              width={40} 
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-serif tracking-wide text-gradient-lotus">lotus</span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide">
            features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide">
            how it works
          </Link>
          <Link href="/builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide">
            builder
          </Link>
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light tracking-wide">
            projects
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-xl"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
