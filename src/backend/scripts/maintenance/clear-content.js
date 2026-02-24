const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

// Load environment variables
loadEnvConfig(cwd());

async function clearContent(client) {
  try {
    console.log('🗑️  Clearing all articles and related data...');

    // Clear related tables first (if cascading, but being explicit is safer)
    await client.sql`DELETE FROM article_tags`;
    console.log('✓ Cleared article_tags');
    
    await client.sql`DELETE FROM article_images`;
    console.log('✓ Cleared article_images');
    
    await client.sql`DELETE FROM article_contributors`;
    console.log('✓ Cleared article_contributors');

    // Clear main articles table
    await client.sql`DELETE FROM articles`;
    console.log('✓ Cleared articles');

    console.log('\n✅ All content cleared successfully!');
  } catch (error) {
    console.error('Error clearing content:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await clearContent(client);
  await client.end();
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
