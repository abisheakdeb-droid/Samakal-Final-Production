import { getLegacyRedirect } from '../../src/lib/redirect-utils';

const testCases = [
    {
        path: '/economics/article/336500/title-here',
        expected: '/article/336500',
        description: 'Legacy article with category, ID and title'
    },
    {
        path: '/whole-country/news/123456',
        expected: '/article/123456',
        description: 'Legacy news pattern'
    },
    {
        path: '/economics',
        expected: '/category/' + encodeURIComponent('অর্থনীতি'),
        description: 'Legacy category redirect'
    },
    {
        path: '/politics',
        expected: '/category/' + encodeURIComponent('রাজনীতি'),
        description: 'Legacy politics redirect'
    },
    {
        path: '/article/slug-path',
        expected: null,
        description: 'Modern article path (no redirect)'
    },
    {
        path: '/admin/dashboard',
        expected: null,
        description: 'Admin path (no redirect)'
    }
];

function runTests() {
    console.log('🧪 Running SEO Redirect Tests...');
    let passed = 0;

    testCases.forEach((tc, i) => {
        const result = getLegacyRedirect(tc.path);
        const success = result === tc.expected;

        if (success) {
            console.log(`✅ [${i + 1}] ${tc.description}`);
            passed++;
        } else {
            console.log(`❌ [${i + 1}] ${tc.description}`);
            console.log(`   Expected: ${tc.expected}`);
            console.log(`   Actually: ${result}`);
        }
    });

    console.log(`\n📊 Results: ${passed}/${testCases.length} passed`);

    if (passed === testCases.length) {
        console.log('\n✨ All tests passed!');
    } else {
        process.exit(1);
    }
}

runTests();
