const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

async function run() {
  const projectDir = cwd();
  loadEnvConfig(projectDir);

  const args = process.argv.slice(2);
  const migrationFile = args[0] || '002-add-media-support';
  const shouldRollback = args.includes('--rollback');

  const client = await db.connect();

  try {
    console.log(`\n📦 Running migration: ${migrationFile}\n`);
    
    const migration = require(`./migrations/${migrationFile}.js`);
    
    if (shouldRollback) {
      await migration.rollback(client);
    } else {
      await migration.migrate(client);
    }
  } catch (error) {
    console.error('Migration script error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
