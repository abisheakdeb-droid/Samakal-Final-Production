const { db } = require('@vercel/postgres');

async function inspectSchema(client) {
  try {
    // Get articles table schema
    const articlesSchema = await client.sql`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'articles'
      ORDER BY ordinal_position;
    `;

    console.log('\n📊 ARTICLES TABLE SCHEMA:');
    console.log('=====================================');
    articlesSchema.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(20)} | ${col.data_type.padEnd(15)} | Nullable: ${col.is_nullable}`);
    });

    // Get all tables
    const tables = await client.sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('\n📋 ALL DATABASE TABLES:');
    console.log('=====================================');
    tables.rows.forEach(table => {
      console.log(`- ${table.table_name}`);
    });

  } catch (error) {
    console.error('Error inspecting schema:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await inspectSchema(client);
  await client.end();
}

main().catch((err) => {
  console.error('An error occurred:', err);
});
