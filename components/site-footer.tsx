import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image 
                src="/lotus-icon.jpg" 
                alt="Lotus" 
                width={32} 
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base font-semibold">Lotus</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="/builder" className="hover:text-foreground transition-colors">
              Builder
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lotus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
