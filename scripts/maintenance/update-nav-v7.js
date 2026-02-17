/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function updateNavigation() {
  try {
    const newNav = [
      { label: "সর্বশেষ", href: "/category/latest" },
      { label: "বাংলাদেশ", href: "/category/bangladesh" },
      { label: "সারাদেশ", href: "/category/saradesh" },
      { label: "রাজধানী", href: "/category/capital" },
      { label: "রাজনীতি", href: "/category/politics" },
      { label: "বিশ্ব", href: "/category/world" },
      { label: "অর্থনীতি", href: "/category/economics" },
      { label: "খেলা", href: "/category/sports" },
      { label: "অপরাধ", href: "/category/crime" },
      { label: "বিনোদন", href: "/category/entertainment" },
      { label: "মতামত", href: "/category/opinion" },
      { label: "চাকরি", href: "/category/jobs" },
      { label: "আর্কাইভ", href: "/archive" },
      {
        label: "সব",
        href: "#",
        megaMenu: true,
        subItems: [
          { label: "ছবি", href: "/photo" },
          { label: "ভিডিও", href: "/video" },
          { label: "প্রবাস", href: "/category/probash" },
          { label: "জীবন সংগ্রাম", href: "/category/jibon-songram" },
          { label: "ভ্রমণ", href: "/category/travel" },
          { label: "ফিচার", href: "/category/feature" },
          { label: "বিশেষ সমকাল", href: "/category/special-samakal" },
          { label: "প্রযুক্তি", href: "/category/technology" },
          { label: "সমকাল অনুসন্ধান", href: "/category/investigation" },
          { label: "অফবিট", href: "/category/offbeat" },
          { label: "শিল্পমঞ্চ", href: "/category/shilpomancha" },
          { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
        ],
      },
    ];

    console.log('Updating navigation menu...');

    await sql`
      UPDATE site_settings
      SET navigation_menu = ${JSON.stringify(newNav)},
          updated_at = NOW()
      WHERE id = 1
    `;

    console.log('✅ Navigation menu updated successfully!');
    console.log('\nNew menu structure:');
    console.log(JSON.stringify(newNav, null, 2));
    console.log('\n⚠️  Please run: curl http://localhost:3000/api/revalidate to clear cache');
    console.log('Or manually restart the dev server.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
    process.exit(1);
  }
}

updateNavigation();
