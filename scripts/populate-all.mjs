
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
    lifestyle: "জীবন ধারা",
    jobs: "চাকরি",
    chakri: "চাকরি",
    other: "অন্যান্য",
    archive: "আর্কাইভ",
    gallery: "গ্যালারি",
    photogallery: "ছবি",
    "video-gallery": "ভিডিও",
    probash: "প্রবাস",
    probas: "প্রবাস",
    "jibon-songram": "জীবন সংগ্রাম",
    "life-struggle": "জীবন সংগ্রাম",
    "special-samakal": "বিশেষ সমকাল",
    investigation: "সমকাল অনুসন্ধান",
    "samakal-investigation": "সমকাল অনুসন্ধান",
    offbeat: "অফবিট",
    offbit: "অফবিট",
    shilpomancha: "শিল্পমঞ্চ",
    shilpomoncho: "শিল্পমঞ্চ",
    samagra: "সমগ্র",
    "samagra-features": "সমগ্র ফিচার",
    "special-arrangement": "বিশেষ আয়োজন",
    "special-ayojon": "বিশেষ আয়োজন",
    // Divisions
    dhaka: "ঢাকা",
    chattogram: "চট্টগ্রাম",
    rajshahi: "রাজশাহী",
    khulna: "খুলনা",
    barishal: "বরিশাল",
    sylhet: "সিলেট",
    rangpur: "রংপুর",
    mymensingh: "ময়মনসিংহ",
    // Districts
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
    "television": "টেলিভিশন",
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
    "other-sports": "অন্যান্য",
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

// Parent Category Resolution Map (Simplified for DB)
const SUB_CATEGORIES = {
    bangladesh: ['education', 'law-courts', 'agriculture', 'parliament', 'environment', 'struggle'],
    saradesh: ['dhaka', 'chattogram', 'rajshahi', 'khulna', 'barishal', 'sylhet', 'rangpur', 'mymensingh'],
    dhaka: ['faridpur', 'gazipur', 'gopalganj', 'kishoreganj', 'madaripur', 'manikganj', 'munshiganj', 'narayanganj', 'narsingdi', 'rajbari', 'shariatpur', 'tangail'],
    chattogram: ['bandarban', 'brahmanbaria', 'chandpur', 'comilla', 'coxs-bazar', 'feni', 'khagrachari', 'lakshmipur', 'noakhali', 'rangamati'],
    rajshahi: ['bogra', 'joypurhat', 'naogaon', 'natore', 'pabna', 'sirajganj', 'chapainawabganj'],
    khulna: ['bagerhat', 'chuadanga', 'jessore', 'jhenaidah', 'kushtia', 'magura', 'meherpur', 'narail', 'satkhira'],
    barishal: ['barguna', 'bhola', 'jhalokati', 'patuakhali', 'pirojpur'],
    sylhet: ['habiganj', 'moulvibazar', 'sunamganj'],
    rangpur: ['dinajpur', 'gaibandha', 'kurigram', 'lalmonirhat', 'nilphamari', 'panchagarh', 'thakurgaon'],
    mymensingh: ['jamalpur', 'netrokona', 'sherpur'],
    economics: ['industry-trade', 'share-market', 'bank-insurance', 'budget'],
    opinion: ['interview', 'chaturanga', 'reaction', 'khola-chokhe', 'muktomunch', 'onno-drishti', 'editorial'],
    entertainment: ['bollywood', 'hollywood', 'dhallywood', 'tollywood', 'television', 'music', 'other-entertainment', 'entertainment-photos', 'ott', 'stage'],
    sports: ['football', 'cricket', 'tennis', 'golf', 'badminton', 'other-sports'],
    politics: ['awami-league', 'bnp', 'jamaat', 'jatiya-party', 'others-politics', 'election'],
    world: ['asia', 'europe', 'africa', 'usa-canada', 'australia', 'india', 'pakistan', 'china', 'middle-east', 'others'],
    technology: ['gadgets', 'social-media', 'it-sector', 'science', 'apps-games'],
    lifestyle: ['food', 'fashion', 'relationship', 'beauty-care', 'lifestyle-health'],
    crime: ['murder', 'corruption', 'rape', 'trafficking', 'court'],
    "special-arrangement": ["anniversary", "roundtable", "national-day", "womens-day", "eid-ananda", "durga-puja", "pohela-boishakh", "kaler-jatra"],
    "national-day": ["independence-day", "victory-day", "february-21"],
    "shilpomancha": ["literature", "culture", "shilpomancha-interview", "translation", "classic", "book-review", "shilpomancha-travel"],
    feature: ["kaler-kheya", "nondon", "shoili", "sarabela", "suhrid-somabesh", "ghasforing", "campus", "kichu-alo", "neel", "doctor-bari", "somriddhi", "sahosh", "somota"],
};

function getParent(slug) {
    for (const [parent, children] of Object.entries(SUB_CATEGORIES)) {
        if (children.includes(slug)) return parent;
    }
    return null;
}

const TARGETS = Object.entries(CATEGORY_MAP).map(([slug, bengaliName]) => ({
    url: slug === 'latest' ? 'https://samakal.com/latest/news' : `https://samakal.com/${slug}`,
    slug: slug,
    bengaliName: bengaliName,
    parent: getParent(slug)
}));

async function populate() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log(`✅ Connected! Targets: ${TARGETS.length}\n`);

        for (const target of TARGETS) {
            await processTarget(target);
            await new Promise(r => setTimeout(r, 500));
        }

        console.log('\n🎉 Population Complete!');
    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

async function processTarget(target) {
    try {
        process.stdout.write(`👉 Scraping ${target.slug} (${target.bengaliName})... `);

        const { data } = await axios.get(target.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
            timeout: 10000
        }).catch(e => ({ data: null }));

        if (!data) {
            console.log(`[Skipped] - 404 or Timeout`);
            return;
        }

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
            // Clean title suffix
            if (title) title = title.replace(/\| Samakal News$/i, '').replace(/\| সমকাল$/i, '').trim();

            let link = linkEl.attr('href');
            let listImage = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

            if (title && link) {
                if (!link.startsWith('http')) link = `https://samakal.com${link}`;

                // Process list image
                if (listImage && !listImage.startsWith('http')) {
                    if (listImage.startsWith('//')) listImage = `https:${listImage}`;
                    else listImage = `https://samakal.com${listImage}`;
                }
                if (!listImage || listImage.includes('base64')) listImage = null;

                const parts = link.split('/');
                const idIndex = parts.indexOf('article');
                let publicId, slug;

                if (idIndex !== -1 && parts[idIndex + 1]) {
                    publicId = parseInt(parts[idIndex + 1]);
                    slug = parts[idIndex + 2] || `news-${publicId}`;
                } else {
                    slug = link.split('/').pop() || `auto-${Date.now()}-${i}`;
                    publicId = Math.floor(Math.random() * 1000000);
                }

                const summary = $(el).find('.brief, p, .summary').first().text().trim() || title;

                // --- FETCH FULL CONTENT ---
                let fullContent = `<p>${summary}</p>`;
                let videoUrl = null;
                let videoThumbnail = null;
                let detailImage = null;

                try {
                    const detailResponse = await axios.get(link, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
                        timeout: 5000
                    });
                    const $detail = cheerio.load(detailResponse.data);

                    // improved body extraction
                    const bodyEl = $detail('.dNewsDesc, #contentDetails, .article-content, .details-body, .description');
                    if (bodyEl.length > 0) {
                        bodyEl.find('script, style, ins, .adsbygoogle').remove();
                        fullContent = bodyEl.html().trim();
                    }

                    // Extract Detail Page Image (Higher Quality)
                    const detailImgEl = $detail('.detail-image img, .feature-image img, .gallery-image img').first();
                    let dImg = detailImgEl.attr('src') || detailImgEl.attr('data-src');
                    if (dImg) {
                        if (!dImg.startsWith('http')) {
                            if (dImg.startsWith('//')) dImg = `https:${dImg}`;
                            else dImg = `https://samakal.com${dImg}`;
                        }
                        detailImage = dImg;
                    }

                    const iframe = $detail('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
                    if (iframe.length > 0) videoUrl = iframe.attr('src');

                    if (videoUrl) {
                        const ytIdMatch = videoUrl.match(/(?:embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|watch\?v=|&v=)([^#&?]*).*/);
                        if (ytIdMatch && ytIdMatch[1]) {
                            videoThumbnail = `https://img.youtube.com/vi/${ytIdMatch[1]}/hqdefault.jpg`;
                        }
                    }
                } catch { }

                // Final Image Logic: Detail > VideoThumb > List > Default
                let finalImage = detailImage || listImage;
                if (videoThumbnail && (!finalImage || finalImage.includes('logo.png'))) {
                    finalImage = videoThumbnail;
                }
                if (!finalImage) finalImage = 'https://samakal.com/common/img/logo.png';

                try {
                    const query = `
                        INSERT INTO "articles" 
                        ("public_id", "title", "slug", "sub_headline", "image", "category", "parent_category", "content", "status", "published_at", "source", "video_url", "video_thumbnail", "created_at", "updated_at", "source_url")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', NOW(), 'Master Scraper', $9, $10, NOW(), NOW(), $11)
                        ON CONFLICT ("slug") 
                        DO UPDATE SET 
                            "category" = EXCLUDED.category,
                            "parent_category" = EXCLUDED.parent_category,
                            "image" = EXCLUDED.image,
                            "content" = EXCLUDED.content,
                            "video_url" = EXCLUDED.video_url,
                            "video_thumbnail" = EXCLUDED.video_thumbnail,
                            "source_url" = EXCLUDED.source_url,
                            "updated_at" = NOW();
                    `;

                    await client.query(query, [
                        publicId, title, slug, summary, finalImage,
                        target.bengaliName,
                        target.parent ? (CATEGORY_MAP[target.parent] || target.parent) : null,
                        fullContent, videoUrl, videoThumbnail, link
                    ]);
                    insertedCount++;
                    await new Promise(r => setTimeout(r, 100));
                } catch (e) {
                    // console.error(e.message);
                }
            }
        }
        console.log(`[Done] - Saved ${insertedCount} items.`);

    } catch (err) {
        console.log(`[Failed] - ${err.message}`);
    }
}

populate();
