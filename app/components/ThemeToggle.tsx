"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="toggle theme"
    >
      <span
        className={`${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        } inline-block h-5 w-5 transform rounded-full bg-primary transition-transform duration-200 flex items-center justify-center text-xs`}
      >
        {theme === "dark" ? "🌙" : "🌸"}
      </span>
    </button>
  );
}
