const { db } = require('@vercel/postgres');

async function migrate(client) {
  try {
    console.log('🚀 Starting Phase 3 Migration (Attribution & SEO)...\n');

    // Step 1: Add Attribution & SEO columns to articles table
    console.log('📝 Adding Attribution & SEO columns to articles table...');
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS source VARCHAR(255),
      ADD COLUMN IF NOT EXISTS source_url TEXT,
      ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS seo_description TEXT,
      ADD COLUMN IF NOT EXISTS canonical_url TEXT;
    `;
    console.log('✅ Columns added successfully\n');

    // Step 2: Create article_contributors table
    console.log('📝 Creating article_contributors table...');
    await client.sql`
      CREATE TABLE IF NOT EXISTS article_contributors (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
        contributor_id UUID, -- Loose reference to user system
        role VARCHAR(50) DEFAULT 'reporter',
        custom_name VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ article_contributors table created successfully\n');

    // Step 3: Create indexes
    console.log('📝 Creating indexes...');
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_article_contributors_article_id 
        ON article_contributors(article_id);
    `;
    console.log('  ✓ Index on article_contributors.article_id created\n');

    console.log('🎉 Phase 3 Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function rollback(client) {
  try {
    console.log('🔄 Rolling back Phase 3 Migration...\n');

    // Drop index
    await client.sql`DROP INDEX IF EXISTS idx_article_contributors_article_id`;
    
    // Drop table
    await client.sql`DROP TABLE IF EXISTS article_contributors`;
    
    // Remove columns
    await client.sql`
      ALTER TABLE articles 
      DROP COLUMN IF EXISTS source,
      DROP COLUMN IF EXISTS source_url,
      DROP COLUMN IF EXISTS seo_title,
      DROP COLUMN IF EXISTS seo_description,
      DROP COLUMN IF EXISTS canonical_url;
    `;

    console.log('✅ Rollback completed\n');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

module.exports = { migrate, rollback };
