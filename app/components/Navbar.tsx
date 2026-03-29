"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px"
      }}
    >
      
      {/* logo + brand */}
     <Link
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    fontSize: "20px",
    color: "#7c6cff",
    textDecoration: "none"
  }}
>
  <span style={{ fontSize: "22px" }}>🌸</span>
  lotus
</Link>

      {/* navigation */}
      <div style={{display:"flex", gap:"24px"}}>
        <Link href="/build">build</Link>
        <Link href="/articles">articles</Link>
        <Link href="/contact">contact</Link>
      </div>

    </nav>
  )
}
