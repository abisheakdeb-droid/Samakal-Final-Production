
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function testDB() {
  console.log('Testing database connection...');
  const start = Date.now();
  try {
    const result = await sql`SELECT 1 as test`;
    console.log(`Connection successful! Time: ${Date.now() - start}ms`);
    
    console.log('Checking tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables.rows.map(r => r.table_name).join(', '));
    
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    process.exit();
  }
}

testDB();
