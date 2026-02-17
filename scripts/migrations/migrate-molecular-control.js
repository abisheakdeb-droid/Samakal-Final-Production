const { db } = require('@vercel/postgres');

async function migrate() {
  const client = await db.connect();
  try {
    console.log('🚀 Starting Molecular Control Migration...');

    await client.sql`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'সমকাল',
      ADD COLUMN IF NOT EXISTS site_tagline TEXT DEFAULT 'অসংকোচ প্রকাশের দুরন্ত সাহস',
      ADD COLUMN IF NOT EXISTS site_logo TEXT DEFAULT '/samakal-logo.png',
      ADD COLUMN IF NOT EXISTS site_favicon TEXT DEFAULT '/favicon.ico',
      ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT 'সমকাল | অসংকোচ প্রকাশের দুরন্ত সাহস',
      ADD COLUMN IF NOT EXISTS seo_description TEXT,
      ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
      ADD COLUMN IF NOT EXISTS footer_copyright TEXT DEFAULT '© ২০২৬ সমকাল। সর্বস্বত্ব সংরক্ষিত।',
      ADD COLUMN IF NOT EXISTS google_analytics_id TEXT,
      ADD COLUMN IF NOT EXISTS navigation_menu JSONB;
    `;

    console.log('✅ Migration successful: New fields added to site_settings.');

    // Seed initial navigation if empty
    const { rows } = await client.sql`SELECT navigation_menu FROM site_settings WHERE id = 1`;
    if (!rows[0]?.navigation_menu) {
      const initialNav = [
        { label: "সর্বশেষ", href: "/category/latest" },
        { label: "বাংলাদেশ", href: "/category/bangladesh" },
        { label: "রাজনীতি", href: "/category/politics" },
        { label: "অর্থনীতি", href: "/category/economics" },
        { label: "বিশ্ব", href: "/category/world" },
        { label: "খেলা", href: "/category/sports" },
        { label: "বিনোদন", href: "/category/entertainment" },
        { label: "মতামত", href: "/category/opinion" },
        { label: "জীবনযাপন", href: "/category/lifestyle" },
        { label: "অপরাধ", href: "/category/crime" },
        { label: "রাজধানী", href: "/category/capital" },
        { 
          label: "সারাদেশ", 
          href: "/category/saradesh",
          subItems: [
            { label: "ঢাকা", href: "/category/dhaka" },
            { label: "চট্টগ্রাম", href: "/category/chattogram" },
            { label: "রাজশাহী", href: "/category/rajshahi" },
            { label: "খুলনা", href: "/category/khulna" },
            { label: "বরিশাল", href: "/category/barishal" },
            { label: "সিলেট", href: "/category/sylhet" },
            { label: "রংপুর", href: "/category/rangpur" },
            { label: "ময়মনসিংহ", href: "/category/mymensingh" }
          ]
        },
        { label: "চাকরি", href: "/category/jobs" },
        { label: "ভিডিও", href: "/video" },
        { label: "ছবি", href: "/photo" }
      ];

      await client.sql`
        UPDATE site_settings 
        SET navigation_menu = ${JSON.stringify(initialNav)}
        WHERE id = 1
      `;
      console.log('✅ Default navigation menu seeded.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrate();
