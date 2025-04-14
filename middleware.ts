import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value
  const url = request.nextUrl.clone()

  // Block unauthenticated access to /dashboard or its subroutes
  if (!userId && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from login/register
  if (userId && (url.pathname === '/login' || url.pathname === '/register')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Define which routes middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
