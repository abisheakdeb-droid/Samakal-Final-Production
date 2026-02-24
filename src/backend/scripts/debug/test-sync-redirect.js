/**
 * Test script to verify the Data Sync API and SEO Redirect Middleware
 * 
 * Usage: `npm run test:sync` inside the backend scripts dir
 */


const API_URL = 'http://localhost:3000'; // Make sure the dev server is running on 3000
const SYNC_SECRET = 'samakal-sync-secret-2026-xYz';

const mockArticle = {
    legacy_id: 250212345, // ID from the old Samakal site
    title: 'SEO Redirect Test Article',
    slug: 'seo-redirect-test-article',
    content: '<p>This is a test article to verify the sync and redirect flow.</p>',
    category: 'world', // Maps from 'international'
    parent_category: 'news',
    status: 'published',
    url: 'https://samakal.com/international/article/250212345/seo-redirect-test-article'
};

async function runTest() {
    console.log('--- Step 1: Testing the /api/sync endpoint ---');

    try {
        const res = await fetch(`${API_URL}/api/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SYNC_SECRET}`
            },
            body: JSON.stringify({ articles: [mockArticle] })
        });

        const data = await res.json();
        console.log('Sync Response:', data);

        if (res.ok) {
            console.log('✅ Article successfully ingested via Sync API.');
        } else {
            console.error('❌ Failed to sync article.');
            return;
        }

        console.log('\n--- Step 2: Testing Article Redirect Middleware ---');
        console.log('Validating legacy URL: /international/article/250212345/seo-redirect-test-article');

        // Test the redirect (Node fetch automatically follows redirects, so we check the final URL)
        const redirectRes = await fetch(`${API_URL}/international/article/250212345/seo-redirect-test-article`, {
            redirect: 'manual' // We want to see the 301 response itself
        });

        console.log(`Response Status: ${redirectRes.status}`);
        console.log(`Response Headers Location: ${redirectRes.headers.get('location')}`);

        if (redirectRes.status === 301 || redirectRes.status === 308) {
            console.log('✅ Middleware correctly intercepted legacy URL and issued a redirect!');
            const finalUrl = redirectRes.headers.get('location');
            console.log(`➡️  Redirects to: ${finalUrl}`);
        } else {
            console.log('❌ Middleware did not redirect HTTP 301/308.');
        }

        console.log('\n--- Step 3: Testing Category Redirect Middleware ---');
        const catRes = await fetch(`${API_URL}/international`, { redirect: 'manual' });
        console.log(`Legacy /international -> Status: ${catRes.status} -> Location: ${catRes.headers.get('location')}`);

        if (catRes.status === 301 || catRes.status === 308) {
            console.log('✅ Middleware correctly redirected legacy Category to new Category!');
        } else {
            console.log('❌ Category middleware redirect failed.');
        }

    } catch (err) {
        console.error('Test script error:', err);
    }
}

runTest();
