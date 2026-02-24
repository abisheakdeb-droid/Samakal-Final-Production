/**
 * SEO Redirection Utilities
 * Maps legacy Laravel URL patterns to new Next.js routes
 */

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
    'bangladesh': 'সারাদেশ',
    'politics': 'রাজনীতি',
    'international': 'বিশ্ব',
    'economics': 'অর্থনীতি',
    'opinion': 'মতামত',
    'sports': 'খেলা',
    'entertainment': 'বিনোদন',
    'lifestyle': 'জীবনযাপন',
    'technology': 'প্রযুক্তি',
    'education': 'শিক্ষা',
    'health': 'স্বাস্থ্য',
    'environment': 'পরিবেশ',
    'industry-trade': 'শিল্প-বাণিজ্য',
    'stock-market': 'শেয়ারবাজার',
    'special-samakal': 'বিশেষ সমকাল',
    'whole-country': 'সারাদেশ',
};

/**
 * Detects if a path is a legacy URL and returns the new redirect path
 */
export function getLegacyRedirect(pathname: string): string | null {
    // Normalize pathname: remove leading/trailing slashes
    const path = pathname.replace(/^\/|\/$/g, '');
    const segments = path.split('/');

    // 1. Pattern: /[category]/article/[id]/[title]
    // Example: /economics/article/336500/title-here
    if (segments.length >= 3 && segments[1] === 'article' && /^\d+$/.test(segments[2])) {
        const id = segments[2];
        return `/article/${id}`;
    }

    // 2. Pattern: /[category]/news/[id]
    // Example: /whole-country/news/123456
    if (segments.length >= 3 && segments[1] === 'news' && /^\d+$/.test(segments[2])) {
        const id = segments[2];
        return `/article/${id}`;
    }

    // 3. Pattern: /article/[id] (legacy might have it too) - Next.js already handles this but safe to include
    if (segments.length === 2 && segments[0] === 'article' && /^\d+$/.test(segments[1])) {
        // Already matches Next.js /[slug] but we can let it pass to the page logic
        // which handles the redirect to actual slug.
        return null;
    }

    // 4. Pattern: /[category] -> /category/[mapped-name]
    // Example: /economics -> /category/অর্থনীতি
    if (segments.length === 1 && LEGACY_CATEGORY_MAP[segments[0]]) {
        const bengaliName = LEGACY_CATEGORY_MAP[segments[0]];
        return `/category/${encodeURIComponent(bengaliName)}`;
    }

    return null;
}
