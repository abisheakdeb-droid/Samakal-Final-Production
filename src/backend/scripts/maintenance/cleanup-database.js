import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

async function cleanupDummyArticles() {
  const client = await db.connect();
  
  try {
    console.log('🗑️  Starting database cleanup...\n');
    
    // First, count current articles
    const countBefore = await client.sql`SELECT COUNT(*) as total FROM articles`;
    console.log(`📊 Current articles in database: ${countBefore.rows[0].total}`);
    
    // Delete all articles
    console.log('\n🔧 Deleting all existing articles...');
    const deleteResult = await client.sql`DELETE FROM articles`;
    console.log(`✅ Deleted ${deleteResult.rowCount} articles`);
    
    // Reset the public_id sequence
    console.log('\n🔧 Resetting public_id sequence...');
    await client.sql`ALTER SEQUENCE articles_public_id_seq RESTART WITH 1`;
    console.log('✅ Sequence reset to 1');
    
    // Verify cleanup
    const countAfter = await client.sql`SELECT COUNT(*) as total FROM articles`;
    console.log(`\n📊 Articles remaining: ${countAfter.rows[0].total}`);
    
    console.log('\n✨ Database cleanup completed successfully!');
    console.log('📝 Ready for fresh content import.');
    
  } catch {
    console.error('❌ Cleanup Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

cleanupDummyArticles();
