import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

async function run() {
  const projectDir = cwd();
  loadEnvConfig(projectDir);

  const args = process.argv.slice(2);
  const migrationFile = args[0] || '002-add-media-support';
  const shouldRollback = args.includes('--rollback');

  const client = await db.connect();

  try {
    console.log(`\n📦 Running migration: ${migrationFile}\n`);

    const migration = await import(`./${migrationFile}.js`);

    if (shouldRollback) {
      await migration.rollback(client);
    } else {
      await migration.migrate(client);
    }
  } catch {
    console.error('Migration script error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
