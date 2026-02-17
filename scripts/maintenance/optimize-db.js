const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

async function optimizeDatabase(client) {
  try {
    console.log('🚀 Starting Database Optimization...');

    // 1. Enable pg_trgm extension for fast text search
    console.log('📦 Enabling pg_trgm extension...');
    await client.sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;

    // 2. Add Standard Indexes (B-Tree)
    console.log('⚡ Adding Standard Indexes...');
    
    // Status & Created At (Essential for "Latest News" queries)
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_status_created ON articles(status, created_at DESC);`;
    console.log('   ✓ idx_articles_status_created');

    // Category filtering
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);`;
    console.log('   ✓ idx_articles_category');

    // Slug lookups (usually unique constraint handles this, but explicit index is safe)
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);`;
    console.log('   ✓ idx_articles_slug');

    // Author lookups
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);`;
    console.log('   ✓ idx_articles_author');

    // Views sorting (for "Trending" / "Most Read")
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);`;
    console.log('   ✓ idx_articles_views');

    // 3. Add Search Indexes (GIN)
    console.log('🔍 Adding Search Indexes (GIN)...');
    
    // Title Search (Trigram index makes ILIKE '%...%' very fast)
    await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);`;
    console.log('   ✓ idx_articles_title_trgm');

    // Content Search (Optional: can be heavy, but useful for deep search)
    // await client.sql`CREATE INDEX IF NOT EXISTS idx_articles_content_trgm ON articles USING gin (content gin_trgm_ops);`;
    // Note: Content index can be huge (GBs). Let's stick to Title for now for speed.
    
    // 4. Analyze table to update statistics
    console.log('📊 Updating Database Statistics...');
    await client.sql`ANALYZE articles;`;

    console.log('\n✅ Database Optimization Complete! System is ready for 1M+ rows.');

  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

async function main() {
  const client = await db.connect();
  await optimizeDatabase(client);
  await client.end();
}

main().catch(console.error);
