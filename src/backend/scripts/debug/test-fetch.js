import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';

loadEnvConfig(cwd());

// Mocking 'server-only' or similar constraints if needed?
// We will try importing the action directly. 
// If it fails due to Next.js specific imports (like 'next/navigation' redirect), we might have issues.
// But let's try.

async function main() {
  try {
    // Dynamic import to allow env loading first
    import { fetchArticleById } from '../../src/lib/actions-article';

    console.log('🧪 Testing fetchArticleById("1")...');
    const article = await fetchArticleById("1");
    console.log('Result:', article ? article.title : 'null');

  } catch {
    console.error('❌ Error testing fetch:', error);
  }
}

main();
