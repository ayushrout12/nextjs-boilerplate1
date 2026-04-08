import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "you must be signed in to delete websites" },
        { status: 401 }
      )
    }
    
    const { error } = await supabase
      .from("saved_websites")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
    
    if (error) {
      console.error("[Lotus] Delete error:", error)
      return NextResponse.json(
        { error: "failed to delete website" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Lotus] Delete error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "you must be signed in" },
        { status: 401 }
      )
    }
    
    const { data, error } = await supabase
      .from("saved_websites")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: "website not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ website: data })
  } catch (error) {
    console.error("[Lotus] Get error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}
