const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

async function addFeaturedNewsColumns() {
  const client = await db.connect();
  
  try {
    console.log('🔧 Adding featured news columns to articles table...\n');
    
    // Add new columns for featured news system
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS is_prime BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS prime_priority INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS featured_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS prime_at TIMESTAMP
    `;
    console.log('✅ Columns added successfully');
    
    // Create indexes for optimal query performance
    console.log('\n🔧 Creating indexes...');
    
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_featured 
      ON articles(is_featured, featured_priority DESC) 
      WHERE is_featured = TRUE
    `;
    console.log('✅ Created index: idx_articles_featured');
    
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_prime 
      ON articles(is_prime, prime_priority DESC) 
      WHERE is_prime = TRUE
    `;
    console.log('✅ Created index: idx_articles_prime');
    
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_trending 
      ON articles(status, created_at DESC, views DESC) 
      WHERE status = 'published'
    `;
    console.log('✅ Created index: idx_articles_trending');
    
    // Verify the changes
    console.log('\n🔍 Verifying schema changes...');
    const result = await client.sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'articles' 
        AND column_name IN ('is_featured', 'is_prime', 'featured_priority', 'prime_priority', 'featured_at', 'prime_at')
      ORDER BY column_name
    `;
    
    console.log('\n✅ Schema verification:');
    console.table(result.rows);
    
    console.log('\n✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

addFeaturedNewsColumns();
