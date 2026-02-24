
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
const { Client } = pg;

// Database connection
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ Error: POSTGRES_URL or DATABASE_URL not found in environment variables.");
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

const TARGETS = [
    { url: 'https://samakal.com/politics', category: 'politics' },
    { url: 'https://samakal.com/bangladesh', category: 'bangladesh' },
    { url: 'https://samakal.com/sports', category: 'sports' },
    { url: 'https://samakal.com/entertainment', category: 'entertainment' },
    { url: 'https://samakal.com/economics', category: 'economics' },
    { url: 'https://samakal.com/technology', category: 'technology' },
    { url: 'https://samakal.com/education', category: 'education' },
    { url: 'https://samakal.com/opinion', category: 'opinion' }
];

async function seed() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected! Starting scraping...\n');

        for (const target of TARGETS) {
            console.log(`🔍 Processing: ${target.url} (${target.category})...`);

            try {
                const { data } = await axios.get(target.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });

                const $ = cheerio.load(data);
                let insertedCount = 0;

                // Try finding links inside common article wrappers
                // Samakal seems to use <a> tags with headers directly in some sections
                let newsItems = $('.media, .card, article, .news-item');

                // Fallback: If no containers found, look for headings with links
                if (newsItems.length === 0) {
                    // Find all anchor tags that contain an h1-h6 child or have a class resembling a title
                    newsItems = $('a:has(h3), a:has(h4), a.heading, .heading a');
                }

                console.log(`   👉 Found ${newsItems.length} potential items`);

                for (let i = 0; i < newsItems.length; i++) {
                    if (insertedCount >= 10) break;

                    const el = newsItems[i];

                    // Determine if 'el' is the link itself or a container
                    const isLink = $(el).is('a');
                    const linkEl = isLink ? $(el) : $(el).find('a').first();

                    // Title strategy: Text of header inside, or text of link itself
                    let title = $(el).find('.heading, h1, h2, h3, h4, .title').first().text().trim();
                    if (!title) title = linkEl.text().trim(); // Fallback to link text

                    let link = linkEl.attr('href');
                    let image = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

                    // If no image in container, maybe previous sibling or parent has it? (Skip complex traversal for now)

                    if (title && link) {
                        if (!link.startsWith('http')) link = `https://samakal.com${link}`;

                        // Extract ID from URL: .../article/339104/...
                        const parts = link.split('/');
                        const idIndex = parts.indexOf('article');

                        let publicId, slug;

                        if (idIndex !== -1 && parts[idIndex + 1]) {
                            publicId = parseInt(parts[idIndex + 1]);
                            slug = parts[idIndex + 2] || `news-${publicId}`;
                        } else {
                            // Skip if no valid article ID found (likely nav links or ads)
                            continue;
                        }

                        // Summary strategy: Look for .brief, p, or .summary
                        const summary = $(el).find('.brief, p, .summary').first().text().trim() || title;

                        const query = `
               INSERT INTO "articles" ("public_id", "title", "slug", "sub_headline", "image", "category", "content", "status", "published_at", "source", "created_at", "updated_at")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
               ON CONFLICT ("slug") DO NOTHING;
             `;

                        const content = `<p>${summary}</p><p> বিস্তারিত আসছে...</p>`;
                        const status = 'published';
                        const publishedAt = new Date().toISOString();
                        const source = 'Samakal Scraper';

                        try {
                            await client.query(query, [publicId, title, slug, summary, image, target.category, content, status, publishedAt, source]);
                            insertedCount++;
                        } catch (dbErr) {
                            if (dbErr.code === '23505') {
                                // Duplicate, ignore
                            } else {
                                console.error(`      DB Insert Error: ${dbErr.message}`);
                            }
                        }
                    }
                }
                console.log(`   └─ ✅ ${insertedCount} articles added.`);

            } catch (err) {
                console.error(`   ❌ ${target.category} Failed:`, err.message);
            }
        }

        console.log('\n🎉 Success! Database seeded.');

    } catch (err) {
        console.error('Database Connection Error:', err);
    } finally {
        await client.end();
    }
}

seed();
