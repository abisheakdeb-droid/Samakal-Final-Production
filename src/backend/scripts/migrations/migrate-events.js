
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@vercel/postgres');

async function migrate() {
  const client = createClient();
  await client.connect();

  try {
    console.log('Creating events table...');
    // Ensure extension exists for uuid_generate_v4 if not already (usually enabled in standard setups, but good to check if error)
    // Actually safe to assume it exists if used elsewhere, otherwise we can use gen_random_uuid() for pgcrypto/v13+
    await client.sql`
      CREATE TABLE IF NOT EXISTS events (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          banner_image VARCHAR(255),
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Events table created.');

    console.log('Adding event_id to articles...');
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id) ON DELETE SET NULL;
    `;
    console.log('Column event_id added to articles.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
