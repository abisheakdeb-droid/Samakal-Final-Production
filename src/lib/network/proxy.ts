import NextAuth from 'next-auth';
import { authConfig } from '../auth/auth.config';
import { NextResponse } from 'next/server';
import { getLegacyRedirect } from '../redirect-utils';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
  const isOnLoginPage = nextUrl.pathname === '/admin/login';

  console.log(`Middleware: ${req.method} ${nextUrl.pathname} [isLoggedIn: ${isLoggedIn}]`);

  // 1. SEO Redirection Logic
  const redirectPath = getLegacyRedirect(nextUrl.pathname);
  if (redirectPath) {
    console.log(`Middleware: SEO Redirecting ${nextUrl.pathname} -> ${redirectPath} (301)`);
    const redirectUrl = new URL(redirectPath, nextUrl);
    return NextResponse.redirect(redirectUrl, {
      status: 301,
    });
  }

  // 2. If trying to access Admin Panel
  if (isOnAdminPanel) {
    if (isOnLoginPage) {
      // If already logged in, redirect to Dashboard (only for GET requests)
      // This prevents intercepting Server Action POST requests which causes the "Unexpected response" error
      if (isLoggedIn && req.method === 'GET') {
        console.log('Middleware: Redirecting logged-in user to dashboard (GET)');
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
      }
      return NextResponse.next(); // Allow access to Login Page
    }

    // If NOT logged in, Redirect to Login
    if (!isLoggedIn) {
      console.log('Middleware: Redirecting unauthenticated user to login');
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }

    // If Logged in -> Allow
    return NextResponse.next();
  }

  // 2. Public Routes -> Always Allow
  return NextResponse.next();
});

export const config = {
  // Verify all paths EXCEPT static files, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
