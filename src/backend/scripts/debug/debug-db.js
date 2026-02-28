import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

async function main() {
  const client = await db.connect();
  try {
    console.log('🔍 Checking article with public_id = 1...');
    const res = await client.sql`
      SELECT id, title, public_id, slug, 
             LENGTH(content) as content_length,
             SUBSTRING(content, 1, 100) as content_preview 
      FROM articles 
      WHERE public_id = 1
    `;
    console.log('Rows found:', res.rowCount);
    console.table(res.rows);
    
    if (res.rowCount > 0 && res.rows[0].content_length === 0) {
      console.log('\n⚠️  WARNING: Article content is empty!');
    }
  } catch {
    console.error('❌ Database Error:', err);
  } finally {
    await client.end();
  }
}

main();
