/* eslint-disable @typescript-eslint/no-var-requires */
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

const newNav = [
  { label: "সর্বশেষ", href: "/category/latest" },
  { label: "বাংলাদেশ", href: "/category/bangladesh" },
  {
    label: "সারাদেশ",
    href: "/category/saradesh"
    // Removed subItems and megaMenu to disable dropdown
  },
  { label: "রাজধানী", href: "/category/capital" },
  { label: "রাজনীতি", href: "/category/politics" },
  { label: "বিশ্ব", href: "/category/world" },
  { label: "অর্থনীতি", href: "/category/economics" },
  { label: "খেলা", href: "/category/sports" },
  { label: "বিনোদন", href: "/category/entertainment" },
  { label: "মতামত", href: "/category/opinion" },
  { label: "চাকরি", href: "/category/jobs" },
  { label: "আর্কাইভ", href: "/archive" },
  { label: "গ্যালারি", href: "/photo" },
  {
    label: "সব",
    href: "#",
    megaMenu: true,
    subItems: [
      { label: "প্রবাস", href: "/category/probash" },
      { label: "জীবন সংগ্রাম", href: "/category/jibon-songram" },
      { label: "ভ্রমণ", href: "/category/travel" },
      { label: "ফিচার", href: "/category/feature" },
      { label: "বিশেষ সমকাল", href: "/category/special-samakal" },
      { label: "প্রযুক্তি", href: "/category/technology" },
      { label: "সমকাল অনুসন্ধান", href: "/category/investigation" },
      { label: "অফবিট", href: "/category/offbeat" },
      { label: "শিল্পমঞ্চ", href: "/category/shilpomancha" },
      { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" }
    ]
  }
];

async function updateNav() {
  console.log('Updating navigation menu to V6 (Saradesh Flat Link)...');
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
