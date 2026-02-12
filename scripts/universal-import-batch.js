const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

loadEnvConfig(cwd());

// Command line arguments
const args = process.argv.slice(2);
const CATEGORY_NAME = args[0]; // e.g. "Feature"
const CATEGORY_URL = args[1];  // e.g. "/feature/"
const TARGET_COUNT = parseInt(args[2] || '15', 10);

if (!CATEGORY_NAME || !CATEGORY_URL) {
  console.error('Usage: node scripts/universal-import-batch.js <CategoryName> <CategoryUrl> [TargetCount]');
  process.exit(1);
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function generateSlug(title, url = '') {
  const hash = crypto.createHash('md5').update(title + url).digest('hex').substring(0, 12);
  return `article-${hash}`;
}

async function downloadImage(imageUrl, articleSlug) {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 10000
    });
    
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `${articleSlug}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    fs.writeFileSync(filepath, response.data);
    return `/uploads/articles/${filename}`;
  } catch (error) {
    return null;
  }
}

async function scrapeArticle(browser, url, categoryName) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    
    const articleData = await page.evaluate(() => {
        // Try multiple selectors for flexibility
        const getTitle = () => {
            const h1 = document.querySelector('h1');
            if (h1) return h1.textContent.trim();
            const titleEl = document.querySelector('.title, .article-title');
            return titleEl ? titleEl.textContent.trim() : '';
        };

        const getContent = () => {
             const contentDiv = document.querySelector('#contentDetails.dNewsDesc');
             if (contentDiv) return contentDiv.innerHTML;
             const articleBody = document.querySelector('article, .article-content');
             return articleBody ? articleBody.innerHTML : '';
        };

        const getImage = () => {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) return ogImage.getAttribute('content');
            const img = document.querySelector('div.DNewsImg img, article img');
            return img ? img.src : '';
        };

        return {
            title: getTitle(),
            content: getContent(),
            imageUrl: getImage(),
            date: new Date().toISOString()
        };
    });

    if (!articleData.title || !articleData.content || articleData.content.length < 200) {
      console.log(`    ⚠️ Scrape incomplete: Title=${!!articleData.title}, ContentLen=${articleData.content ? articleData.content.length : 0}`);
      return null;
    }
    
    return {
      ...articleData,
      originalUrl: url
    };
  } catch (error) {
    return null;
  } finally {
    await page.close().catch(() => {});
  }
}

async function getArticleLinks(browser, categoryUrl) {
  const page = await browser.newPage();
  try {
    const fullUrl = `https://samakal.com${categoryUrl}`;
    console.log(`📖 Visiting: ${fullUrl}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 20000 });
    
    const links = await page.evaluate((catUrl) => {
      const uniqueLinks = new Set();
      const anchors = document.querySelectorAll('a[href]');
      
      anchors.forEach(a => {
        const href = a.getAttribute('href');
        // STRICTER FILTER: Must contain /article/ to be considered an article
        if (href && href.includes('/article/') && !href.includes('#')) {
            const fullLink = href.startsWith('http') ? href : `https://samakal.com${href}`;
            uniqueLinks.add(fullLink);
        }
      });
      return Array.from(uniqueLinks);
    }, categoryUrl);
    
    return links;
  } catch (error) {
    console.error('Failed to get links:', error.message);
    return [];
  } finally {
    await page.close().catch(() => {});
  }
}

async function importArticle(articleData, slug) {
  // OPEN NEW CONNECTION PER ARTICLE TO AVOID TIMEOUTS
  const client = await db.connect();
  try {
    // Check for existing
    const existing = await client.sql`
        SELECT id FROM articles 
        WHERE source_url = ${articleData.originalUrl} OR title = ${articleData.title}
        LIMIT 1
    `;
    
    if (existing.rowCount > 0) {
        return 'skipped';
    }

    await client.sql`
      INSERT INTO articles (
        id, title, slug, content, image, category,
        status, source, source_url, created_at
      ) VALUES (
        gen_random_uuid(),
        ${articleData.title},
        ${slug},
        ${articleData.content},
        ${articleData.imageUrl},
        ${CATEGORY_NAME},
        'published',
        'Samakal',
        ${articleData.originalUrl},
        NOW()
      )
    `;
    return 'imported';
  } catch (error) {
    console.error(`  ⚠️  DB Error: ${error.message}`);
    return 'failed';
  } finally {
    await client.end();
  }
}

async function main() {
  console.log(`🚀 Starting Universal Batch Import for: ${CATEGORY_NAME}`);
  console.log(`Target: ${TARGET_COUNT} articles`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  let successCount = 0;
  
  try {
    const links = await getArticleLinks(browser, CATEGORY_URL);
    console.log(`Found ${links.length} potential links.`);
    
    for (let i = 0; i < links.length && successCount < TARGET_COUNT; i += 1) {
        const url = links[i];
        console.log(`[${i+1}/${links.length}] Scrape: ${url.substring(0, 60)}...`);
        
        const data = await scrapeArticle(browser, url, CATEGORY_NAME);
        if (!data) {
            console.log('  ❌ Scrape failed or insufficient content');
            continue;
        }
        
        const slug = generateSlug(data.title, data.originalUrl);
        if (data.imageUrl) {
            const localImg = await downloadImage(data.imageUrl, slug);
            if (localImg) data.imageUrl = localImg;
        }
        
        const result = await importArticle(data, slug);
        if (result === 'imported') {
            console.log('  ✅ Imported');
            successCount++;
        } else if (result === 'skipped') {
            console.log('  ok Skipped (Duplicate)');
        } else {
            console.log('  ❌ Database Failed');
        }
        
        // Small delay
        await new Promise(r => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error('Fatal Error:', err);
  } finally {
    await browser.close();
  }
  
  console.log(`\nDone. Imported ${successCount} new articles for ${CATEGORY_NAME}.`);
}

main().catch(console.error);
