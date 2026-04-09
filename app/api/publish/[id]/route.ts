import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// DELETE - Unpublish a site
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "please sign in to unpublish" },
        { status: 401 }
      )
    }

    // First verify the user owns this published site
    const { data: existing } = await supabase
      .from("published_sites")
      .select("id, user_id, subdomain")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: "published site not found" },
        { status: 404 }
      )
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "you can only unpublish your own sites" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from("published_sites")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("[Lotus] Unpublish error:", error)
      return NextResponse.json(
        { error: "failed to unpublish site" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${existing.subdomain}.trylotus.app has been unpublished`
    })

  } catch (error) {
    console.error("[Lotus] Unpublish error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}

// GET - Get a specific published site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "please sign in" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("published_sites")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "published site not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ site: data })

  } catch (error) {
    console.error("[Lotus] Fetch published site error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}
