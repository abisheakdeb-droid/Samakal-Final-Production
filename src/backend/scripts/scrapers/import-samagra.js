import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { createClient } from '@vercel/postgres';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

loadEnvConfig(cwd());

const CATEGORY = 'সমগ্র'; // Mapping 'Whole Country' to 'Samagra'
const SOURCE_URL = 'https://samakal.com/whole-country';
const TARGET_COUNT = 20;

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function generateSlug(title, url = '') {
  const input = title + url + Date.now();
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
  } catch {
    return null;
  }
}

async function scrapeArticle(browser, url) {
  const page = await browser.newPage();
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    const articleData = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const title = h1 ? h1.textContent.trim() : '';
      
      const contentDiv = document.querySelector('#contentDetails.dNewsDesc') || document.querySelector('.description');
      const content = contentDiv ? contentDiv.innerHTML : '';
      
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
    
    if (!articleData.title || !articleData.content || articleData.content.length < 100) {
      return null;
    }
    
    return {
      title: articleData.title,
      content: articleData.content,
      imageUrl: articleData.imageUrl,
      originalUrl: url
    };
  } catch {
    await page.close().catch(() => {});
    return null;
  }
}

async function getArticleLinks(browser) {
  const page = await browser.newPage();
  
  try {
    await page.goto(SOURCE_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Auto-scroll to load more items
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight || totalHeight > 5000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    const links = await page.evaluate(() => {
      const articleLinks = [];
      const linkElements = document.querySelectorAll('a[href*="/article/"]');
      linkElements.forEach(link => {
        if (link.href && link.href.includes('/article/') && !articleLinks.includes(link.href)) {
          articleLinks.push(link.href);
        }
      });
      return articleLinks;
    });
    
    await page.close();
    return links;
  } catch {
    await page.close().catch(() => {});
    return [];
  }
}

async function importArticle(articleData, slug) {
  const client = createClient();
  await client.connect();
  
  try {
    const existing = await client.sql`SELECT id FROM articles WHERE title = ${articleData.title} LIMIT 1`;
    if (existing.rows.length > 0) {
        console.log(`  ⚠️ Duplicate: ${articleData.title.substring(0, 30)}...`);
        return false;
    }

    await client.sql`
      INSERT INTO articles (
        id, title, slug, content, image, category,
        status, source, source_url, created_at, published_at
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
        NOW(),
        NOW()
      )
    `;
    return true;
  } catch {
    console.error('  ❌ DB Error:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log(`🚀 Importing ${CATEGORY} articles...`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    console.log('📖 Loading category page...');
    const links = await getArticleLinks(browser);
    console.log(`✅ Found ${links.length} article links\n`);
    
    let success = 0;
    
    for (let i = 0; i < links.length && success < TARGET_COUNT; i++) {
        const url = links[i];
        console.log(`[${i + 1}/${links.length}] Processing: ${url}`);
        
        try {
            const articleData = await scrapeArticle(browser, url);
            
            if (!articleData) {
                console.log('  ❌ Scrape failed');
                continue;
            }
            
            const slug = generateSlug(articleData.title, articleData.originalUrl);
            
            if (articleData.imageUrl) {
                const localImage = await downloadImage(articleData.imageUrl, slug);
                if (localImage) articleData.imageUrl = localImage;
            }
            
            const imported = await importArticle(articleData, slug);
            if (imported) {
                success++;
                console.log(`  ✅ Success! (${success}/${TARGET_COUNT})\n`);
            }
            
            await new Promise(r => setTimeout(r, 1000));
            
        } catch {
            console.error(`Error processing ${url}:`, e.message);
        }
    }
    
    console.log(`\n🎉 Completed! Total imported: ${success}`);
    
  } catch {
    console.error(`\n❌ Fatal error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

main();
