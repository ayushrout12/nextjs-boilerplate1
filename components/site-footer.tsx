import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/30 bg-background/50 backdrop-blur-xl">
      <div className="container py-14 md:py-18">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden lotus-glow-sm">
              <Image 
                src="/lotus-icon.jpg" 
                alt="lotus" 
                width={40} 
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-serif font-normal tracking-wide text-gradient-lotus">lotus</span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors font-light tracking-wide">
              features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors font-light tracking-wide">
              how it works
            </Link>
            <Link href="/builder" className="hover:text-foreground transition-colors font-light tracking-wide">
              builder
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors font-light tracking-wide">
              sign in
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground font-light tracking-wide">
            &copy; {new Date().getFullYear()} lotus. crafted with care.
          </p>
        </div>
      </div>
    </footer>
  )
}
