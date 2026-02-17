const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function updateLifestyleSubcategories() {
  console.log('Starting Lifestyle Subcategory Migration...');
  
  try {
    // 1. Update articles where category is 'লাইফস্টাইল' to ensure parent_category is also 'লাইফস্টাইল'
    // This allows fetchArticlesByCategory(..., true) to find them
    console.log('Setting parent_category for generic "লাইফস্টাইল" articles...');
    const result = await sql`
      UPDATE articles 
      SET parent_category = 'লাইফস্টাইল' 
      WHERE (category = 'লাইফস্টাইল' OR parent_category = 'জীবনযাপন')
    `;
    console.log(`Updated ${result.rowCount} generic lifestyle articles.`);

    // 2. We don't have many subcategory articles yet, so for now we just ensure 
    // any existing ones are correctly mapped. 
    // If the user wants specific articles in 'খাবার' or 'ফ্যাশন', they can edit via CMS.
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

updateLifestyleSubcategories();
