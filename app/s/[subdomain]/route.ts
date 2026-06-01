import { NextRequest } from "next/server"
import { servePublishedSite } from "@/lib/serve-site"

// Path-based fallback so published sites are viewable worldwide
// at <your-app-domain>/s/<name> even before a wildcard domain
// like *.lotus.app is configured on Vercel.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> },
) {
  const { subdomain } = await params
  return servePublishedSite(subdomain)
}
