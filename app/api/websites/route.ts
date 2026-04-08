import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "you must be signed in to save websites" },
        { status: 401 }
      )
    }
    
    const { title, prompt, html_content } = await request.json()
    
    if (!html_content) {
      return NextResponse.json(
        { error: "no website content to save" },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from("saved_websites")
      .insert({
        user_id: user.id,
        title: title || "untitled website",
        prompt: prompt || "",
        html_content,
      })
      .select()
      .single()
    
    if (error) {
      console.error("[Lotus] Save error:", error)
      return NextResponse.json(
        { error: "failed to save website" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ website: data })
  } catch (error) {
    console.error("[Lotus] Save error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "you must be signed in to view saved websites" },
        { status: 401 }
      )
    }
    
    const { data, error } = await supabase
      .from("saved_websites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("[Lotus] Fetch error:", error)
      return NextResponse.json(
        { error: "failed to fetch websites" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ websites: data })
  } catch (error) {
    console.error("[Lotus] Fetch error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}
