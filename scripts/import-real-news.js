import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { cwd } from 'process';
import { db } from '@vercel/postgres';

// Load environment variables
loadEnvConfig(cwd());

const parser = new Parser();

// Feed Configurations
const FEEDS = [
  {
    source: 'Prothom Alo',
    url: 'https://www.prothomalo.com/feed/',
    type: 'rss'
  },
  {
    source: 'Samakal',
    url: 'https://samakal.com/rss.xml',
    type: 'manual'
  }
];

// Category Mapping (Bengali to English Enum)
const CATEGORY_MAP = {
  'রাজনীতি': 'Politics',
  'বাংলাদেশ': 'Bangladesh',
  'সারাদেশ': 'Bangladesh',
  'বিশ্ব': 'World',
  'খেলা': 'Sports',
  'ক্রিকেট': 'Sports',
  'ফুটবল': 'Sports',
  'বিনোদন': 'Entertainment',
  'বাণিজ্য': 'Business',
  'অর্থনীতি': 'Business',
  'মতামত': 'Opinion',
  'প্রযুক্তি': 'Technology',
  'জীবনযাপন': 'Lifestyle',
  'চাকরি': 'Jobs',
  'শিক্ষা': 'Education',
  'অপরাধ': 'Crime',
  'রাজধানী': 'Capital',
};

function mapCategory(rawCategories) {
  if (!rawCategories || rawCategories.length === 0) return 'General';
  
  // Handle if category is a string or array
  const categories = Array.isArray(rawCategories) ? rawCategories : [rawCategories];
  
  for (const cat of categories) {
    const normalized = cat.trim();
    if (CATEGORY_MAP[normalized]) {
      return CATEGORY_MAP[normalized];
    }
  }
  return 'Bangladesh'; // Default fallback
}

// Generate Slug
function generateSlug(title) {
  return 'article-' + slugify(title, {
    lower: true,
    strict: true,
    locale: 'bn', // Bengali locale support might vary, but strict removes special chars
    trim: true
  }) + '-' + Math.floor(Math.random() * 1000);
}

async function importNews(client) {
  try {
    // Get Admin User
    const users = await client.sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
    const authorId = users.rows[0]?.id;

    if (!authorId) {
      console.error('No admin user found. Run seed-admin.js first.');
      return;
    }

    let totalImported = 0;

    for (const feedConfig of FEEDS) {
      console.log(`\n📡 Fetching feed: ${feedConfig.source}...`);
      
      try {
        let items = [];

        // Manual Parsing for Samakal (or if RSS Parser fails)
        if (feedConfig.type === 'manual') {
            const response = await fetch(feedConfig.url, {
                headers: {
                    // Mimic curl to bypass simple bot protection that allows curl
                    'User-Agent': 'curl/7.64.1',
                    'Accept': '*/*'
                }
            });
            const text = await response.text();
            
            // Log if weird response
            if (!text.includes('<rss') && !text.includes('<feed') && !text.includes('<channel')) {
                console.warn(`Invalid XML response from ${feedConfig.source} (Size: ${text.length}). First 100 chars: ${text.substring(0, 100)}...`);
                // If it's HTML, we might need a different UA or just skip
                continue;
            }

            const $ = cheerio.load(text, { xmlMode: true });
            
            $('item').each((i, el) => {
                const title = $(el).find('title').text();
                const link = $(el).find('link').text();
                const description = $(el).find('description').text();
                const pubDate = $(el).find('pubDate').text();
                const category = $(el).find('category').first().text();
                
                let img = $(el).find('media\\:content, content').attr('url');
                if (!img) {
                    const match = description.match(/<img[^>]+src="([^">]+)"/);
                    if (match) img = match[1];
                }

                items.push({
                    title,
                    link,
                    content: description,
                    isoDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                    categories: [category],
                    imageUrl: img
                });
            });
            
            console.log(`   Found ${items.length} items manually.`);
        } else {
            // Standard RSS Parser for Prothom Alo
            const feed = await parser.parseURL(feedConfig.url);
            items = feed.items.map(item => ({
                ...item,
                imageUrl: item.enclosure?.url || item['media:content']?.$.url
            }));
            console.log(`   Found ${items.length} items via Parser.`);
        }

        for (const item of items) {
          const title = item.title;
          if (!title) continue;

          // Check duplicate by title or link
          const existing = await client.sql`
            SELECT id FROM articles WHERE title = ${title} OR source_url = ${item.link} LIMIT 1
          `;
          
          if (existing.rowCount > 0) {
            process.stdout.write('.');
            continue;
          }

          // Generate Metadata
          const slug = generateSlug(title);
          const category = mapCategory(item.categories);
          
          let createdAt = new Date().toISOString();
          try {
             if (item.isoDate) createdAt = item.isoDate;
          } catch (e) {}
          
          // Image Extraction
          let image = item.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=2070';
          if (!image) {
             if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
                 image = item.content.match(/<img[^>]+src="([^">]+)"/)[1];
             }
          }

          // Content Strategy
          let content = item.content || item['content:encoded'] || item.contentSnippet || '';

          // Clean DB insert
          await client.sql`
            INSERT INTO articles (
              title, slug, content, status, category, views, author_id, image, 
              source, source_url, created_at
            ) VALUES (
              ${title}, ${slug}, ${content}, 'published', ${category}, 
              ${Math.floor(Math.random() * 5000)}, ${authorId}, ${image},
              ${feedConfig.source}, ${item.link}, ${createdAt}
            )
          `;
          
          process.stdout.write('✓');
          totalImported++;
        }
      } catch (err) {
        console.error(`\nFailed to process feed ${feedConfig.source}:`, err.message);
      }
    }

    console.log(`\n\n✅ Successfully imported ${totalImported} new articles.`);

  } catch (error) {
    console.error('Import failed:', error);
  }
}

async function main() {
  const client = await db.connect();
  await importNews(client);
  await client.end();
}

main().catch(console.error);
