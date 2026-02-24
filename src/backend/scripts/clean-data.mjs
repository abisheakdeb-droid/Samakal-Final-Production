
import dotenv from 'dotenv';
import pg from 'pg';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: '.env.local' });
const { Client } = pg;

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ Error: POSTGRES_URL or DATABASE_URL not found.");
    process.exit(1);
}

const client = new Client({ connectionString });

async function cleanData() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        // 1. Clean Titles
        console.log('🧹 Cleaning titles...');
        const titleRes = await client.query(`
            UPDATE articles 
            SET title = TRIM(REPLACE(REPLACE(title, '| Samakal News', ''), '| সমকাল', ''))
            WHERE title LIKE '%| Samakal News%' OR title LIKE '%| সমকাল%';
        `);
        console.log(`✅ Cleaned ${titleRes.rowCount} titles.`);

        // 2. Find articles with missing body (short content)
        console.log('🔍 Finding articles with missing body...');
        const missingBodyRes = await client.query(`
            SELECT id, source_url FROM articles 
            WHERE LENGTH(content) < 200 AND source_url IS NOT NULL
            LIMIT 50; 
        `); // limit to 50 for safety in this run

        console.log(`👉 Found ${missingBodyRes.rows.length} items to re-scrape.`);

        for (const row of missingBodyRes.rows) {
            await reScrapeBody(row.id, row.source_url);
            await new Promise(r => setTimeout(r, 500));
        }

        console.log('\n🎉 Data Clean Complete!');
    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

async function reScrapeBody(id, url) {
    try {
        process.stdout.write(`   Re-scraping ID ${id}... `);
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
            timeout: 5000
        });
        const $ = cheerio.load(data);

        const bodyEl = $('.dNewsDesc, #contentDetails, .article-content, .details-body, .description');
        let fullContent = '';
        let detailImage = null;

        if (bodyEl.length > 0) {
            bodyEl.find('script, style, ins, .adsbygoogle').remove();
            fullContent = bodyEl.html().trim();
        }

        // Extract Detail Page Image (Higher Quality)
        const detailImgEl = $('.detail-image img, .feature-image img, .gallery-image img').first();
        let dImg = detailImgEl.attr('src') || detailImgEl.attr('data-src');
        if (dImg) {
            if (!dImg.startsWith('http')) {
                if (dImg.startsWith('//')) dImg = `https:${dImg}`;
                else dImg = `https://samakal.com${dImg}`;
            }
            detailImage = dImg;
        }

        if (fullContent.length > 200) {
            if (detailImage) {
                await client.query(`UPDATE articles SET content = $1, image = $2, updated_at = NOW() WHERE id = $3`, [fullContent, detailImage, id]);
                console.log(`[Updated Body + Image]`);
            } else {
                await client.query(`UPDATE articles SET content = $1, updated_at = NOW() WHERE id = $2`, [fullContent, id]);
                console.log(`[Updated Body Only]`);
            }
        } else {
            console.log(`[Skipped - Still Short]`);
        }

    } catch (e) {
        console.log(`[Failed]`);
    }
}

cleanData();
