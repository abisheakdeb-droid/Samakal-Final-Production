const { db } = require('@vercel/postgres');

async function migrate(client) {
  try {
    console.log('🚀 Starting Phase 2 Migration (Media Enhancement)...\n');

    // Step 1: Add video columns to articles table
    console.log('📝 Adding video support columns to articles table...');
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS video_url TEXT,
      ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;
    `;
    console.log('✅ Video columns added successfully\n');

    // Step 2: Create article_images table
    console.log('📝 Creating article_images table...');
    await client.sql`
      CREATE TABLE IF NOT EXISTS article_images (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        image_type VARCHAR(50) NOT NULL,
        caption TEXT,
        photographer VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ article_images table created successfully\n');

    // Step 3: Create indexes for performance
    console.log('📝 Creating indexes...');
    
    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_article_images_article_id 
        ON article_images(article_id);
    `;
    console.log('  ✓ Index on article_images.article_id created');

    await client.sql`
      CREATE INDEX IF NOT EXISTS idx_article_images_type 
        ON article_images(image_type);
    `;
    console.log('  ✓ Index on article_images.image_type created');

    // Step 4: Add constraint for image_type values
    console.log('\n📝 Adding image_type constraint...');
    await client.sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'article_images_type_check'
        ) THEN
          ALTER TABLE article_images 
          ADD CONSTRAINT article_images_type_check 
          CHECK (image_type IN ('featured', 'thumbnail', 'gallery'));
        END IF;
      END $$;
    `;
    console.log('✅ Constraint added successfully\n');

    console.log('🎉 Phase 2 Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function rollback(client) {
  try {
    console.log('🔄 Rolling back Phase 2 Migration...\n');

    // Drop indexes
    await client.sql`DROP INDEX IF EXISTS idx_article_images_type`;
    await client.sql`DROP INDEX IF EXISTS idx_article_images_article_id`;
    
    // Drop table
    await client.sql`DROP TABLE IF EXISTS article_images`;
    
    // Remove columns
    await client.sql`
      ALTER TABLE articles 
      DROP COLUMN IF EXISTS video_thumbnail,
      DROP COLUMN IF EXISTS video_url;
    `;

    console.log('✅ Rollback completed\n');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

module.exports = { migrate, rollback };
