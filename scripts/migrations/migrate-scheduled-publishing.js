const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = await db.connect();
  
  try {
    console.log('Migrating articles table for scheduled publishing...');
    
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
    `;

    // Update existing articles to have published_at = created_at
    await client.sql`
      UPDATE articles 
      SET published_at = created_at 
      WHERE published_at IS NULL;
    `;

    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
  }
}

migrate();
