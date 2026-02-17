const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

async function fixCategories() {
  const client = await db.connect();
  try {
    console.log('🔄 Fixing category names...');
    
    // Fix Literature -> সাহিত্য
    const litRes = await client.sql`
      UPDATE articles 
      SET category = 'সাহিত্য' 
      WHERE category = 'Literature'
    `;
    console.log(`✅ Updated ${litRes.rowCount} articles from 'Literature' to 'সাহিত্য'`);

    // Fix Feature -> ফিচার
    const featRes = await client.sql`
      UPDATE articles 
      SET category = 'ফিচার' 
      WHERE category = 'Feature'
    `;
    console.log(`✅ Updated ${featRes.rowCount} articles from 'Feature' to 'ফিচার'`);

  } catch (err) {
    console.error('❌ Error fixing categories:', err);
  } finally {
    await client.end();
  }
}

fixCategories();
