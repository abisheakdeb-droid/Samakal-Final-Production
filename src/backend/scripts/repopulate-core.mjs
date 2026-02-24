
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

// Only core categories
const CORE_TARGETS = [
    { slug: 'latest', bengaliName: 'সর্বশেষ', parent: null },
    { slug: 'bangladesh', bengaliName: 'বাংলাদেশ', parent: null },
    { slug: 'politics', bengaliName: 'রাজনীতি', parent: null },
    { slug: 'world', bengaliName: 'বিশ্ব', parent: null },
    { slug: 'sports', bengaliName: 'খেলা', parent: null },
    { slug: 'entertainment', bengaliName: 'বিনোদন', parent: null },
];

async function populateCore() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        for (const target of CORE_TARGETS) {
            await processTarget(target);
        }

        console.log('\n🎉 Core Population Complete!');
    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

async function processTarget(target) {
    try {
        process.stdout.write(`👉 Scraping ${target.slug}... `);
        const url = target.slug === 'latest' ? 'https://samakal.com/latest/news' : `https://samakal.com/${target.slug}`;

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
            timeout: 10000
        }).catch(e => ({ data: null }));

        if (!data) {
            console.log(`[Skipped]`);
            return;
        }

        const $ = cheerio.load(data);
        let insertedCount = 0;
        let newsItems = $('.media, .card, article, .news-item, .content-item');
        if (newsItems.length === 0) newsItems = $('a:has(h3), a:has(h4), a.heading');

        console.log(`Debug: Found ${newsItems.length} items. Data length: ${data.length}`);
        if (newsItems.length === 0) console.log(`Debug: HTML start: ${data.substring(0, 200)}...`);

        for (let i = 0; i < newsItems.length; i++) {
            if (insertedCount >= 15) break; // Fetch slightly more to ensure coverage

            const el = newsItems[i];
            const isLink = $(el).is('a');
            const linkEl = isLink ? $(el) : $(el).find('a').first();

            let title = $(el).find('.heading, h1, h2, h3, h4, .title').first().text().trim();
            if (!title) title = linkEl.text().trim();
            if (title) title = title.replace(/\| Samakal News$/i, '').replace(/\| সমকাল$/i, '').trim();

            let link = linkEl.attr('href');
            let listImage = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

            if (title && link) {
                if (!link.startsWith('http')) link = `https://samakal.com${link}`;

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

                    const bodyEl = $detail('.dNewsDesc, #contentDetails, .article-content, .details-body, .description');
                    if (bodyEl.length > 0) {
                        bodyEl.find('script, style, ins, .adsbygoogle').remove();
                        fullContent = bodyEl.html().trim();
                    }

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
                        target.parent,
                        fullContent, videoUrl, videoThumbnail, link
                    ]);
                    insertedCount++;
                    await new Promise(r => setTimeout(r, 100));
                } catch (e) {
                    console.error(`Error processing ${link}:`, e.message);
                }
            }
        }
        console.log(`[Done] - Saved ${insertedCount}`);
    } catch (err) {
        console.log(`[Failed]`);
    }
}

populateCore();
