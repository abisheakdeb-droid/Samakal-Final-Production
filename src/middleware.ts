import { auth } from "@/lib/auth/auth.middleware";
import { NextResponse } from 'next/server';
import { getLegacyRedirect } from '@/lib/redirect-utils';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
    const isOnLoginPage = nextUrl.pathname === '/admin/login';

    // 1. SEO Redirection Logic
    const redirectPath = getLegacyRedirect(nextUrl.pathname);
    if (redirectPath) {
        const redirectUrl = new URL(redirectPath, nextUrl);
        return NextResponse.redirect(redirectUrl, {
            status: 301,
        });
    }

    // 2. If trying to access Admin Panel
    if (isOnAdminPanel) {
        if (isOnLoginPage) {
            if (isLoggedIn && req.method === 'GET') {
                return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
            }
            return NextResponse.next();
        }

        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/admin/login', nextUrl));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
