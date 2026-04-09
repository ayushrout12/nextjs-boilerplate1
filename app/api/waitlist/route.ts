import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "please enter a valid email" },
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
