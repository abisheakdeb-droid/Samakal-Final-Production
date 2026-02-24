const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');

async function run() {
  const projectDir = cwd();
  loadEnvConfig(projectDir);
  
  // Now require the inspect script, which should see the env vars
  require('./inspect-schema.js');
}

run();
