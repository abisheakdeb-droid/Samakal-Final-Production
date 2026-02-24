const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  try {
    console.log('Creating site_settings table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        facebook_live_url TEXT,
        facebook_is_live BOOLEAN DEFAULT false,
        youtube_playlist_id TEXT,
        youtube_api_key TEXT,
        breaking_news_ticker TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert default row if not exists
    await sql`
      INSERT INTO site_settings (id, facebook_is_live, breaking_news_ticker)
      VALUES (1, false, 'সমকাল - অসংকোচ প্রকাশের দুরন্ত সাহস')
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
