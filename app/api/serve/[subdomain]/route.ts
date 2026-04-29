import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const { subdomain } = await params

  if (!subdomain) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Create Supabase client dynamically (not at module level to avoid build errors)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from("published_sites")
    .select("html_content, title")
    .eq("subdomain", subdomain.toLowerCase())
    .single()

  if (error || !data) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>site not found — lotus</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #fafafa;
      font-family: 'Cormorant Garamond', Georgia, serif;
      text-align: center;
      padding: 2rem;
    }
    .container { max-width: 400px; }
    h1 { font-size: 3rem; font-weight: 300; margin-bottom: 1rem; color: #e8a0a0; }
    p { font-size: 1.1rem; color: #888; font-weight: 300; margin-bottom: 2rem; }
    a {
      color: #e8a0a0;
      text-decoration: none;
      border-bottom: 1px solid #e8a0a0;
      padding-bottom: 2px;
      transition: opacity 0.3s;
    }
    a:hover { opacity: 0.7; }
  </style>
</head>
<body>
  <div class="container">
    <h1>oops</h1>
    <p>this site doesn't exist yet. maybe it's waiting to bloom?</p>
    <a href="https://lotus.app">create your own with lotus</a>
  </div>
</body>
</html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    )
  }

  return new NextResponse(data.html_content, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}
