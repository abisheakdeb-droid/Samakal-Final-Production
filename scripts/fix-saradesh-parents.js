import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

// Hardcoded maps for reliable script execution
const CATEGORY_MAP = {
  saradesh: "সারাদেশ",
  dhaka: "ঢাকা",
  chattogram: "চট্টগ্রাম",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  barishal: "বরিশাল",
  sylhet: "সিলেট",
  rangpur: "রংপুর",
  mymensingh: "ময়মনসিংহ",
  faridpur: "ফরিদপুর",
  gazipur: "গাজীপুর",
  gopalganj: "গোপালগঞ্জ",
  kishoreganj: "কিশোরগঞ্জ",
  madaripur: "মাদারীপুর",
  manikganj: "মানিকগঞ্জ",
  munshiganj: "মুন্সিগঞ্জ",
  narayanganj: "নারায়ণগঞ্জ",
  narsingdi: "নরসিংদী",
  rajbari: "রাজবাড়ী",
  shariatpur: "শরীয়তপুর",
  tangail: "টাঙ্গাইল",
  bandarban: "বান্দরবান",
  brahmanbaria: "ব্রাহ্মণবাড়িয়া",
  chandpur: "চাঁদপুর",
  comilla: "কুমিল্লা",
  "coxs-bazar": "কক্সবাজার",
  feni: "ফেনী",
  khagrachari: "খাগড়াছড়ি",
  lakshmipur: "লক্ষ্মীপুর",
  noakhali: "নোয়াখালী",
  rangamati: "রাঙামাটি",
  bogra: "বগুড়া",
  joypurhat: "জয়পুরহাট",
  naogaon: "নওগাঁ",
  natore: "নাটোর",
  pabna: "পাবনা",
  sirajganj: "সিরাজগঞ্জ",
  chapainawabganj: "চাপাইনবাবগঞ্জ",
  bagerhat: "বাগেরহাট",
  chuadanga: "চুয়াডাঙ্গা",
  jessore: "যশোর",
  jhenaidah: "ঝিনাইদহ",
  kushtia: "কুষ্টিয়া",
  magura: "মাগুরা",
  meherpur: "মেহেরপুর",
  narail: "নড়াইল",
  satkhira: "সাতক্ষীরা",
  barguna: "বরগুনা",
  bhola: "ভোলা",
  jhalokati: "ঝালকাঠি",
  patuakhali: "পটুয়াখালী",
  pirojpur: "পিরোজপুর",
  habiganj: "হবিগঞ্জ",
  moulvibazar: "মৌলভীবাজার",
  sunamganj: "সুনামগঞ্জ",
  dinajpur: "দিনাজপুর",
  gaibandha: "গাইবান্ধা",
  kurigram: "কুড়িগ্রাম",
  lalmonirhat: "লালমনিরহাট",
  nilphamari: "নীলফামারী",
  panchagarh: "পঞ্চগড়",
  thakurgaon: "ঠাকুরগাঁও",
  jamalpur: "জামালপুর",
  netrokona: "নেত্রকোনা",
  sherpur: "শেরপুর"
};

const SUB_CATEGORIES = {
  saradesh: ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh'],
  dhaka: ['faridpur', 'gazipur', 'gopalganj', 'kishoreganj', 'madaripur', 'manikganj', 'munshiganj', 'narayanganj', 'narsingdi', 'rajbari', 'shariatpur', 'tangail'],
  chattogram: ['bandarban', 'brahmanbaria', 'chandpur', 'comilla', 'coxs-bazar', 'feni', 'khagrachari', 'lakshmipur', 'noakhali', 'rangamati'],
  rajshahi: ['bogra', 'joypurhat', 'naogaon', 'natore', 'pabna', 'sirajganj', 'chapainawabganj'],
  khulna: ['bagerhat', 'chuadanga', 'jessore', 'jhenaidah', 'kushtia', 'magura', 'meherpur', 'narail', 'satkhira'],
  barishal: ['barguna', 'bhola', 'jhalokati', 'patuakhali', 'pirojpur'],
  sylhet: ['habiganj', 'moulvibazar', 'sunamganj'],
  rangpur: ['dinajpur', 'gaibandha', 'kurigram', 'lalmonirhat', 'nilphamari', 'panchagarh', 'thakurgaon'],
  mymensingh: ['jamalpur', 'netrokona', 'sherpur']
};

async function fixSaradeshParents() {
  const client = await db.connect();
  try {
    console.log('🚀 Starting Saradesh Parent Category Fix...');
    
    const divisions = SUB_CATEGORIES['saradesh']; 
    
    let totalUpdated = 0;

    for (const divisionSlug of divisions) {
      const divisionBengali = CATEGORY_MAP[divisionSlug];
      const districtSlugs = SUB_CATEGORIES[divisionSlug] || [];
      const districtBengaliNames = districtSlugs.map(slug => CATEGORY_MAP[slug]).filter(Boolean);

      if (!divisionBengali) {
        console.warn(`⚠️ No Bengali name found for division slug: ${divisionSlug}`);
        continue;
      }

      console.log(`\n📂 Processing Division: ${divisionBengali} (${divisionSlug})`);

      // 1. Update District articles to have this Division as parent
      for (const districtName of districtBengaliNames) {
        const res = await client.sql`
          UPDATE articles 
          SET parent_category = ${divisionBengali}
          WHERE category = ${districtName} AND (parent_category != ${divisionBengali} OR parent_category IS NULL)
        `;
        if (res.rowCount > 0) {
          console.log(`   ✅ Updated ${res.rowCount} articles for District: ${districtName} -> Parent: ${divisionBengali}`);
          totalUpdated += res.rowCount;
        }
      }

      // 2. Update Division articles themselves to have 'সারাদেশ' as parent
      const divRes = await client.sql`
        UPDATE articles 
        SET parent_category = 'সারাদেশ'
        WHERE category = ${divisionBengali} AND (parent_category != 'সারাদেশ' OR parent_category IS NULL)
      `;
      if (divRes.rowCount > 0) {
        console.log(`   ✅ Updated ${divRes.rowCount} articles for Division: ${divisionBengali} -> Parent: সারাদেশে`);
        totalUpdated += divRes.rowCount;
      }
    }

    console.log(`\n✨ Migration complete. Total articles updated: ${totalUpdated}`);

  } catch (err) {
    console.error('❌ Error during migration:', err);
  } finally {
    await client.end();
  }
}

fixSaradeshParents();
