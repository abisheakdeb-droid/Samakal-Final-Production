const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');

loadEnvConfig(cwd());

async function main() {
  try {
    const { mapArticleToNewsItem } = require('../src/lib/mappers');
    
    const mockArticle = {
        id: '8b24b2e6-e3a0-443d-9d0b-0d45df242d4b',
        title: 'Test Article',
        slug: '-962',
        status: 'published',
        category: 'General',
        created_at: new Date().toISOString(),
        content: '<p>Content</p>',
        image: null,
        author: 'Admin',
        video_url: null
    };

    console.log('🧪 Testing mapper...');
    const result = mapArticleToNewsItem(mockArticle);
    console.log('✅ Result:', result ? 'Success' : 'Failure');
    console.log(result);
    
  } catch (error) {
    console.error('❌ Error testing mapper:', error);
  }
}

main();
