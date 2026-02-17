const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

loadEnvConfig(cwd());

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function generateSlug(title) {
    const hash = crypto.createHash('md5').update(title + Date.now()).digest('hex').substring(0, 8);
    return `import-${hash}`;
}

async function downloadImage(imageUrl, articleSlug) {
    if (!imageUrl || imageUrl.includes('data:image')) return null;
    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer',
            timeout: 10000
        });
        const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
        const filename = `${articleSlug}-${Date.now()}${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filepath, response.data);
        return `/uploads/articles/${filename}`;
    } catch (error) {
        return null;
    }
}

async function getArticleLinks(browser, sectionUrl) {
    const page = await browser.newPage();
    try {
        await page.goto(sectionUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            return anchors
                .map(a => a.href)
                .filter(href => href && href.includes('/article/'))
                .filter((value, index, self) => self.indexOf(value) === index);
        });
        return links;
    } catch (error) {
        console.error(`  ❌ Failed to get links from ${sectionUrl}: ${error.message}`);
        return [];
    } finally {
        await page.close();
    }
}

async function scrapeArticle(browser, url) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const data = await page.evaluate(() => {
            const title = document.querySelector('h1')?.innerText?.trim();
            const content = document.querySelector('.dNewsDesc')?.innerHTML || document.querySelector('.description')?.innerHTML;
            const image = document.querySelector('.DNewsImg img')?.src || document.querySelector('meta[property="og:image"]')?.content;
            const author = document.querySelector('.writter')?.innerText?.trim() || 'ডেস্ক রিপোর্ট';
            return { title, content, image, author };
        });
        return { ...data, sourceUrl: url };
    } catch (error) {
        return null;
    } finally {
        await page.close();
    }
}

async function main() {
    const args = process.argv.slice(2);
    const targetSection = args[0] || 'whole-country'; // Default to Saradesh
    const targetCategory = args[1] || 'সারাদেশ';
    const targetParent = args[2] || 'সারাদেশ';
    const limit = parseInt(args[3]) || 5;

    const sectionUrl = targetSection.startsWith('http')
        ? targetSection
        : `https://samakal.com/${targetSection}`;

    console.log(`🚀 Universal Importer starting for: ${sectionUrl}`);
    console.log(`🎯 Target Category: ${targetCategory}, Parent: ${targetParent}, Limit: ${limit}`);

    const browser = await puppeteer.launch({ headless: 'new' });
    const client = await db.connect();

    try {
        const adminRes = await client.sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
        const authorId = adminRes.rows[0]?.id;

        if (!authorId) throw new Error('Admin user not found');

        const links = await getArticleLinks(browser, sectionUrl);
        console.log(`✅ Found ${links.length} article links`);

        let importedCount = 0;
        for (const link of links) {
            if (importedCount >= limit) break;

            const existing = await client.sql`SELECT id FROM articles WHERE source_url = ${link} LIMIT 1`;
            if (existing.rowCount > 0) {
                console.log(`  ⏭️ Skipping existing: ${link}`);
                continue;
            }

            console.log(`  📥 Scraping: ${link}`);
            const data = await scrapeArticle(browser, link);
            if (!data || !data.title || !data.content) {
                console.log(`  ❌ Failed to scrape content for ${link}`);
                continue;
            }

            const slug = generateSlug(data.title);
            const localImage = await downloadImage(data.image, slug);

            await client.sql`
        INSERT INTO articles (
          id, title, slug, content, image, category, parent_category,
          status, source, source_url, author_id, created_at, published_at
        ) VALUES (
          gen_random_uuid(),
          ${data.title},
          ${slug},
          ${data.content},
          ${localImage || data.image},
          ${targetCategory},
          ${targetParent},
          'published',
          'Samakal',
          ${link},
          ${authorId},
          NOW(),
          NOW()
        )
      `;

            console.log(`  ✅ Imported: ${data.title.substring(0, 40)}...`);
            importedCount++;
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log(`\n🎉 Done! Imported ${importedCount} articles.`);

    } catch (err) {
        console.error('❌ Fatal error:', err);
    } finally {
        await browser.close();
        await client.end();
    }
}

main().catch(console.error);
