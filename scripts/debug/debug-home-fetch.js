/* eslint-disable */
const { createClient } = require('@vercel/postgres');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function debugHome() {
    const client = createClient({
        connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Test Fetch Pinned
        console.log('Fetching Pinned...');
        const pinnedData = await client.sql`
      SELECT id, title, home_position, is_pinned_home 
      FROM articles 
      WHERE status = 'published' 
      AND is_pinned_home = true 
      AND home_position IS NOT NULL
    `;
        console.log('Pinned Count:', pinnedData.rows.length);
        console.log('Pinned Rows:', pinnedData.rows);

        const pinnedIds = pinnedData.rows.map(r => r.id);

        // 2. Test Fetch Backfill
        console.log('\nFetching Backfill...');
        let backfillQuery;
        if (pinnedIds.length > 0) {
            // This path shouldn't trigger if pinned is empty, but testing syntax
            backfillQuery = await client.sql`
            SELECT id, title, published_at FROM articles 
            WHERE status = 'published' 
            AND id <> ALL(${pinnedIds})
            ORDER BY published_at DESC LIMIT 5
        `;
        } else {
            backfillQuery = await client.sql`
            SELECT id, title, published_at FROM articles 
            WHERE status = 'published' 
            ORDER BY published_at DESC LIMIT 5
        `;
        }
        console.log('Backfill Count:', backfillQuery.rows.length);
        console.log('Backfill Rows:', backfillQuery.rows.map(r => `${r.id} | ${r.title}`));

    } catch (error) {
        console.error('DEBUG ERROR:', error);
    } finally {
        await client.end();
    }
}

debugHome();
