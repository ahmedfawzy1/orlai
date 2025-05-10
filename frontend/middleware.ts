import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('jwt');

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  if (token && (pathname === '/login' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-up',
    '/login',
    '/admin/:path*',
    '/cart',
    '/wishlist',
    '/orders/:path*',
    '/checkout/:path*',
  ],
};
