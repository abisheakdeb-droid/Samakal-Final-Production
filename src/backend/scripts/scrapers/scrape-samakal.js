import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

loadEnvConfig(cwd());

// Category mapping from Samakal.com URLs to our database categories
const CATEGORY_MAP = {
  '/bangladesh/': 'Bangladesh',
  '/politics/': 'Politics',
  '/economics/': 'অর্থনীতি',  // Changed from /economy/ to /economics/
  '/sports/': 'Sports',
  '/entertainment/': 'Entertainment',
  '/international/': 'International',
  '/opinion/': 'Opinion',
  '/feature/': 'Feature',
  '/samagra/': 'Samagra',
  '/sahitya/': 'Literature'
};

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Generate slug from Bengali title
function generateSlug(title) {
  // For Bengali text, use a hash-based approach
  const hash = crypto.createHash('md5').update(title).digest('hex').substring(0, 8);
  return `article-${hash}`;
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


// Extract article data using Puppeteer (handles JavaScript rendering)
async function scrapeArticle(browser, url, category) {
  const page = await browser.newPage();
  let pageClosed = false;
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });
    
    // Wait for content to load
    await page.waitForSelector('h1, .title', { timeout: 5000 }).catch(() => {});
    
    // Extract data using page.evaluate (runs in browser context)
    const articleData = await page.evaluate(() => {
      // Extract title
      const titleSelectors = ['h1.font-bold', 'h1', '.article-title', '.title', '[itemprop="headline"]'];
      let title = '';
      for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          title = el.textContent.trim();
          break;
        }
      }
      
      // Extract content - Samakal uses #contentDetails.dNewsDesc
      let content = '';
      const contentDiv = document.querySelector('#contentDetails.dNewsDesc');
      if (contentDiv && contentDiv.innerHTML) {
        content = contentDiv.innerHTML;
      }
      
      // Extract image - Check og:image meta tag first, then div.DNewsImg img
      let imageUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        imageUrl = ogImage.getAttribute('content');
      } else {
        const img = document.querySelector('div.DNewsImg img, article img');
        if (img) imageUrl = img.src;
      }
      
      // Extract date
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
    
    // Validate extracted data
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
    // Always close page in finally block to avoid double-close
    if (!pageClosed) {
      await page.close().catch(() => {}); // Ignore close errors
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
      timeout: 30000
    });
    
    // Extract article links
    const links = await page.evaluate(() => {
      const articleLinks = new Set();
      document.querySelectorAll('a[href*="/bangladesh/"], a[href*="/politics/"], a[href*="/economy/"], a[href*="/sports/"], a[href*="/entertainment/"], a[href*="/international/"]').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes('/') && !href.includes('#') && !href.includes('category')) {
          articleLinks.add(href.startsWith('http') ? href : `https://samakal.com${href}`);
        }
      });
      return Array.from(articleLinks);
    });
    
    console.log(`  ✅ Found ${links.length} article links`);
    return links.slice(0, limit);
  } catch (error) {
    console.error(`  ❌ Failed to load category: ${error.message}`);
    return [];
  } finally {
    await page.close();
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
  const browser = await puppeteer.launch({ headless: 'new' });
  const client = await db.connect();
  
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    byCategory: {}
  };
  
  try {
    console.log('🚀 Starting Samakal.com content import...\n');
    console.log('📊 Target: 50+ articles per category');
    console.log('🌐 Source: https://samakal.com\n');
    
    for (const [categoryPath, categoryName] of Object.entries(CATEGORY_MAP)) {
      console.log(`\n━━━ ${categoryName} ━━━`);
      stats.byCategory[categoryName] = { success: 0, failed: 0 };
      
      // Get article links
      const links = await getArticleLinks(browser, categoryPath, 55);
      
      // Process each article
      let processedCount = 0;
      for (const link of links) {
        if (processedCount >= 50) break; // Limit to 50 per category
        
        stats.total++;
        console.log(`\n[${stats.total}] Processing: ${link.substring(0, 60)}...`);
        
        // Scrape article using Puppeteer
        const articleData = await scrapeArticle(browser, link, categoryName);
        if (!articleData) {
          stats.failed++;
          stats.byCategory[categoryName].failed++;
          continue;
        }
        
        // Generate slug
        const slug = generateSlug(articleData.title);
        console.log(`  📝 Title: ${articleData.title.substring(0, 50)}...`);
        console.log(`  🔗 Slug: ${slug}`);
        
        // Download image
        if (articleData.imageUrl) {
          console.log(`  🖼️  Downloading image...`);
          const localImagePath = await downloadImage(articleData.imageUrl, slug);
          if (localImagePath) {
            articleData.imageUrl = localImagePath;
            console.log(`  ✅ Image saved: ${localImagePath}`);
          }
        }
        
        // Import to database
        console.log(`  💾 Importing to database...`);
        const imported = await importArticle(client, articleData, slug);
        
        if (imported) {
          stats.success++;
          stats.byCategory[categoryName].success++;
          processedCount++;
          console.log(`  ✅ Import successful (${processedCount}/50)`);
        } else {
          stats.failed++;
          stats.byCategory[categoryName].failed++;
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`\n✅ ${categoryName}: ${stats.byCategory[categoryName].success} articles imported`);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  } finally {
    await browser.close();
    await client.end();
  }
  
  // Print final statistics
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 IMPORT STATISTICS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total processed: ${stats.total}`);
  console.log(`Successful: ${stats.success}`);
  console.log(`Failed: ${stats.failed}`);
  console.log('\n📈 By Category:');
  console.table(stats.byCategory);
  console.log('\n✨ Import completed!');
}

importFromSamakal();
