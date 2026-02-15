const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { createClient } = require('@vercel/postgres');

loadEnvConfig(cwd());

// Mocking normalizeCategory
function normalizeCategory(input) {
    return input; // Simplified
}

async function testFetch(category, limit = 10, isParent = false, parentCategory) {
    const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    await client.connect();

    console.log('Testing Fetch:', { category, limit, isParent, parentCategory });

    try {
        let res;
        if (isParent) {
            // Division logic
            res = await client.query(`
        SELECT id, title, category, parent_category
        FROM articles
        WHERE status = 'published' AND published_at <= NOW()
        AND (parent_category = $1 OR category = $1)
        ORDER BY published_at DESC
        LIMIT $2
      `, [category, limit]);
        } else if (parentCategory) {
            // District logic
            res = await client.query(`
        SELECT id, title, category, parent_category
        FROM articles
        WHERE status = 'published' AND published_at <= NOW()
        AND category ILIKE $1 AND parent_category = $2
        ORDER BY published_at DESC
        LIMIT $3
      `, [category, parentCategory, limit]);
        } else {
            res = await client.query(`
        SELECT id, title, category, parent_category
        FROM articles
        WHERE status = 'published' AND published_at <= NOW()
        AND category ILIKE $1
        ORDER BY published_at DESC
        LIMIT $2
      `, [category, limit]);
        }

        console.log('Results Found:', res.rowCount);
        console.table(res.rows);
    } catch (err) {
        console.error('Fetch Failed:', err);
    } finally {
        await client.end();
    }
}

async function main() {
    console.log('--- TEST 1: Dhaka (Division) ---');
    await testFetch('ঢাকা', 5, true);

    console.log('\n--- TEST 2: Munshiganj (District of Dhaka) ---');
    await testFetch('মুন্সিগঞ্জ', 5, false, 'ঢাকা');

    console.log('\n--- TEST 3: Feature ---');
    await testFetch('ফিচার', 5, false);
}

main().catch(console.error);
