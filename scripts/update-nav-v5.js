const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

const newNav = [
    { label: "সর্বশেষ", href: "/category/latest" },
    { label: "বাংলাদেশ", href: "/category/bangladesh" },
    { 
      label: "সারাদেশ", 
      href: "/category/saradesh",
      megaMenu: true,
      subItems: [
        { 
          label: "ঢাকা", 
          href: "/category/dhaka",
          subItems: [
            { label: "ঢাকা", href: "/category/dhaka" },
            { label: "ফরিদপুর", href: "/category/faridpur" },
            { label: "গাজীপুর", href: "/category/gazipur" },
            { label: "গোপালগঞ্জ", href: "/category/gopalganj" },
            { label: "কিশোরগঞ্জ", href: "/category/kishoreganj" },
            { label: "মাদারীপুর", href: "/category/madaripur" },
            { label: "মানিকগঞ্জ", href: "/category/manikganj" },
            { label: "মুন্সিগঞ্জ", href: "/category/munshiganj" },
            { label: "নারায়ণগঞ্জ", href: "/category/narayanganj" },
            { label: "নরসিংদী", href: "/category/narsingdi" },
            { label: "রাজবাড়ী", href: "/category/rajbari" },
            { label: "শরীয়তপুর", href: "/category/shariatpur" },
            { label: "টাঙ্গাইল", href: "/category/tangail" }
          ]
        },
        { 
          label: "চট্টগ্রাম", 
          href: "/category/chattogram",
          subItems: [
            { label: "বান্দরবান", href: "/category/bandarban" },
            { label: "ব্রাহ্মণবাড়িয়া", href: "/category/brahmanbaria" },
            { label: "চাঁদপুর", href: "/category/chandpur" },
            { label: "চট্টগ্রাম", href: "/category/chattogram" },
            { label: "কুমিল্লা", href: "/category/comilla" },
            { label: "কক্সবাজার", href: "/category/coxs-bazar" },
            { label: "ফেনী", href: "/category/feni" },
            { label: "খাগড়াছড়ি", href: "/category/khagrachari" },
            { label: "লক্ষ্মীপুর", href: "/category/lakshmipur" },
            { label: "নোয়াখালী", href: "/category/noakhali" },
            { label: "রাঙামাটি", href: "/category/rangamati" }
          ]
        },
        { 
            label: "রাজশাহী", 
            href: "/category/rajshahi",
            subItems: [
                { label: "বগুড়া", href: "/category/bogra" },
                { label: "জয়পুরহাট", href: "/category/joypurhat" },
                { label: "নওগাঁ", href: "/category/naogaon" },
                { label: "নাটোর", href: "/category/natore" },
                { label: "পাবনা", href: "/category/pabna" },
                { label: "রাজশাহী", href: "/category/rajshahi" },
                { label: "সিরাজগঞ্জ", href: "/category/sirajganj" },
                { label: "চাপাইনবাবগঞ্জ", href: "/category/chapainawabganj" }
            ]
        },
        { 
            label: "খুলনা", 
            href: "/category/khulna",
            subItems: [
                { label: "বাগেরহাট", href: "/category/bagerhat" },
                { label: "চুয়াডাঙ্গা", href: "/category/chuadanga" },
                { label: "যশোর", href: "/category/jessore" },
                { label: "ঝিনাইদহ", href: "/category/jhenaidah" },
                { label: "খুলনা", href: "/category/khulna" },
                { label: "কুষ্টিয়া", href: "/category/kushtia" },
                { label: "মাগুরা", href: "/category/magura" },
                { label: "মেহেরপুর", href: "/category/meherpur" },
                { label: "নড়াইল", href: "/category/narail" },
                { label: "সাতক্ষীরা", href: "/category/satkhira" }
            ]
        },
        { 
            label: "বরিশাল", 
            href: "/category/barishal",
            subItems: [
                { label: "বরগুনা", href: "/category/barguna" },
                { label: "বরিশাল", href: "/category/barishal" },
                { label: "ভোলা", href: "/category/bhola" },
                { label: "ঝালকাঠি", href: "/category/jhalokati" },
                { label: "পটুয়াখালী", href: "/category/patuakhali" },
                { label: "পিরোজপুর", href: "/category/pirojpur" }
            ]
        },
        { 
            label: "সিলেট", 
            href: "/category/sylhet",
            subItems: [
                { label: "হবিগঞ্জ", href: "/category/habiganj" },
                { label: "মৌলভীবাজার", href: "/category/moulvibazar" },
                { label: "সুনামগঞ্জ", href: "/category/sunamganj" },
                { label: "সিলেট", href: "/category/sylhet" }
            ]
        },
        { 
            label: "রংপুর", 
            href: "/category/rangpur",
            subItems: [
                { label: "দিনাজপুর", href: "/category/dinajpur" },
                { label: "গাইবান্ধা", href: "/category/gaibandha" },
                { label: "কুড়িগ্রাম", href: "/category/kurigram" },
                { label: "লালমনিরহাট", href: "/category/lalmonirhat" },
                { label: "নীলফামারী", href: "/category/nilphamari" },
                { label: "পঞ্চগড়", href: "/category/panchagarh" },
                { label: "রংপুর", href: "/category/rangpur" },
                { label: "ঠাকুরগাঁও", href: "/category/thakurgaon" }
            ]
        },
        { 
            label: "ময়মনসিংহ", 
            href: "/category/mymensingh",
            subItems: [
                { label: "জামালপুর", href: "/category/jamalpur" },
                { label: "ময়মনসিংহ", href: "/category/mymensingh" },
                { label: "নেত্রকোনা", href: "/category/netrokona" },
                { label: "শেরপুর", href: "/category/sherpur" }
            ]
        }
      ]
    }, // End Saradesh
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
  console.log('Updating navigation menu to V5 (Nested Saradesh Structure)...');
  try {
    const result = await sql`
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
