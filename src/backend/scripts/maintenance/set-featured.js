
const { createClient } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setFeatured() {
  const client = createClient();
  await client.connect();

  try {
    // 1. Get a random article ID
    const res = await client.sql`SELECT id, title FROM articles WHERE status = 'published' LIMIT 1;`;
    
    if (res.rows.length === 0) {
        console.log("No articles found.");
        return;
    }

    const article = res.rows[0];
    const articleId = article.id;

    console.log(`Marking article as featured: "${article.title}" (${articleId})`);

    // 2. Set is_featured = true
    await client.sql`
        UPDATE articles 
        SET is_featured = true, is_prime = true, featured_at = NOW() 
        WHERE id = ${articleId};
    `;

    console.log("Success! Article marked as Featured/Prime.");

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

setFeatured();
