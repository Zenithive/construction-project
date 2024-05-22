import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('tokenId')?.value
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