"use client"

import { useState } from "react"

export default function PasswordGate({ children }: any) {

  const [entered, setEntered] = useState(false)
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (password === "lotuspreview") {
      setEntered(true)
    } else {
      alert("incorrect password")
    }
  }

  if (!entered) {
    return (
      <div className="gate">
        <h1>Lotus Preview</h1>

        <input
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          enter
        </button>
      </div>
    )
  }

  return children
}