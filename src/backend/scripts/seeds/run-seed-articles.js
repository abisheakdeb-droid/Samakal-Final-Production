import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

import('./seed-bengali-articles.js').catch(console.error);
