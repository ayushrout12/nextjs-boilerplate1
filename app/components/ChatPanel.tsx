"use client"

import { useState } from "react"

export default function ChatPanel({ onGenerate }) {
  const [input, setInput] = useState("")

  return (
    <div className="w-1/2 h-screen p-4 bg-zinc-900 text-white">
      <textarea
        className="w-full p-3 rounded bg-zinc-800"
        placeholder="Describe your app..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-white text-black rounded"
        onClick={() => onGenerate(input)}
      >
        Generate
      </button>
    </div>
  )
}
