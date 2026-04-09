import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const RESERVED_SUBDOMAINS = [
  'www', 'api', 'app', 'admin', 'dashboard', 'builder', 
  'auth', 'login', 'signup', 'register', 'account', 
  'help', 'support', 'docs', 'blog', 'mail', 'email',
  'lotus', 'trylotus', 'test', 'staging', 'dev', 'prod'
]

// GET - Check if a subdomain is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subdomain = searchParams.get("subdomain")

    if (!subdomain) {
      return NextResponse.json(
        { error: "subdomain parameter is required" },
        { status: 400 }
      )
    }

    const subdomainLower = subdomain.toLowerCase().trim()
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/

    if (!subdomainRegex.test(subdomainLower)) {
      return NextResponse.json({
        available: false,
        reason: "invalid format - use only lowercase letters, numbers, and hyphens"
      })
    }

    if (subdomainLower.length < 3) {
      return NextResponse.json({
        available: false,
        reason: "must be at least 3 characters"
      })
    }

    if (RESERVED_SUBDOMAINS.includes(subdomainLower)) {
      return NextResponse.json({
        available: false,
        reason: "this subdomain is reserved"
      })
    }

    const supabase = await createClient()
    
    // Check if current user owns this subdomain
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: existing } = await supabase
      .from("published_sites")
      .select("id, user_id")
      .eq("subdomain", subdomainLower)
      .single()

    if (existing) {
      if (user && existing.user_id === user.id) {
        return NextResponse.json({
          available: true,
          owned: true,
          reason: "you already own this subdomain"
        })
      }
      return NextResponse.json({
        available: false,
        reason: "this subdomain is already taken"
      })
    }

    return NextResponse.json({
      available: true,
      reason: "subdomain is available"
    })

  } catch (error) {
    console.error("[Lotus] Check subdomain error:", error)
    return NextResponse.json(
      { error: "failed to check subdomain availability" },
      { status: 500 }
    )
  }
}
