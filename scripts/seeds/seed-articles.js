const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

// Load environment variables
loadEnvConfig(cwd());

async function seedArticles(client) {
  try {
    // Create the "articles" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        category VARCHAR(100),
        views INT DEFAULT 0,
        image TEXT,
        author_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log(`Created "articles" table`);

    // Check if we have any users to assign as author
    const users = await client.sql`SELECT id FROM users LIMIT 1`;
    let authorId = null;
    if (users.rows.length > 0) {
        authorId = users.rows[0].id;
    } else {
        console.warn('No users found to assign as author. Skipping sample data insertion.');
        return { createTable };
    }

    // Insert some sample data
    const insertedArticles = await client.sql`
      INSERT INTO articles (id, title, slug, content, status, category, views, image, author_id)
      VALUES 
      (
        uuid_generate_v4(), 
        'Election 2026: Live Updates from Dhaka', 
        'election-2026-live-updates', 
        '<h2>Election Day Live</h2><p>Initial reports suggest high voter turnout...</p>', 
        'published', 
        'Politics', 
        12500, 
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        ${authorId}
      ),
      (
        uuid_generate_v4(), 
        'Metro Rail seamless travel guide', 
        'metro-rail-guide', 
        '<h2>How to use the new pass</h2><p>The new rapid pass allows...</p>', 
        'draft', 
        'Lifestyle', 
        0, 
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
        ${authorId}
      )
      ON CONFLICT (slug) DO NOTHING;
    `;

    console.log(`Seeded "articles" table with sample data`);

    return {
      createTable,
      insertedArticles,
    };
  } catch (error) {
    console.error('Error seeding articles:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedArticles(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
