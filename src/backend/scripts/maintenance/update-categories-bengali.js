import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

async function updateCategoriesToBengali() {
  console.log('🔄 Updating category names to Bengali...\n');
  
  const client = await db.connect();
  
  try {
    // Check current categories
    console.log('📊 Current categories:');
    const current = await client.sql`
      SELECT category, COUNT(*) as count 
      FROM articles 
      GROUP BY category 
      ORDER BY category
    `;
    console.table(current.rows);
    
    // Update to Bengali
    console.log('\n🔄 Converting to Bengali...\n');
    
    const updates = [
      { from: 'Bangladesh', to: 'বাংলাদেশ' },
      { from: 'Politics', to: 'রাজনীতি' },
      { from: 'Sports', to: 'খেলা' },
      { from: 'Entertainment', to: 'বিনোদন' },
      { from: 'International', to: 'আন্তর্জাতিক' },
      { from: 'Opinion', to: 'মতামত' },
      { from: 'Feature', to: 'ফিচার' },
      { from: 'Samagra', to: 'সমগ্র' },
      { from: 'Literature', to: 'সাহিত্য' }
      // অর্থনীতি already in Bengali
    ];
    
    for (const { from, to } of updates) {
      const result = await client.sql`
        UPDATE articles 
        SET category = ${to} 
        WHERE category = ${from}
      `;
      if (result.rowCount > 0) {
        console.log(`✅ ${from} → ${to}: ${result.rowCount} articles updated`);
      }
    }
    
    // Show updated categories
    console.log('\n📊 Updated categories:');
    const updated = await client.sql`
      SELECT category, COUNT(*) as count 
      FROM articles 
      GROUP BY category 
      ORDER BY category
    `;
    console.table(updated.rows);
    
    console.log('\n✨ Category names updated successfully!');
    
  } catch {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

updateCategoriesToBengali();
