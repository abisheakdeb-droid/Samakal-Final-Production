
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

// Mapping specific user URLs to Bengali Database Names
const TARGET_MAP = {
    "bangladesh": "বাংলাদেশ",
    "politics": "রাজনীতি",
    "economics": "অর্থনীতি",
    "international": "বিশ্ব",
    "sports": "খেলা",
    "sports/cricket": "ক্রিকেট",
    "sports/football": "ফুটবল",
    "sports/tennis": "টেনিস",
    "sports/golf": "গলফ",
    "sports/badminton": "ব্যাডমিন্টন",
    "entertainment": "বিনোদন",
    "entertainment/bollywood": "বলিউড",
    "entertainment/hollywood": "হলিউড",
    "entertainment/dhallywood": "ঢালিউড",
    "entertainment/television": "টেলিভিশন",
    "entertainment/music": "মিউজিক",
    "whole-country": "সারadesh",
    "crime": "অপরাধ",
    "economics": "অর্থনীতি",
    "economics/industry-trade": "শিল্প-বাণিজ্য",
    "economics/share-market": "শেয়ারবাজার",
    "economics/bank-insurance": "ব্যাংক-বীমা",
    "world": "বিশ্ব",
    "world/asia": "এশিয়া",
    "world/europe": "ইউরোপ",
    "world/africa": "আফ্রিকা",
    "world/usa-canada": "যুক্তরাষ্ট্র-কানাডা",
    "world/middle-east": "মধ্যপ্রাচ্য",
    "opinion": "মতামত",
    "capital": "রাজধানী",
    "lifestyle": "জীবন ধারা",
    "lifestyle/beauty-care": "রূপচর্চা",
    "lifestyle/food": "খাবার",
    "lifestyle/fashion": "ফ্যাশন",
    "lifestyle/relationship": "সম্পর্ক",
    "lifestyle/health": "স্বাস্থ্য",
    "photogallery": "ছবি",
    "video-gallery": "ভিডিও",
    "special-samakal": "বিশেষ সমকাল",
    "special-ayojon": "বিশেষ আয়োজন",
    "feature": "ফিচার",
    "chakri": "চাকরি",
    "offbit": "অফবিট",
    "samakal-investigation": "সমকাল অনুসন্ধান",
    "probas": "প্রবাস",
    "technology": "প্রযুক্তি",
    "shilpomoncho": "শিল্পমঞ্চ",
    "travel": "ভ্রমণ",
    "life-struggle": "জীবন সংগ্রাম"
};

const TARGETS = Object.entries(TARGET_MAP).map(([slug, bengaliName]) => ({
    url: `https://samakal.com/${slug}`,
    category: slug,
    bengaliName: bengaliName
}));

async function seed() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        console.log(`✅ Connected! Starting targeted scraping for ${TARGETS.length} categories...\n`);

        // Scrape sequentially to monitor progress closely
        for (const target of TARGETS) {
            await processTarget(target);
            // Small delay between requests
            await new Promise(r => setTimeout(r, 500));
        }

        console.log('\n🎉 Targeted Seeding Complete!');
    } catch (err) {
        console.error('Database Connection Error:', err);
    } finally {
        await client.end();
    }
}

async function processTarget(target) {
    try {
        process.stdout.write(`👉 Scraping ${target.category} (${target.bengaliName})... `);

        const { data } = await axios.get(target.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        let insertedCount = 0;

        // Try multiple selectors
        let newsItems = $('.media, .card, article, .news-item, .content-item');
        if (newsItems.length === 0) newsItems = $('a:has(h3), a:has(h4), a.heading');

        for (let i = 0; i < newsItems.length; i++) {
            if (insertedCount >= 15) break; // Limit to 15 per category for this run

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
                if (!image || image.includes('base64')) image = 'https://samakal.com/common/img/logo.png';

                // Extract or Generate ID
                const parts = link.split('/');
                const idIndex = parts.indexOf('article');
                let publicId, slug;

                if (idIndex !== -1 && parts[idIndex + 1]) {
                    publicId = parseInt(parts[idIndex + 1]);
                    slug = parts[idIndex + 2] || `news-${publicId}`;
                } else {
                    // Fallback for non-standard URLs
                    slug = link.split('/').pop() || `auto-${Date.now()}-${i}`;
                    publicId = Date.now() + i;
                }

                const summary = $(el).find('.brief, p, .summary').first().text().trim() || title;

                // --- FETCH FULL CONTENT ---
                let fullContent = `<p>${summary}</p>`;
                let videoUrl = null;
                let videoThumbnail = null;

                try {
                    const detailResponse = await axios.get(link, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
                        timeout: 5000
                    });
                    const $detail = cheerio.load(detailResponse.data);

                    // Specific selector for Samakal body content
                    const bodyEl = $detail('.dNewsDesc, #contentDetails');
                    if (bodyEl.length > 0) {
                        // Remove scripts, styles, and ads if any
                        bodyEl.find('script, style, ins, .adsbygoogle').remove();
                        fullContent = bodyEl.html().trim();
                    }

                    // --- VIDEO EXTRACTION ---
                    const iframe = $detail('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
                    if (iframe.length > 0) {
                        videoUrl = iframe.attr('src');
                    } else {
                        // Sometimes the video link is in a data attribute or special container
                        const videoLink = $detail('a[href*="youtube.com"], a[href*="youtu.be"]').first();
                        if (videoLink.length > 0) {
                            videoUrl = videoLink.attr('href');
                        }
                    }

                    if (videoUrl) {
                        // Basic thumbnail extraction from YT URL if possible
                        const ytIdMatch = videoUrl.match(/(?:embed\/|v=|v\/|vi\/|youtu\.be\/|\/v\/|watch\?v=|&v=)([^#&?]*).*/);
                        if (ytIdMatch && ytIdMatch[1]) {
                            videoThumbnail = `https://img.youtube.com/vi/${ytIdMatch[1]}/maxresdefault.jpg`;
                        }
                    }

                } catch {
                    // console.error(`Failed to fetch detail for ${link}: ${detailErr.message}`);
                    // Fallback to summary if detail fetch fails
                }

                try {
                    const query = `
                        INSERT INTO "articles" 
                        ("public_id", "title", "slug", "sub_headline", "image", "category", "content", "status", "published_at", "source", "video_url", "video_thumbnail", "created_at", "updated_at")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, 'published', NOW(), 'Targeted Scraper', $8, $9, NOW(), NOW())
                        ON CONFLICT ("slug") 
                        DO UPDATE SET 
                            "category" = EXCLUDED.category,
                            "image" = EXCLUDED.image,
                            "content" = EXCLUDED.content,
                            "video_url" = EXCLUDED.video_url,
                            "video_thumbnail" = EXCLUDED.video_thumbnail,
                            "updated_at" = NOW();
                    `;

                    await client.query(query, [publicId, title, slug, summary, image, target.bengaliName, fullContent, videoUrl, videoThumbnail]);
                    insertedCount++;
                    // Small delay to be polite to Samakal
                    await new Promise(r => setTimeout(r, 200));
                } catch {
                    // console.error(e.message);
                }
            }
        }
        console.log(`[Done] - Saved ${insertedCount} items.`);

    } catch (err) {
        console.log(`[Failed] - ${err.message}`);
    }
}

seed();
