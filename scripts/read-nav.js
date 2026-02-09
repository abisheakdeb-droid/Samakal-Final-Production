const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function readNav() {
  console.log('Reading current navigation menu from DB...');
  try {
    const result = await sql`SELECT navigation_menu FROM site_settings WHERE id = 1`;
    const nav = result.rows[0].navigation_menu;
    console.log(JSON.stringify(nav, null, 2));
  } catch (error) {
    console.error('Failed to read navigation:', error);
  } finally {
    process.exit();
  }
}

readNav();
