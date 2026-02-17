import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

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
  dhaka: ['dhaka', 'faridpur', 'gazipur', 'gopalganj', 'kishoreganj', 'madaripur', 'manikganj', 'munshiganj', 'narayanganj', 'narsingdi', 'rajbari', 'shariatpur', 'tangail'],
  chattogram: ['bandarban', 'brahmanbaria', 'chandpur', 'chattogram', 'comilla', 'coxs-bazar', 'feni', 'khagrachari', 'lakshmipur', 'noakhali', 'rangamati'],
  rajshahi: ['bogra', 'joypurhat', 'naogaon', 'natore', 'pabna', 'rajshahi', 'sirajganj', 'chapainawabganj'],
  khulna: ['bagerhat', 'chuadanga', 'jessore', 'jhenaidah', 'khulna', 'kushtia', 'magura', 'meherpur', 'narail', 'satkhira'],
  barishal: ['barguna', 'barishal', 'bhola', 'jhalokati', 'patuakhali', 'pirojpur'],
  sylhet: ['habiganj', 'moulvibazar', 'sunamganj', 'sylhet'],
  rangpur: ['dinajpur', 'gaibandha', 'kurigram', 'lalmonirhat', 'nilphamari', 'panchagarh', 'rangpur', 'thakurgaon'],
  mymensingh: ['jamalpur', 'mymensingh', 'netrokona', 'sherpur']
};

async function updateNavigation() {
  const client = await db.connect();
  
  try {
    // Build Saradesh subItems
    const saradeshSubItems = SUB_CATEGORIES.saradesh.map(divisionSlug => {
      const divisionLabel = CATEGORY_MAP[divisionSlug] || divisionSlug;
      const districtSlugs = SUB_CATEGORIES[divisionSlug] || [];
      
      const districtSubItems = districtSlugs.map(districtSlug => ({
        label: CATEGORY_MAP[districtSlug] || districtSlug,
        href: `/category/${districtSlug}`
      }));
      
      return {
        label: divisionLabel,
        href: `/category/${divisionSlug}`,
        subItems: districtSubItems.length > 0 ? districtSubItems : undefined
      };
    });

    const newNav = [
      { label: "সর্বশেষ", href: "/category/latest" },
      { label: "বাংলাদেশ", href: "/category/bangladesh" },
      { 
        label: "সারাদেশ", 
        href: "/category/saradesh",
        subItems: saradeshSubItems
      },
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
          { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
        ],
      },
    ];

    console.log('Updating navigation menu with 3-level Saradesh hierarchy...');
    
    await client.sql`
      UPDATE site_settings
      SET navigation_menu = ${JSON.stringify(newNav)},
          updated_at = NOW()
      WHERE id = 1
    `;

    console.log('✅ Navigation menu updated successfully!');
  } catch (error) {
    console.error('❌ Error updating navigation:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

updateNavigation();
