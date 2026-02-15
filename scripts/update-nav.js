/* eslint-disable @typescript-eslint/no-var-requires */
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

const newNav = [
  { label: "সর্বশেষ", href: "/category/latest" },
  { label: "বাংলাদেশ", href: "/category/bangladesh" },
  { label: "রাজনীতি", href: "/category/politics" },
  { label: "অর্থনীতি", href: "/category/economics" },
  { label: "বিশ্ব", href: "/category/world" },
  { label: "খেলা", href: "/category/sports" },
  { label: "বিনোদন", href: "/category/entertainment" },
  { label: "মতামত", href: "/category/opinion" },
  {
    label: "আরও",
    href: "#",
    subItems: [
      { label: "জীবনযাপন", href: "/category/lifestyle" },
      { label: "অপরাধ", href: "/category/crime" },
      { label: "রাজধানী", href: "/category/capital" },
      { label: "চাকরি", href: "/category/jobs" },
      { label: "ভিডিও", href: "/video" },
      { label: "ছবি", href: "/photo" }
    ]
  }
];

async function updateNav() {
  console.log('Updating navigation menu...');
  try {
    await sql`
      UPDATE site_settings
      SET navigation_menu = ${JSON.stringify(newNav)},
          updated_at = NOW()
      WHERE id = 1
    `;
    console.log('Navigation updated successfully!');
  } catch (error) {
    console.error('Failed to update navigation:', error);
  } finally {
    process.exit();
  }
}

updateNav();
