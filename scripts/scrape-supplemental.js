import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

loadEnvConfig(cwd());

// Only import from these two categories
const CATEGORY_MAP = {
  '/economics/': 'অর্থনীতি',
  '/opinion/': 'Opinion'
};

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Generate slug from Bengali title
function generateSlug(title) {
  const hash = crypto.createHash('md5').update(title).digest('hex').substring(0, 8);
  return `-${hash}`;
}

// Download and save image
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
    console.error(`  ❌ Image download failed: ${error.message}`);
    return null;
  }
}

// Extract article data using Puppeteer
async function scrapeArticle(browser, url, category) {
  const page = await browser.newPage();
  let pageClosed = false;
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });
    
    await page.waitForSelector('h1, .title', { timeout: 5000 }).catch(() => {});
    
    const articleData = await page.evaluate(() => {
      const titleSelectors = ['h1.font-bold', 'h1', '.article-title', '.title', '[itemprop="headline"]'];
      let title = '';
      for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          title = el.textContent.trim();
          break;
        }
      }
      
      let content = '';
      const contentDiv = document.querySelector('#contentDetails.dNewsDesc');
      if (contentDiv && contentDiv.innerHTML) {
        content = contentDiv.innerHTML;
      }
      
      let imageUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        imageUrl = ogImage.getAttribute('content');
      } else {
        const img = document.querySelector('div.DNewsImg img, article img');
        if (img) imageUrl = img.src;
      }
      
      const dateSelectors = ['time', '.date', '.published-date', '[itemprop="datePublished"]'];
      let dateText = '';
      for (const selector of dateSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          dateText = el.textContent.trim() || el.getAttribute('datetime') || '';
          if (dateText) break;
        }
      }
      
      return { title, content, imageUrl, dateText };
    });
    
    if (!articleData.title || !articleData.content || articleData.content.length < 200) {
      throw new Error('Insufficient content extracted');
    }
    
    return {
      title: articleData.title,
      content: articleData.content,
      imageUrl: articleData.imageUrl,
      date: articleData.dateText,
      category,
      originalUrl: url
    };
  } catch (error) {
    console.error(`  ❌ Scrape failed: ${error.message}`);
    return null;
  } finally {
    if (!pageClosed) {
      await page.close().catch(() => {});
    }
  }
}

// Get article links from category page
async function getArticleLinks(browser, categoryUrl, limit = 55) {
  const page = await browser.newPage();
  
  try {
    console.log(`\n📖 Loading category: ${categoryUrl}`);
    
    await page.goto(`https://samakal.com${categoryUrl}`, {
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
    
    console.log(`  ✅ Found ${links.length} article links`);
    await page.close();
    
    return links.slice(0, limit);
  } catch (error) {
    console.error(`  ❌ Failed to load category: ${error.message}`);
    await page.close();
    return [];
  }
}

// Import single article to database
async function importArticle(client, articleData, slug) {
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
        ${articleData.category},
        'published',
        'Samakal',
        ${articleData.originalUrl || ''},
        NOW()
      )
    `;
    return true;
  } catch (error) {
    console.error(`  ❌ Database import failed: ${error.message}`);
    return false;
  }
}

// Main import function
async function importFromSamakal() {
  console.log('🚀 Starting supplemental import for Economics and Opinion...\n');
  console.log('📊 Target: 50+ articles per category');
  console.log('🌐 Source: https://samakal.com\n\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    byCategory: {}
  };
  
  for (const [categoryUrl, categoryName] of Object.entries(CATEGORY_MAP)) {
    console.log(`━━━ ${categoryName} ━━━`);
    stats.byCategory[categoryName] = { success: 0, failed: 0 };
    
    const articleLinks = await getArticleLinks(browser, categoryUrl);
    
    let categoryCount = 0;
    for (let i = 0; i < articleLinks.length; i++) {
      const url = articleLinks[i];
      stats.total++;
      
      console.log(`\n[${stats.total}] Processing: ${url.substring(0, 50)}...`);
      
      const articleData = await scrapeArticle(browser, url, categoryName);
      
      if (!articleData) {
        stats.failed++;
        stats.byCategory[categoryName].failed++;
        continue;
      }
      
      const slug = generateSlug(articleData.title);
      console.log(`  📝 Title: ${articleData.title.substring(0, 60)}...`);
      console.log(`  🔗 Slug: ${slug}`);
      
      if (articleData.imageUrl) {
        console.log(`  🖼️  Downloading image...`);
        const localImagePath = await downloadImage(articleData.imageUrl, slug);
        if (localImagePath) {
          articleData.imageUrl = localImagePath;
          console.log(`  ✅ Image saved: ${localImagePath}`);
        }
      }
      
      console.log(`  💾 Importing to database...`);
      
      // Create fresh connection for each import to avoid timeout
      let client;
      try {
        client = await db.connect();
        const imported = await importArticle(client, articleData, slug);
        
        if (imported) {
          stats.success++;
          categoryCount++;
          stats.byCategory[categoryName].success++;
          console.log(`  ✅ Import successful (${categoryCount}/50)`);
        } else {
          stats.failed++;
          stats.byCategory[categoryName].failed++;
        }
      } catch (error) {
        console.error(`  ❌ Database error: ${error.message}`);
        stats.failed++;
        stats.byCategory[categoryName].failed++;
      } finally {
        if (client) {
          await client.end().catch(() => {});
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (categoryCount >= 50) break;
    }
    
    console.log(`\n✅ ${categoryName}: ${categoryCount} articles imported\n`);
  }
  
  await browser.close();
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 IMPORT STATISTICS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total processed: ${stats.total}`);
  console.log(`Successful: ${stats.success}`);
  console.log(`Failed: ${stats.failed}`);
  console.log('\n📈 By Category:');
  console.table(stats.byCategory);
  console.log('\n✨ Import completed!');
}

importFromSamakal().catch(console.error);
