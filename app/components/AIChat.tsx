"use client"

import { useState } from "react"

export default function AIChat() {

  const [prompt,setPrompt] = useState("")

  async function handleSubmit(){

    const res = await fetch("/api/chat",{
      method:"POST",
      body: JSON.stringify({prompt})
    })

    const data = await res.json()

    console.log(data)
  }

  return (
    <div className="chat-container">

      <textarea
        placeholder="describe what you want to build..."
        className="chat-input"
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
      />

      <button
        className="chat-button"
        onClick={handleSubmit}
      >
        Generate Site
      </button>

    </div>
  )
}
