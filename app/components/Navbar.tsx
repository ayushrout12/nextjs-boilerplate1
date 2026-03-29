"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-5 border-b">
      <div className="flex items-center gap-2 text-xl font-semibold">
        🌸 Lotus
      </div>

      <div className="flex gap-8 text-sm">
        <Link href="/">Home</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  )
}
