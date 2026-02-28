/* eslint-disable */
import { createClient } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';

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
      WHERE table_name = 'articles' AND column_name = 'home_position';
    `;

        if (checkQuery.rows.length === 0) {
            console.log('Adding home_position column...');
            await client.sql`
        ALTER TABLE articles 
        ADD COLUMN home_position INTEGER;
      `;
            console.log('Column home_position added.');
        } else {
            console.log('Column home_position already exists.');
        }

        console.log('Ensuring index on home_position...');
        await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_home_position ON articles(home_position);
    `;
        console.log('Index created/verified.');

    } catch {
        console.error('Migration Error:', error);
    } finally {
        await client.end();
    }
}

migrate();
