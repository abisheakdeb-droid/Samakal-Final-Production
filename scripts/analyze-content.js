import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

async function analyzeContent() {
  const client = await db.connect();
  try {
    const res = await client.sql`
      SELECT category, COUNT(*) as count 
      FROM articles 
      GROUP BY category 
      ORDER BY count DESC
    `;
    
    console.log('--- DB Content Distribution ---');
    res.rows.forEach(r => {
      console.log(`${r.category}: ${r.count}`);
    });
    
    // Check total
    const total = await client.sql`SELECT COUNT(*) FROM articles`;
    console.log(`\nTotal Articles: ${total.rows[0].count}`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

analyzeContent();
