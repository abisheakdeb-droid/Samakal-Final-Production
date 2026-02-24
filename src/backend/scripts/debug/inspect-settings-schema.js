const { db } = require('@vercel/postgres');

async function inspectSettings(client) {
  try {
    const schema = await client.sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'site_settings'
      ORDER BY ordinal_position;
    `;

    console.log('\n📊 SITE_SETTINGS TABLE SCHEMA:');
    console.log('=====================================');
    schema.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(25)} | ${col.data_type.padEnd(15)} | Nullable: ${col.is_nullable}`);
    });

  } catch (error) {
    console.error('Error inspecting settings schema:', error);
  }
}

async function main() {
  const client = await db.connect();
  await inspectSettings(client);
  await client.end();
}

main();
