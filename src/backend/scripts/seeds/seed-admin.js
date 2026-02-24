const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

// Load environment variables
loadEnvConfig(cwd());

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        avatar TEXT
      );
    `;

    console.log(`Created "users" table`);

    // Create the admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await client.sql`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (
         '410544b2-4001-4271-9855-fec4b6a6442a', 
         'Master Admin', 
         'admin@samakal.com', 
         ${hashedPassword}, 
         'admin',
         'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log(`Seeded "users" table with admin account`);

    return {
      createTable,
      user,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedUsers(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
