"use client"

import { useState } from "react"

export default function BuilderClient() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  function generate() {
    if (!prompt) return
    setLoading(true)

    setTimeout(() => {
      alert("AI generation coming soon 🚀")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <textarea
        className="w-full h-48 p-4 bg-black border border-gray-700 rounded-lg text-white"
        placeholder="Describe the website you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-4 px-6 py-2 bg-white text-black rounded-lg"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  )
}
