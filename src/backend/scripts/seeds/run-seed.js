import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';

async function run() {
  const projectDir = cwd();
  loadEnvConfig(projectDir);

  // Now require the seed script, which should see the env vars
  await import('./seed-admin.js');
}

run();
