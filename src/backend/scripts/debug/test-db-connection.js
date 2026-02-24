// Quick test to check if DB connection works
const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

async function test() {
  console.log('Testing DB connection...');
  console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
  
  try {
    const client = await db.connect();
    console.log('✅ DB connection established');
    
    const result = await client.sql`SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY category`;
    console.log('\nCurrent article counts:');
    result.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ DB Error:', error.message);
    process.exit(1);
  }
}

test();
