import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Allowed email domains
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "sbcglobal.net",
  "outlook.com",
  "live.com",
]

function isValidEmail(email: string): { valid: boolean; reason?: string } {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "please enter a valid email address" }
  }
  
  // Extract domain
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain) {
    return { valid: false, reason: "please enter a valid email address" }
  }
  
  // Check if domain is allowed
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return { valid: false, reason: "please use a common email provider (Gmail, Yahoo, iCloud, Hotmail, etc.)" }
  }
  
  return { valid: true }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: "please enter an email address" },
        { status: 400 }
      )
    }
    
    const validation = isValidEmail(email)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Try to insert the email
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim() })
    
    if (error) {
      // Check if it's a duplicate
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "already_registered", message: "you're already on the waitlist!" },
          { status: 409 }
        )
      }
      
      console.error("Waitlist error:", error)
      return NextResponse.json(
        { error: "failed to join waitlist" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "you're on the list!" })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    )
  }
}
