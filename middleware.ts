import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Check if this is a subdomain request on lotus.app
  // e.g., xyz.lotus.app or xyz.trylotus.app (legacy)
  const isSubdomainRequest = 
    hostname.endsWith('.lotus.app') || 
    hostname.endsWith('.trylotus.app') || 
    hostname.endsWith('.trylotus.dev') ||
    // Local testing with subdomains
    (hostname.includes('.localhost') && !hostname.startsWith('www.'))

  if (isSubdomainRequest) {
    // Extract subdomain
    const subdomain = hostname.split('.')[0]
    
    // Skip if it's www or empty
    if (!subdomain || subdomain === 'www') {
      return NextResponse.next()
    }

    // Rewrite to the serve API route
    url.pathname = `/api/serve/${subdomain}`
    return NextResponse.rewrite(url)
  }

  // For main domain, continue with normal session handling
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
