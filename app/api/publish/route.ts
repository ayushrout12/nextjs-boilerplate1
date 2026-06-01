import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// The root domain published sites live on (e.g. lotus.app => xyz.lotus.app)
const PUBLISH_DOMAIN = process.env.NEXT_PUBLIC_PUBLISH_DOMAIN || "lotus.app"

// Set to "true" only once the wildcard domain (*.PUBLISH_DOMAIN) is verified on
// Vercel. Until then, the path-based URL (origin/s/<name>) is the one that works.
const WILDCARD_READY = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN_READY === "true"

// Build the live URLs for a published site.
function buildUrls(request: NextRequest, subdomainLower: string) {
  const subdomainUrl = `https://${subdomainLower}.${PUBLISH_DOMAIN}`

  // Derive the current origin so the path fallback works on any deployment
  // (preview, production, or a custom domain) without hardcoding.
  const host = request.headers.get("host") || ""
  const proto = request.headers.get("x-forwarded-proto") || "https"
  const origin = host ? `${proto}://${host}` : ""
  const pathUrl = origin ? `${origin}/s/${subdomainLower}` : `/s/${subdomainLower}`

  return {
    subdomainUrl,
    pathUrl,
    // The URL we tell the user to use right now
    url: WILDCARD_READY ? subdomainUrl : pathUrl,
  }
}

// Reserved subdomains that cannot be used
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'app', 'admin', 'dashboard', 'builder', 
  'auth', 'login', 'signup', 'register', 'account', 
  'help', 'support', 'docs', 'blog', 'mail', 'email',
  'lotus', 'trylotus', 'test', 'staging', 'dev', 'prod'
]

// POST - Publish a website to a subdomain
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "please sign in to publish" },
        { status: 401 }
      )
    }

    const { subdomain, title, html_content, website_id } = await request.json()

    if (!subdomain || !html_content) {
      return NextResponse.json(
        { error: "subdomain and html content are required" },
        { status: 400 }
      )
    }

    // Validate subdomain format
    const subdomainLower = subdomain.toLowerCase().trim()
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/
    
    if (!subdomainRegex.test(subdomainLower)) {
      return NextResponse.json(
        { error: "subdomain can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 }
      )
    }

    if (subdomainLower.length < 3) {
      return NextResponse.json(
        { error: "subdomain must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (RESERVED_SUBDOMAINS.includes(subdomainLower)) {
      return NextResponse.json(
        { error: "this subdomain is reserved" },
        { status: 400 }
      )
    }

    // Check if subdomain is already taken by another user
    const { data: existing } = await supabase
      .from("published_sites")
      .select("id, user_id")
      .eq("subdomain", subdomainLower)
      .single()

    if (existing && existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "this subdomain is already taken" },
        { status: 409 }
      )
    }

    // If user already has this subdomain, update it
    if (existing && existing.user_id === user.id) {
      const { data, error } = await supabase
        .from("published_sites")
        .update({
          title: title || subdomainLower,
          html_content,
          website_id: website_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) {
        console.error("[Lotus] Publish update error:", error)
        return NextResponse.json(
          { error: "failed to update published site" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        site: data,
        ...buildUrls(request, subdomainLower),
        message: "site updated successfully"
      })
    }

    // Create new published site
    const { data, error } = await supabase
      .from("published_sites")
      .insert({
        subdomain: subdomainLower,
        user_id: user.id,
        title: title || subdomainLower,
        html_content,
        website_id: website_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[Lotus] Publish error:", error)
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: "this subdomain is already taken" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "failed to publish site" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      site: data,
      ...buildUrls(request, subdomainLower),
      message: "site published successfully"
    })

  } catch (error) {
    console.error("[Lotus] Publish error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}

// GET - Get user's published sites
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "please sign in to view published sites" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("published_sites")
      .select("id, subdomain, title, website_id, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Lotus] Fetch published sites error:", error)
      return NextResponse.json(
        { error: "failed to fetch published sites" },
        { status: 500 }
      )
    }

    return NextResponse.json({ sites: data || [] })

  } catch (error) {
    console.error("[Lotus] Fetch published sites error:", error)
    return NextResponse.json(
      { error: "an unexpected error occurred" },
      { status: 500 }
    )
  }
}
