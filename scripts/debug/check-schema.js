
const { createClient } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  const client = createClient();
  await client.connect();

  try {
    const res = await client.sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'articles';
    `;
    
    console.log("Columns in 'articles' table:");
    res.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });

    const hasFeatured = res.rows.some(r => r.column_name === 'is_featured' || r.column_name === 'is_prime');
    console.log(`\nHas 'is_featured' or 'is_prime': ${hasFeatured}`);

  } catch (error) {
    console.error('Error querying schema:', error);
  } finally {
    await client.end();
  }
}

checkSchema();
