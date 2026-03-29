"use client"

import { useState } from "react"

export default function Preview() {
  const [password, setPassword] = useState("")
  const [access, setAccess] = useState(false)

  function checkPassword() {
    if (password === "lotuspreview") {
      setAccess(true)
    } else {
      alert("Incorrect password")
    }
  }

  if (access) {
    return <h1 className="text-center mt-40 text-3xl">Preview Access Granted</h1>
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <input
        type="password"
        placeholder="Enter password"
        className="border px-4 py-2 rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={checkPassword}
        className="mt-4 px-6 py-2 bg-black text-white rounded-lg"
      >
        Enter
      </button>
    </div>
  )
}
