import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, verifySessionValue } from '@/lib/server-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/dashboard/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const isAuthenticated = verifySessionValue(
      request.cookies.get(AUTH_COOKIE)?.value
    );

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
