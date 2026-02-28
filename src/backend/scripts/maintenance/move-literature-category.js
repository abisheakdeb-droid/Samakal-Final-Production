import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sql } from '@vercel/postgres';

async function moveLiteratureCategory() {
  try {
    console.log('🔄 Moving Literature Category...');

    // 1. Move "Literature" -> "সাহিত্য ও সংস্কৃতি" (Parent: "অন্যান্য")
    const result = await sql`
      UPDATE articles 
      SET 
        category = 'সাহিত্য ও সংস্কৃতি',
        parent_category = 'অন্যান্য'
      WHERE 
        category = 'Literature' 
        OR category = 'সাহিত্য'
      RETURNING id, title;
    `;

    console.log(`✅ Moved ${result.rowCount} articles to "সাহিত্য ও সংস্কৃতি" (Other).`);
    
    // Log sample titles
    if (result.rows.length > 0) {
      console.log('Sample updated titles:', result.rows.slice(0, 3).map(r => r.title));
    }

  } catch {
    console.error('❌ Migration failed:', error);
  }
}

moveLiteratureCategory();
