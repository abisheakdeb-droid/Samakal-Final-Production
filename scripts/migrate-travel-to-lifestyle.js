const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrateTravelToLifestyle() {
  console.log('Starting migration: Travel -> Lifestyle');
  
  try {
    // 1. Update Articles
    console.log('Updating articles table (ভ্রমণ -> লাইফস্টাইল)...');
    const articleResult = await sql`
      UPDATE articles 
      SET category = 'লাইফস্টাইল' 
      WHERE category = 'ভ্রমণ'
    `;
    console.log(`Updated ${articleResult.rowCount} articles.`);

    // 2. Update Navigation Menu in Site Settings
    console.log('Fetching navigation menu...');
    const settingsResult = await sql`SELECT navigation_menu FROM site_settings WHERE id = 1`;
    if (settingsResult.rows.length === 0) {
      console.error('No settings found with id = 1');
      return;
    }

    let navMenu = settingsResult.rows[0].navigation_menu;
    
    // Recursive function to update menu items
    function updateMenuItems(items) {
      return items.map(item => {
        let updatedItem = { ...item };
        
        if (item.label === 'ভ্রমণ') {
          console.log('Found "ভ্রমণ" in menu. Renaming to "লাইফস্টাইল" and updating link...');
          updatedItem.label = 'লাইফস্টাইল';
          updatedItem.href = '/category/lifestyle';
        }
        
        if (item.subItems && item.subItems.length > 0) {
          updatedItem.subItems = updateMenuItems(item.subItems);
        }
        
        if (item.items && item.items.length > 0) {
          updatedItem.items = updateMenuItems(item.items);
        }
        
        return updatedItem;
      });
    }

    const updatedNavMenu = updateMenuItems(navMenu);

    console.log('Updating site_settings table...');
    await sql`
      UPDATE site_settings 
      SET navigation_menu = ${JSON.stringify(updatedNavMenu)}
      WHERE id = 1
    `;
    console.log('Successfully updated navigation menu.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrateTravelToLifestyle();
