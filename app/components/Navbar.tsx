"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      padding:"20px 40px"
    }}>
      
      <Link href="/" style={{fontWeight:600}}>
        trylotus
      </Link>

      <div style={{display:"flex", gap:"24px"}}>
        <Link href="/build">build</Link>
        <Link href="/articles">articles</Link>
        <Link href="/contact">contact</Link>
      </div>

    </nav>
  )
}
