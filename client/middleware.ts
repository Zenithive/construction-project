import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // console.log("request", request)
  const currentUser = request.cookies.get('tokenId')?.value
  // //console.log("request.cookies", request)
  // if (currentUser && !request.nextUrl.pathname.startsWith('/*')) {
  //   return Response.redirect(new URL('/*', request.url))
  // }
 
  if (!currentUser && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup')) {
    return Response.redirect(new URL('/login', request.url))
  }

  //return Response.next();
}

export const config = {
  matcher: ['/((?!_next|api/auth).*)(.+)'],
}