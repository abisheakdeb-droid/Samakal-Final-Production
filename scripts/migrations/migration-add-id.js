const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

async function addPublicIdColumn(client) {
  try {
    console.log('🚀 Adding public_id column...');

    // 1. Add column if not exists
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS public_id SERIAL;
    `;
    
    // 2. Add unique index/constraint to ensure speed and uniqueness
    await client.sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_public_id ON articles(public_id);
    `;

    console.log('✅ Added public_id (SERIAL) to articles table.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

async function main() {
  const client = await db.connect();
  await addPublicIdColumn(client);
  await client.end();
}

main().catch(console.error);
