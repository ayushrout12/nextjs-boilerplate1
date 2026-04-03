"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-2xl">🌸</span>
          <span className="font-semibold lowercase tracking-tight">trylotus.dev</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition lowercase">build</Link>
            <Link href="/articles" className="text-sm font-medium hover:text-primary transition lowercase">articles</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition lowercase">contact</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
