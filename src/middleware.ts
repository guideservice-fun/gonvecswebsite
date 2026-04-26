import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-Frame-Options', 'DENY');
  requestHeaders.set('X-Content-Type-Options', 'nosniff');
  requestHeaders.set('X-XSS-Protection', '1; mode=block');
  requestHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
