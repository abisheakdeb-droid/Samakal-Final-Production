/* eslint-disable */
const { createClient } = require('@vercel/postgres');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function migrate() {
    const client = createClient({
        connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // Check if column exists
        const checkQuery = await client.sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'articles' AND column_name = 'is_pinned_home';
    `;

        if (checkQuery.rows.length === 0) {
            console.log('Adding is_pinned_home column...');
            await client.sql`
        ALTER TABLE articles 
        ADD COLUMN is_pinned_home BOOLEAN DEFAULT FALSE;
      `;
            console.log('Column is_pinned_home added.');
        } else {
            console.log('Column is_pinned_home already exists.');
        }

        console.log('Ensuring index on is_pinned_home...');
        await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_is_pinned_home ON articles(is_pinned_home);
    `;
        console.log('Index created/verified.');

    } catch (error) {
        console.error('Migration Error:', error);
    } finally {
        await client.end();
    }
}

migrate();
