"use client"

import Navbar from "./components/Navbar";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        🌸 lotus
      </div>

      <div className="nav-right">
        <Link href="/">build</Link>
        <Link href="/articles">articles</Link>
        <Link href="/contact">contact</Link>
      </div>
    </nav>
  )
}
