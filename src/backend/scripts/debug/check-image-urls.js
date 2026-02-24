/* eslint-disable @typescript-eslint/no-var-requires */
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkImages() {
    try {
        const result = await sql`
      SELECT id, title, image, source 
      FROM articles 
      WHERE status = 'published' 
      ORDER BY published_at DESC 
      LIMIT 10
    `;

        console.log('Latest 10 Articles Image URLs:');
        result.rows.forEach(row => {
            console.log(`\nID: ${row.id}`);
            console.log(`Title: ${row.title}`);
            console.log(`Image: ${row.image}`);
            console.log(`Source: ${row.source}`);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        process.exit();
    }
}

checkImages();
