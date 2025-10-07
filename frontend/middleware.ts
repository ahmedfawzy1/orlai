import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Check if user is authenticated
    const isAuthenticated = !!token;

    // Check if user is admin
    const isAdmin = token?.role === 'admin';

    // Define protected routes
    const isProtectedRoute =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/wishlist') ||
      pathname.startsWith('/checkout');

    // Define auth pages
    const isAuthPage =
      pathname === '/login' ||
      pathname === '/sign-up' ||
      pathname === '/forget_password';

    // Admin route protection
    if (pathname.startsWith('/admin') && (!isAuthenticated || !isAdmin)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protected route protection (non-admin)
    if (
      isProtectedRoute &&
      !pathname.startsWith('/admin') &&
      !isAuthenticated
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback runs before the middleware function above
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // For auth pages, allow access regardless of authentication
        if (
          pathname === '/login' ||
          pathname === '/sign-up' ||
          pathname === '/forget_password'
        ) {
          return true;
        }

        // For protected routes, require authentication
        if (
          pathname.startsWith('/admin') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/wishlist') ||
          pathname.startsWith('/checkout')
        ) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
  },
);

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
