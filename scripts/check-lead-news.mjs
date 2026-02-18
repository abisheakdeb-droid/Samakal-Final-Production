
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
const { Client } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const client = new Client({ connectionString });

async function checkLeadNews() {
    try {
        await client.connect();

        // Fetch top 13 articles as per homepage logic
        const res = await client.query(`
            SELECT id, title, image, LENGTH(content) as content_len, is_pinned_home, is_featured, published_at, source_url
            FROM articles
            WHERE status = 'published'
            ORDER BY is_pinned_home DESC, is_featured DESC, published_at DESC
            LIMIT 13;
        `);

        console.table(res.rows.map(r => ({
            id: r.id,
            title: r.title.substring(0, 30),
            image: r.image ? (r.image.includes('maxres') ? 'MAXRES' : r.image.includes('hqdefault') ? 'HQ' : 'OTHER') : 'MISSING',
            contentLen: r.content_len,
            source: r.source_url
        })));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkLeadNews();
