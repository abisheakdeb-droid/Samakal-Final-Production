const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

loadEnvConfig(cwd());

const CATEGORY = 'অর্থনীতি';
const CATEGORY_URL = '/economics/';
const TARGET_COUNT = 6; // Only need 6 more to reach 15

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function generateSlug(title, url = '') {
  // Use both title and URL to ensure uniqueness  
  const input = title +  url + Date.now();
  const hash = crypto.createHash('md5').update(input).digest('hex').substring(0, 12);
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

async function scrapeArticle(browser, url) {
  const page = await browser.newPage();
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });
    
    await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {});
    
    const articleData = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const title = h1 ? h1.textContent.trim() : '';
      
      const contentDiv = document.querySelector('#contentDetails.dNewsDesc');
      const content = contentDiv && contentDiv.innerHTML ? contentDiv.innerHTML : '';
      
      let imageUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        imageUrl = ogImage.getAttribute('content');
      } else {
        const img = document.querySelector('div.DNewsImg img, article img');
        if (img) imageUrl = img.src;
      }
      
      return { title, content, imageUrl };
    });
    
    await page.close();
    
    if (!articleData.title || !articleData.content || articleData.content.length < 200) {
      return null;
    }
    
    return {
      title: articleData.title,
      content: articleData.content,
      imageUrl: articleData.imageUrl,
      originalUrl: url
    };
  } catch (error) {
    await page.close().catch(() => {});
    return null;
  }
}

async function getArticleLinks(browser) {
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://samakal.com${CATEGORY_URL}`, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });
    
    const links = await page.evaluate(() => {
      const articleLinks = [];
      const linkElements = document.querySelectorAll('a[href*="/article/"]');
      
      linkElements.forEach(link => {
        const href = link.href;
        if (href && href.includes('/article/') && !articleLinks.includes(href)) {
          articleLinks.push(href);
        }
      });
      
      return articleLinks;
    });
    
    await page.close();
    return links;
  } catch (error) {
    await page.close().catch(() => {});
    return [];
  }
}

async function importArticle(articleData, slug) {
  const client = await db.connect();
  try {
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
        ${CATEGORY},
        'published',
        'Samakal',
        ${articleData.originalUrl},
        NOW()
      )
    `;
    await client.end();
    return true;
  } catch (error) {
    console.error(`  ⚠️  DB Error: ${error.message}`);
    await client.end();
    return false;
  }
}

async function main() {
  console.log(`🚀 Importing ${CATEGORY} articles...\n`);
  console.log(`📊 Target: ${TARGET_COUNT} additional articles\n`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  let success = 0;
  let failed = 0;
  
  try {
    console.log('📖 Loading category page...');
    const links = await getArticleLinks(browser);
    console.log(`✅ Found ${links.length} article links\n`);
    
    for (let i = 0; i < links.length && success < TARGET_COUNT; i++) {
      const url = links[i];
      console.log(`[${i + 1}] Processing: ${url.substring(0, 60)}...`);
      
      const articleData = await scrapeArticle(browser, url);
      
      if (!articleData) {
        console.log('  ❌ Scrape failed\n');
        failed++;
        continue;
      }
      
      const slug = generateSlug(articleData.title, articleData.originalUrl);
      console.log(`  📝 ${articleData.title.substring(0, 60)}...`);
      
      if (articleData.imageUrl) {
        const localImage = await downloadImage(articleData.imageUrl, slug);
        if (localImage) {
          articleData.imageUrl = localImage;
          console.log(`  ✅ Image saved`);
        }
      }
      
      const imported = await importArticle(articleData, slug);
      
      if (imported) {
        success++;
        console.log(`  ✅ Import successful (${success}/${TARGET_COUNT})\n`);
      } else {
        failed++;
        console.log(`  ❌ Import failed\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${CATEGORY}: ${success} articles imported`);
  console.log(`❌ Failed: ${failed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main();
