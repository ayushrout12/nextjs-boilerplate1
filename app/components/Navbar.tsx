"use client";

import Link from "next/link";

export default function Navbar() {
  const navLink: React.CSSProperties = {
    color: "#5f5863",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
  };

  return (
    <nav
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#6d5df6",
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        <span style={{ fontSize: "20px" }}>🌸</span>
        lotus
      </Link>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        <Link href="/build" style={navLink}>build</Link>
        <Link href="/articles" style={navLink}>articles</Link>
        <Link href="/contact" style={navLink}>contact</Link>
      </div>
    </nav>
  );
}
