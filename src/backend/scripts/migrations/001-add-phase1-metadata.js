const { db } = require('@vercel/postgres');

async function migrate(client) {
  try {
    console.log('🚀 Starting Phase 1 Migration...\n');

    // Step 1: Add new columns to articles table
    console.log('📝 Adding new columns to articles table...');
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS sub_headline TEXT,
      ADD COLUMN IF NOT EXISTS news_type VARCHAR(50) DEFAULT 'regular',
      ADD COLUMN IF NOT EXISTS location VARCHAR(100),
      ADD COLUMN IF NOT EXISTS keywords TEXT[];
    `;
    console.log('✅ New columns added successfully\n');

    // Step 2: Create article_tags table
    console.log('📝 Creating article_tags table...');
    await client.sql`
      CREATE TABLE IF NOT EXISTS article_tags (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ article_tags table created successfully\n');

    // Step 3: Create indexes for performance
    console.log('📝 Creating indexes...');
    
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_article_tags_article_id 
        ON article_tags(article_id);
    `;
    console.log('  ✓ Index on article_tags.article_id created');

    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_article_tags_tag 
        ON article_tags(tag);
    `;
    console.log('  ✓ Index on article_tags.tag created');

    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_news_type 
        ON articles(news_type);
    `;
    console.log('  ✓ Index on articles.news_type created');

    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_articles_location 
        ON articles(location);
    `;
    console.log('  ✓ Index on articles.location created');

    console.log('\n✅ All indexes created successfully\n');

    // Step 4: Add constraint for news_type values
    console.log('📝 Adding news_type constraint...');
    await client.sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'articles_news_type_check'
        ) THEN
          ALTER TABLE articles 
          ADD CONSTRAINT articles_news_type_check 
          CHECK (news_type IN ('breaking', 'regular', 'feature', 'opinion', 'photo_story'));
        END IF;
      END $$;
    `;
    console.log('✅ Constraint added successfully\n');

    console.log('🎉 Phase 1 Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function rollback(client) {
  try {
    console.log('🔄 Rolling back Phase 1 Migration...\n');

    // Drop indexes
    await client.sql`DROP INDEX IF EXISTS idx_articles_location`;
    await client.sql`DROP INDEX IF EXISTS idx_articles_news_type`;
    await client.sql`DROP INDEX IF EXISTS idx_article_tags_tag`;
    await client.sql`DROP INDEX IF EXISTS idx_article_tags_article_id`;
    
    // Drop table
    await client.sql`DROP TABLE IF EXISTS article_tags`;
    
    // Remove columns
    await client.sql`
      ALTER TABLE articles 
      DROP COLUMN IF EXISTS keywords,
      DROP COLUMN IF EXISTS location,
      DROP COLUMN IF EXISTS news_type,
      DROP COLUMN IF EXISTS sub_headline;
    `;

    console.log('✅ Rollback completed\n');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

module.exports = { migrate, rollback };
