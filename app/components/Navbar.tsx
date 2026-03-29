"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 34px",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 600,
          fontSize: "20px",
          color: "#6d5df6",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "20px" }}>🌸</span>
        lotus
      </Link>

      <div style={{ display: "flex", gap: "28px" }}>
        <Link href="/build" style={{ color: "#5e565b", textDecoration: "none" }}>
          build
        </Link>
        <Link href="/articles" style={{ color: "#5e565b", textDecoration: "none" }}>
          articles
        </Link>
        <Link href="/contact" style={{ color: "#5e565b", textDecoration: "none" }}>
          contact
        </Link>
      </div>
    </nav>
  );
}