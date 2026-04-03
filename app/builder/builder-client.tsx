"use client"

import { useSearchParams } from "next/navigation"

export default function BuilderClient() {
  const searchParams = useSearchParams()
  const prompt = searchParams.get("prompt")

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">

      <h1 className="text-4xl font-bold mb-6">
        Lotus Builder
      </h1>

      {prompt ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-xl w-full">
          <p className="text-zinc-400 mb-2">Prompt:</p>
          <p className="text-lg">{prompt}</p>
        </div>
      ) : (
        <p className="text-zinc-400">
          Describe what you want to build from the homepage.
        </p>
      )}

    </div>
  )
}
