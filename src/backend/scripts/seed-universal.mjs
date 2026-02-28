
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
const { Client } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ Error: POSTGRES_URL or DATABASE_URL not found.");
    process.exit(1);
}

const client = new Client({ connectionString });

// Full Category Map from src/config/categories.ts
// We are hardcoding it here to avoid TS/ESM complexity in a standalone script
const CATEGORY_MAP = {
    latest: "সর্বশেষ",
    politics: "রাজনীতি",
    bangladesh: "বাংলাদেশ",
    saradesh: "সারাদেশ",
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
    lifestyle: "জীবনধারা",
    jobs: "চাকরি",
    other: "অন্যান্য",
    archive: "আর্কাইভ",
    gallery: "গ্যালারি",
    probash: "প্রবাস",
    "jibon-songram": "জীবন সংগ্রাম",
    "special-samakal": "বিশেষ সমকাল",
    investigation: "সমকাল অনুসন্ধান",
    offbeat: "অফবিট",
    shilpomancha: "শিল্পমঞ্চ",
    samagra: "সমগ্র",
    "samagra-features": "সমগ্র ফিচার",
    "special-arrangement": "বিশেষ আয়োজন",
    // Divisions
    dhaka: "ঢাকা",
    chattogram: "চট্টগ্রাম",
    rajshahi: "রাজশাহী",
    khulna: "খুলনা",
    barishal: "বরিশাল",
    sylhet: "সিলেট",
    rangpur: "রংপুর",
    mymensingh: "ময়মনসিংহ",
    // Districts (Selected major ones to avoid 404s, user asked for "available" places)
    // We will try all keys, but handle 404s gracefully
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
    sherpur: "শেরপুর",
    "law-courts": "আইন ও বিচার",
    agriculture: "কৃষি",
    parliament: "সংসদ",
    environment: "পরিবেশ",
    struggle: "লড়াইয়ের মঞ্চ",
    // Sub-categories
    "industry-trade": "শিল্প-বাণিজ্য",
    "share-market": "শেয়ারবাজার",
    "bank-insurance": "ব্যাংক-বীমা",
    "budget": "বাজেট",
    "interview": "সাক্ষাৎকার",
    "chaturanga": "চতুরঙ্গ",
    "reaction": "প্রতিক্রিয়া",
    "khola-chokhe": "খোলাচোখে",
    "muktomunch": "মুক্তমঞ্চ",
    "onno-drishti": "অন্যদৃষ্টি",
    "editorial": "সম্পাদকীয়",
    "bollywood": "বলিউড",
    "hollywood": "হলিউড",
    "dhallywood": "ঢালিউড",
    "tollywood": "টালিউড",
    "television": "টেলিভিশন", // Fixed spelling
    "music": "মিউজিক",
    "other-entertainment": "অন্যান্য",
    "entertainment-photos": "বিনোদনের ছবি",
    "ott": "ওটিটি",
    "stage": "মঞ্চ",
    "football": "ফুটবল",
    "cricket": "ক্রিকেট",
    "tennis": "টেনিস",
    "golf": "গলফ",
    "badminton": "ব্যাডমিন্টন",
    "t20-world-cup": "টি–টোয়েন্টি বিশ্বকাপ",
    "other-sports": "অন্যান্য",
    "miscellaneous": "বিবিধ",
    "awami-league": "আওয়ামী লীগ",
    "bnp": "বিএনপি",
    "jamaat": "জামায়াত",
    "jatiya-party": "জাতীয় পার্টি",
    "others-politics": "অন্যান্য",
    "election": "নির্বাচন",
    "asia": "এশিয়া",
    "europe": "ইউরোপ",
    "africa": "আফ্রিকা",
    "usa-canada": "যুক্তরাষ্ট্র-কানাডা",
    "others": "অন্যান্য",
    "australia": "অস্ট্রেলিয়া",
    "india": "ভারত",
    "pakistan": "পাকিস্তান",
    "china": "চীন",
    "middle-east": "মধ্যপ্রাচ্য",
    "war": "যুদ্ধ-সংঘাত",
    "literature": "সাহিত্য",
    "culture": "সংস্কৃতি",
    "shilpomancha-interview": "সাক্ষাৎকার",
    "translation": "অনুবাদ",
    "classic": "ক্ল্যাসিক",
    "book-review": "বুক রিভিউ",
    "shilpomancha-travel": "ভ্রমণ",
    "gadgets": "গ্যাজেট",
    "social-media": "সোশ্যাল মিডিয়া",
    "it-sector": "আইটি খাত",
    "science": "বিজ্ঞান",
    "apps-games": "অ্যাপ ও গেম",
    "beauty-care": "রূপচর্চা",
    food: "খাবার",
    fashion: "ফ্যাশন",
    relationship: "সম্পর্ক",
    health: "স্বাস্থ্য",
    "lifestyle-health": "স্বাস্থ্য",
    travel: "ভ্রমণ",
    "health-tips": "স্বাস্থ্য টিপস",
    religion: "ধর্ম ও জীবন",
    "campus": "ক্যাম্পাস",
    "admission": "ভর্তি",
    "exam-results": "পরীক্ষা ও ফল",
    "scholarship": "বৃত্তি",
    "murder": "খুন",
    "corruption": "দুর্নীতি",
    "rape": "ধর্ষণ",
    "trafficking": "পাচার",
    "court": "আদালত",
    "north-city": "উত্তর সিটি",
    "south-city": "দক্ষিণ সিটি",
    "traffic": "যানজট",
    "services": "নাগরিক সেবা",
    "anniversary": "প্রতিষ্ঠাবার্ষিকী",
    "roundtable": "গোলটেবিল",
    "national-day": "জাতীয় দিবস",
    "pohela-boishakh": "পহেলা বৈশাখ",
    "kaler-jatra": "কালের যাত্রা",
    "womens-day": "নারী দিবস",
    "eid-ananda": "ঈদ আনন্দ",
    "durga-puja": "শারদীয় দুর্গোৎসব",
    "independence-day": "স্বাধীনতা দিবস",
    "victory-day": "বিজয় দিবস",
    "february-21": "২১শে ফেব্রুয়ারি",
    "kaler-kheya": "কালের খেয়া",
    "nondon": "নন্দন",
    "shoili": "শৈলী",
    "sarabela": "সারাবেলা",
    "suhrid-somabesh": "সুহৃদ সমাবেশ",
    "ghasforing": "ঘাসফড়িং",
    "kichu-alo": "কিছু আলো",
    "neel": "নীল",
    "doctor-bari": "ডাক্তারবাড়ি",
    "somriddhi": "সমৃদ্ধি",
    "sahosh": "সাহস",
    "somota": "সমতা",
};

// Generate targets from map
// Note: Samakal URLs are usually https://samakal.com/[slug]
// Some subcategories might need prefix like https://samakal.com/politics/awami-league but often they are flat or handled by router
// We will try flat first as per site structure analysis: samakal.com/slug usually works.
const TARGETS = Object.keys(CATEGORY_MAP).map(slug => ({
    url: `https://samakal.com/${slug}`,
    category: slug
}));

async function seed() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        // CLEANUP: Truncate current data to fix the mismatch
        console.log('🧹 Cleaning up old data...');
        await client.query('TRUNCATE TABLE articles RESTART IDENTITY CASCADE;');

        console.log(`✅ Connected! Starting scraping for ${TARGETS.length} categories...\n`);

        // Scrape in chunks to be polite and avoid memory/socket issues
        const CHUNK_SIZE = 5;
        for (let i = 0; i < TARGETS.length; i += CHUNK_SIZE) {
            const chunk = TARGETS.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(processTarget));
            console.log(`zzz Sleeping 1s after batch ${i / CHUNK_SIZE + 1}...`);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('\n🎉 Universal Seeding Complete!');
    } catch {
        console.error('Database Connection Error:', err);
    } finally {
        await client.end();
    }
}

async function processTarget(target) {
    try {
        // Use the Bengali name for the DB insert
        const categoryBengali = CATEGORY_MAP[target.category] || target.category;

        const { data } = await axios.get(target.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        let insertedCount = 0;

        let newsItems = $('.media, .card, article, .news-item, .content-item');
        if (newsItems.length === 0) newsItems = $('a:has(h3), a:has(h4), a.heading');

        for (let i = 0; i < newsItems.length; i++) {
            if (insertedCount >= 10) break;

            const el = newsItems[i];
            const isLink = $(el).is('a');
            const linkEl = isLink ? $(el) : $(el).find('a').first();

            let title = $(el).find('.heading, h1, h2, h3, h4, .title').first().text().trim();
            if (!title) title = linkEl.text().trim();

            let link = linkEl.attr('href');
            let image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

            if (title && link) {
                if (!link.startsWith('http')) link = `https://samakal.com${link}`;

                // Ensure image is absolute
                if (image && !image.startsWith('http')) {
                    if (image.startsWith('//')) image = `https:${image}`;
                    else image = `https://samakal.com${image}`;
                }
                // Fallback image if missing or invalid
                if (!image || image.includes('base64')) image = 'https://samakal.com/common/img/logo.png';

                // Extract ID
                const parts = link.split('/');
                const idIndex = parts.indexOf('article');

                if (idIndex !== -1 && parts[idIndex + 1]) {
                    const publicId = parseInt(parts[idIndex + 1]);
                    const slug = parts[idIndex + 2] || `news-${publicId}`;
                    const summary = $(el).find('.brief, p, .summary').first().text().trim() || title;

                    try {
                        const query = `
                           INSERT INTO "articles" 
                           ("public_id", "title", "slug", "sub_headline", "image", "category", "content", "status", "published_at", "source", "created_at", "updated_at")
                           VALUES ($1, $2, $3, $4, $5, $6, $7, 'published', NOW(), 'Samakal Scraper', NOW(), NOW())
                           ON CONFLICT ("slug") DO NOTHING;
                        `;

                        // Use categoryBengali here!
                        await client.query(query, [publicId, title, slug, summary, image, categoryBengali, `<p>${summary}</p>`]);
                        insertedCount++;
                    } catch {
                        // Ignore
                    }
                }
            }
        }
        if (insertedCount > 0) console.log(`   ✅ ${target.category} (${categoryBengali}): ${insertedCount} items`);
        else console.log(`   ⚠️ ${target.category}: No items`);

    } catch {
        // console.error(`   ❌ ${target.category}: ${err.message}`);
    }
}

seed();
