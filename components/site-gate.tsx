"use client"

import { useState } from "react"

const ACCESS_PASSWORD = "Ayush@2012USA"

export function SiteGate({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ACCESS_PASSWORD) {
      setHasAccess(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <p className="text-black text-2xl font-medium">
          This Site Is Currently Unavailable
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="Enter password"
            className="px-4 py-2 border border-gray-300 rounded-lg text-black text-center focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Enter
          </button>
          {error && (
            <p className="text-red-500 text-sm">Incorrect password</p>
          )}
        </form>
      </div>
    )
  }

  return <>{children}</>
}
