const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  try {
    console.log('Adding breaking_news_is_active to site_settings...');
    
    await sql`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS breaking_news_is_active BOOLEAN DEFAULT true;
    `;

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
