"use client"

import { useSearchParams } from "next/navigation"

export default function BuilderPage() {
  const searchParams = useSearchParams()

  const prompt = searchParams.get("prompt")

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-6">
        Lotus Builder
      </h1>

      {prompt ? (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 max-w-xl w-full">
          <p className="text-zinc-400 mb-2">Your prompt:</p>
          <p className="text-white text-lg">{prompt}</p>
        </div>
      ) : (
        <p className="text-zinc-400">
          No prompt provided.
        </p>
      )}

    </div>
  )
}
