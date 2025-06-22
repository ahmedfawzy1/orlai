import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('jwt');
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/wishlist') ||
    pathname.startsWith('/checkout')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (
    token &&
    (pathname === '/login' ||
      pathname === '/sign-up' ||
      pathname === '/forget_password')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/sign-up',
    '/forget_password',
    '/profile/:path*',
    '/wishlist',
    '/checkout/:path*',
    '/admin/:path*',
  ],
};
