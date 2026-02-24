const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');

async function run() {
  const projectDir = cwd();
  loadEnvConfig(projectDir);
  
  // Now require the seed script, which should see the env vars
  require('./seed-admin.js');
}

run();
