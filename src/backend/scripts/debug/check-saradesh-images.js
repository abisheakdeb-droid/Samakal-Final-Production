
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkSaradeshImages() {
  try {
    const result = await sql`
      SELECT id, title, category, parent_category, image 
      FROM articles 
      WHERE parent_category = 'সারাদেশ' OR category = 'সারাদেশ' 
         OR parent_category IN ('ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ')
      ORDER BY created_at DESC 
      LIMIT 20
    `;
    
    console.log('Sample Saradesh Articles and Images:');
    result.rows.forEach(row => {
      console.log(`- [${row.category}] ${row.title}: ${row.image}`);
    });
  } catch (error) {
    console.error('Error checking images:', error);
  }
}

checkSaradeshImages();
