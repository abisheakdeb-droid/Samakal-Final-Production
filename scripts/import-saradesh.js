import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

loadEnvConfig(cwd());

const ARTICLES_TO_IMPORT = [
  "https://samakal.com/whole-country/article/337887",
  "https://samakal.com/whole-country/article/337886",
  "https://samakal.com/whole-country/article/337885",
  "https://samakal.com/whole-country/article/337884",
  "https://samakal.com/whole-country/article/337881",
  "https://samakal.com/whole-country/article/337878",
  "https://samakal.com/whole-country/article/337872",
  "https://samakal.com/whole-country/article/337871",
  "https://samakal.com/whole-country/article/337869",
  "https://samakal.com/whole-country/article/337868",
  "https://samakal.com/whole-country/article/337867",
  "https://samakal.com/whole-country/article/337866",
  "https://samakal.com/whole-country/article/337865",
  "https://samakal.com/whole-country/article/337864",
  "https://samakal.com/whole-country/article/337863",
  "https://samakal.com/whole-country/article/337861",
  "https://samakal.com/whole-country/article/337855",
  "https://samakal.com/whole-country/article/337854",
  "https://samakal.com/whole-country/article/337851",
  "https://samakal.com/whole-country/article/337849",
  "https://samakal.com/whole-country/article/337848",
  "https://samakal.com/whole-country/article/337847",
  "https://samakal.com/whole-country/article/337845",
  "https://samakal.com/whole-country/article/337843",
  "https://samakal.com/whole-country/article/337841",
  "https://samakal.com/whole-country/article/337840",
  "https://samakal.com/whole-country/article/337839",
  "https://samakal.com/whole-country/article/337837",
  "https://samakal.com/whole-country/article/337835",
  "https://samakal.com/whole-country/article/337833"
];

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'articles');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// BENGALI DISTRICT TO SLUG MAPPING (for auto-categorization)
const DISTRICT_MAP = {
  'মুন্সীগঞ্জ': 'munshiganj',
  'গোপালগঞ্জ': 'gopalganj',
  'হবিগঞ্জ': 'habiganj',
  'জামালপুর': 'jamalpur',
  'চট্টগ্রাম': 'chattogram',
  'খুলনা': 'khulna',
  'কক্সবাজার': 'coxs-bazar',
  'মানিকগঞ্জ': 'manikganj',
  'ফরিদপুর': 'faridpur',
  'রাজশাহী': 'rajshahi',
  'রাউজান': 'chattogram',
  'শরীয়তপুর': 'shariatpur',
  'কুমারখালী': 'kushtia',
  'পাবনা': 'pabna',
  'শ্যামনগর': 'satkhira',
  'সিলেট': 'sylhet',
  'চরফ্যাসন': 'bhola',
  'মুরাদনগর': 'comilla'
};

function generateSlug(title) {
  const hash = crypto.createHash('md5').update(title).digest('hex').substring(0, 8);
  return `saradesh-${hash}`;
}

async function downloadImage(imageUrl, articleSlug) {
  if (!imageUrl) return null;
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 10000
    });
    const ext = '.jpg';
    const filename = `${articleSlug}-${Date.now()}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, response.data);
    return `/uploads/articles/${filename}`;
  } catch (error) {
    console.log(`    ⚠️ Image download failed: ${error.message}`);
    return null;
  }
}

async function scrapeArticle(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const articleData = await page.evaluate(() => {
        const title = document.querySelector('h1')?.innerText?.trim() || '';
        const content = document.querySelector('.dNewsDesc')?.innerHTML || '';
        const image = document.querySelector('.DNewsImg img')?.src || '';
        const author = document.querySelector('.writter')?.innerText?.trim() || 'ডেস্ক রিপোর্ট';
        
        return { title, content, image, author };
    });

    return { ...articleData, originalUrl: url };
  } catch (error) {
    console.error(`  ❌ Failed to scrape ${url}: ${error.message}`);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Starting Saradesh Import...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const client = await db.connect();
  
  let successCount = 0;

  try {
    // Get Admin User
    const users = await client.sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
    const authorId = users.rows[0]?.id;

    if (!authorId) {
      console.error('No admin user found. Please ensure you have an admin user in the database.');
      return;
    }

    for (let i = 0; i < ARTICLES_TO_IMPORT.length; i++) {
      const url = ARTICLES_TO_IMPORT[i];
      console.log(`[${i+1}/${ARTICLES_TO_IMPORT.length}] Processing: ${url}`);

      const data = await scrapeArticle(browser, url);
      if (!data || !data.title) {
        console.log('  ❌ Scrape failed');
        continue;
      }

      // Check for existence
      const existing = await client.sql`SELECT id FROM articles WHERE source_url = ${url} LIMIT 1`;
      if (existing.rowCount > 0) {
        console.log('  ok Skipped (Already exists)');
        continue;
      }

      const slug = generateSlug(data.title);
      const localImage = await downloadImage(data.image, slug);

      // Auto-categorize based on title/category
      let category = 'saradesh';
      for (const [district, slug] of Object.entries(DISTRICT_MAP)) {
        if (data.title.includes(district)) {
          category = slug;
          break;
        }
      }

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
          ${category},
          'saradesh',
          'published',
          'Samakal',
          ${url},
          ${authorId},
          NOW(),
          NOW()
        )
      `;

      console.log(`  ✅ Imported as ${category}`);
      successCount++;
      
      // Delay to be polite
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (err) {
    console.error('Fatal Error:', err);
  } finally {
    await browser.close();
    await client.end();
  }

  console.log(`\nDone. Imported ${successCount} articles.`);
}

main().catch(console.error);
