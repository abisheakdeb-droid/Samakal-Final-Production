
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
const { Client } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ Error: POSTGRES_URL or DATABASE_URL not found.");
    process.exit(1);
}

const client = new Client({ connectionString });

async function fixThumbnails() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        // 1. Fix 'image' column
        console.log('🛠 Updating "image" column...');
        const imageRes = await client.query(`
            UPDATE articles 
            SET image = REPLACE(image, 'maxresdefault.jpg', 'hqdefault.jpg')
            WHERE image LIKE '%maxresdefault.jpg%'
            RETURNING id;
        `);
        console.log(`✅ Fixed ${imageRes.rowCount} items in "image" column.`);

        // 2. Fix 'video_thumbnail' column
        console.log('🛠 Updating "video_thumbnail" column...');
        const videoRes = await client.query(`
            UPDATE articles 
            SET video_thumbnail = REPLACE(video_thumbnail, 'maxresdefault.jpg', 'hqdefault.jpg')
            WHERE video_thumbnail LIKE '%maxresdefault.jpg%'
            RETURNING id;
        `);
        console.log(`✅ Fixed ${videoRes.rowCount} items in "video_thumbnail" column.`);

        console.log('\n🎉 Cleanup Complete!');
    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

fixThumbnails();
