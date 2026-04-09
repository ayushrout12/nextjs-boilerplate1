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
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container-wide relative flex h-12 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image 
              src="/lotus-icon.jpg" 
              alt="Lotus" 
              width={32} 
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-base font-semibold tracking-tight">Lotus</span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link href="/builder" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Builder
          </Link>
          <Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full"
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
