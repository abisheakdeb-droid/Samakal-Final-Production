import { auth } from "@/lib/auth/auth.middleware";
import { NextResponse } from 'next/server';

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
    const isOnLoginPage = nextUrl.pathname === '/admin/login';

    // 1. Dynamic SEO Redirection Logic (New Samakal Laravel Sync)
    const path = nextUrl.pathname;

    // Map legacy category slugs to new category slugs
    const categoryMap: Record<string, string> = {
        'international': 'world',
        'whole-country': 'saradesh',
        'capital': 'capital',
        'crime': 'crime',
        'feature': 'feature',
        'opinion': 'opinion',
        'sports': 'sports',
        'entertainment': 'entertainment',
        'lifestyle': 'lifestyle',
        'technology': 'technology'
    };

    // Handle Legacy Article URLs (e.g., /category-slug/article/12345/article-title)
    const articleRegex = /^\/([a-zA-Z0-9-]+)\/article\/(\d+)/;
    const match = path.match(articleRegex);

    if (match) {
        const legacyCategory = match[1];
        const legacyId = match[2];

        try {
            // Fast API lookup for UUID
            const lookupUrl = new URL(`/api/redirect/lookup-article?legacyId=${legacyId}`, req.url);
            // using req.url since fetch requires an absolute URL
            const response = await fetch(lookupUrl);

            if (response.ok) {
                const data = await response.json();
                if (data.uuid) {
                    return NextResponse.redirect(new URL(`/article/${data.uuid}`, req.url), 301);
                }
            }
        } catch (e) {
            console.error('Proxy redirect error:', e);
            const newCategory = categoryMap[legacyCategory] || legacyCategory;
            return NextResponse.redirect(new URL(`/category/${newCategory}`, req.url), 301);
        }
    }

    // Handle Legacy Category Route Redirects (e.g., /international -> /category/world)
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length === 1) {
        const legacyCategory = pathParts[0];
        if (categoryMap[legacyCategory] && categoryMap[legacyCategory] !== legacyCategory) {
            return NextResponse.redirect(new URL(`/category/${categoryMap[legacyCategory]}`, req.url), 301);
        }
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
