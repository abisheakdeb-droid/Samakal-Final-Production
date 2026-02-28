import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

const CATEGORY_MAP = {
  latest: "সর্বশেষ",
  politics: "রাজনীতি",
  bangladesh: "সারাদেশ", 
  saradesh: "সারadesh", // Fallback if someone uses English
  capital: "রাজধানী",
  crime: "অপরাধ",
  world: "বিশ্ব",
  business: "বাণিজ্য",
  economics: "অর্থনীতি",
  feature: "ফিচার",
  opinion: "মতামত",
  sports: "খেলা",
  entertainment: "বিনোদন",
  technology: "প্রযুক্তি",
  education: "শিক্ষা",
  lifestyle: "জীবনযাপন",
  jobs: "চাকরি",
  other: "অন্যান্য",
  dhaka: "ঢাকা",
  chattogram: "চট্টগ্রাম",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  barishal: "বরিশাল",
  sylhet: "সিলেট",
  rangpur: "রংপুর",
  mymensingh: "ময়মনসিংহ",
  munshiganj: "মুন্সিগঞ্জ",
  comilla: "কুমিল্লা",
  'coxs-bazar': "কক্সবাজার",
  habiganj: "হবিগঞ্জ",
  jamalpur: "জামালপুর",
  kushtia: "কুষ্টিয়া",
  bhola: "ভোলা",
  satkhira: "সাতক্ষীরা",
  pabna: "পাবনা",
  shariatpur: "শরীয়তপুর",
  faridpur: "ফরিপুর"
};

// Map English slugs to Bengali names
const REVERSE_MAP = {
  'saradesh': 'সারাদেশ',
  'dhaka': 'ঢাকা',
  'chattogram': 'চট্টগ্রাম',
  'khulna': 'খুলনা',
  'rajshahi': 'রাজশাহী',
  'barishal': 'বরিশাল',
  'sylhet': 'সিলেট',
  'rangpur': 'রংপুর',
  'mymensingh': 'ময়মনসিংহ',
  'whole-country': 'সারাদেশ'
};

async function main() {
  const client = await db.connect();
  console.log('🔄 Fixing Saradesh and Regional categories...');
  
  try {
    // 1. Convert all English category slugs to Bengali
    console.log('Step 1: Normalizing individual categories...');
    for (const [slug, bangla] of Object.entries(CATEGORY_MAP)) {
      const res = await client.sql`
        UPDATE articles 
        SET category = ${bangla}
        WHERE category = ${slug}
      `;
      if (res.rowCount > 0) {
        console.log(`   ✓ Normalized ${res.rowCount} articles: ${slug} → ${bangla}`);
        normalizedCount += res.rowCount;
      }
    }

    // 2. Fix parent_category for regions
    console.log('\nStep 2: Fixing parent_category for Regional news...');
    const saradeshBangla = 'সারাদেশ';
    
    // Any article that has a division/district as category should have 'সারাদেশ' as parent
    const regions = [
      'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
      'মুন্সিগঞ্জ', 'কুমিল্লা', 'কক্সবাজার', 'হবিগঞ্জ', 'জামালপুর', 'কুষ্টিয়া', 'ভোলা', 
      'সাতক্ষীরা', 'পাবনা', 'শরীয়তপুর', 'ফরিপুর'
    ];

    for (const region of regions) {
      const res = await client.sql`
        UPDATE articles 
        SET parent_category = ${saradeshBangla}
        WHERE category = ${region} AND (parent_category IS NULL OR parent_category = 'saradesh' OR parent_category = 'whole-country')
      `;
      if (res.rowCount > 0) {
        console.log(`   ✓ Set parent 'সারাদেশ' for ${res.rowCount} articles in ${region}`);
      }
    }

    // 3. Fix cases where parent_category is still English
    console.log('\nStep 3: Fixing English parent_category slugs...');
    for (const [slug, bangla] of Object.entries(REVERSE_MAP)) {
      const res = await client.sql`
        UPDATE articles 
        SET parent_category = ${bangla}
        WHERE parent_category = ${slug}
      `;
      if (res.rowCount > 0) {
        console.log(`   ✓ Updated parent slug: ${slug} → ${bangla}`);
      }
    }

    console.log('\n✅ Category normalization complete.');
  } catch {
    console.error('❌ Error fixing categories:', err);
  } finally {
    await client.end();
  }
}

main().catch(console.error);

