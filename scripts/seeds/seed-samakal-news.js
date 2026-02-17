const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');
const cheerio = require('cheerio');

// Load environment variables
loadEnvConfig(cwd());

// Helper to wait
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple fetch wrapper
async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return await res.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// Translations Mapping (Manual copy from src/config/categories.ts)
const TRANSLATIONS = {
  "latest": "সর্বশেষ",
  "politics": "রাজনীতি",
  "economics": "অর্থনীতি",
  "world": "বিশ্ব",
  "sports": "খেলা",
  "entertainment": "বিনোদন",
  "technology": "প্রযুক্তি",
  "lifestyle": "জীবনযাপন",
  "education": "শিক্ষা",
  "crime": "অপরাধ",
  "capital": "রাজধানী",
  "bangladesh": "বাংলাদেশ",
  "opinion": "মতামত",
  
  // Sub-categories
  "awami-league": "আওয়ামী লীগ",
  "bnp": "বিএনপি",
  "jamaat": "জামায়াত",
  "jatiya-party": "জাতীয় পার্টি",
  "election": "নির্বাচন",
  "cricket": "ক্রিকেট",
  "football": "ফুটবল",
  "tennis": "টেনিস",
  "t20-world-cup": "টি–টোয়েন্টি বিশ্বকাপ",
  "bollywood": "বলিউড",
  "hollywood": "হলিউড",
  "dhallywood": "ঢালিউড",
  "television": "টেলিভিশন",
  "ott": "ওটিটি",
  "gadgets": "গ্যাজেট",
  "social-media": "সোশ্যাল মিডিয়া",
  "food": "খাবার",
  "travel": "ভ্রমণ",
  "fashion": "ফ্যাশন",
  "share-market": "শেয়ারবাজার",
  "bank-insurance": "ব্যাংক-বীমা",
  "budget": "বাজেট",
  "others-politics": "অন্যান্য",
  "other-sports": "অন্যান্য",
  "other-entertainment": "অন্যান্য",
  "miscellaneous": "বিবিধ"
};

// Category Mappings
const CATEGORIES = [
  { slug: 'politics', url: 'https://samakal.com/politics', limit: 25 },
  { slug: 'economics', url: 'https://samakal.com/economics', limit: 20 },
  { slug: 'world', url: 'https://samakal.com/international', limit: 15 },
  { slug: 'sports', url: 'https://samakal.com/sports', limit: 25 },
  { slug: 'entertainment', url: 'https://samakal.com/entertainment', limit: 25 },
  { slug: 'technology', url: 'https://samakal.com/technology', limit: 15 },
  { slug: 'lifestyle', url: 'https://samakal.com/lifestyle', limit: 15 },
  { slug: 'education', url: 'https://samakal.com/sub/education', limit: 10 },
  { slug: 'crime', url: 'https://samakal.com/crime', limit: 15 },
  { slug: 'capital', url: 'https://samakal.com/capital', limit: 15 },
  { slug: 'opinion', url: 'https://samakal.com/opinion', limit: 10 },
  { slug: 'bangladesh', url: 'https://samakal.com/bangladesh', limit: 15 },
];

// Sub-category Keywords Mapping
const SUB_CATEGORY_RULES = {
  politics: [
    { slug: 'awami-league', keywords: ['আওয়ামী লীগ', 'হাসিনা', 'ওবায়দুল কাদের'] },
    { slug: 'bnp', keywords: ['বিএনপি', 'ফখরুল', 'তারেক'] },
    { slug: 'jamaat', keywords: ['জামায়াত', 'শিবির'] },
    { slug: 'jatiya-party', keywords: ['জাতীয় পার্টি', 'এরশাদ', 'জিএম কাদের'] },
    { slug: 'election', keywords: ['নির্বাচন', 'ভোট', 'ইসি'] },
  ],
  sports: [
    { slug: 'cricket', keywords: ['ক্রিকেট', 'সাকিব', 'তামিম', 'বিসিবি', 'টাইগার', 'রান'] },
    { slug: 'football', keywords: ['ফুটবল', 'মেসি', 'রোনালদো', 'নেইমার', 'ফিফা', 'বাফুফে', 'গোল'] },
    { slug: 'tennis', keywords: ['টেনিস'] },
    { slug: 't20-world-cup', keywords: ['টি-টোয়েন্টি', 'বিশ্বকাপ'] },
  ],
  entertainment: [
    { slug: 'bollywood', keywords: ['বলিউড', 'শাহরুখ', 'সালমান', 'দীপিকা', 'রণবীর'] },
    { slug: 'hollywood', keywords: ['হলিউড', 'অস্কার', 'টম ক্রুজ'] },
    { slug: 'dhallywood', keywords: ['শাকিব', 'বুবলী', 'পরীমনি', 'সিনেমায়', 'অপু বিশ্বাস'] },
    { slug: 'television', keywords: ['নাটক', 'টিভিতে', 'সিরিয়াল', 'অভিনেত্রী'] },
    { slug: 'ott', keywords: ['ওটিটি', 'ওয়েব সিরিজ', 'নেটফ্লিক্স', 'hoichoi', 'চরকি'] },
  ],
  technology: [
    { slug: 'gadgets', keywords: ['মোবাইল', 'ল্যাপটপ', 'স্মার্টফোন', 'গ্যাজেট', 'আইফোন', 'স্যামসাং'] },
    { slug: 'social-media', keywords: ['ফেসবুক', 'টুইটার', 'ইন্সটাগ্রাম', 'সোশ্যাল', 'হোয়াটসঅ্যাপ'] },
    { slug: 'ai', keywords: ['এআই', 'কৃত্রিম বুদ্ধিমত্তা', 'চ্যাটজিপিটি'] },
  ],
  lifestyle: [
    { slug: 'food', keywords: ['রেসিপি', 'খাবার', 'রান্না', 'ডায়েট'] },
    { slug: 'travel', keywords: ['ভ্রমণ', 'ট্যুর', 'রিসোর্ট', 'ভিসা'] },
    { slug: 'fashion', keywords: ['ফ্যাশন', 'সাজসজ্জা', 'রূপচর্চা'] },
  ],
   economics: [
    { slug: 'share-market', keywords: ['পুঁজিবাজার', 'শেয়ার', 'সূচক', 'লেনদেন'] },
    { slug: 'bank-insurance', keywords: ['ব্যাংক', 'বীমা', 'ঋণ', 'বাংলাদেশ ব্যাংক'] },
    { slug: 'budget', keywords: ['বাজেট', 'রাজস্ব', 'ভ্যাট'] },
  ],
};

function determineSubCategory(category, title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const rules = SUB_CATEGORY_RULES[category];
  
  if (!rules) return null;

  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k.toLowerCase()))) {
      return rule.slug;
    }
  }
  return null;
}

async function scrapeAndSeed() {
  const client = await db.connect();
  let totalInserted = 0;

  try {

    console.log('🌱 Starting Samakal Scraper & Seeder...');
    
    // Get a valid author ID
    const userRes = await client.sql`SELECT id FROM users LIMIT 1`;
    let authorId;
    
    if (userRes.rows.length > 0) {
        authorId = userRes.rows[0].id;
        console.log(`   👤 Using Author ID: ${authorId}`);
    } else {
        // Create a system user if none exists
        console.log('   👤 No users found. Creating System User...');
        const newUser = await client.sql`
            INSERT INTO users (name, email, password, role) 
            VALUES ('System Admin', 'admin@system.local', 'placeholder_hash', 'admin')
            RETURNING id
        `;
        authorId = newUser.rows[0].id;
    }

    for (const catConf of CATEGORIES) {
      console.log(`\n🔍 Scraping Category: ${catConf.slug.toUpperCase()} (${catConf.url})`);
      
      const html = await fetchHtml(catConf.url);
      if (!html) continue;

      const $ = cheerio.load(html);
      const articleLinks = [];

      $('a[href*="/article/"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !articleLinks.includes(href)) {
          articleLinks.push(href);
        }
      });
      // Fallback or additional links
       $('a[href*="/details/"]').each((i, el) => {
          const href = $(el).attr('href');
          if (href && !articleLinks.includes(href)) {
            articleLinks.push(href);
          }
      });

      console.log(`   Found ${articleLinks.length} links. Processing top ${catConf.limit}...`);

      const linksToProcess = articleLinks.slice(0, catConf.limit);

      for (const link of linksToProcess) {
        const fullLink = link.startsWith('http') ? link : `https://samakal.com${link}`;
        
        try {
            const articleHtml = await fetchHtml(fullLink);
            if (!articleHtml) continue;

            const $a = cheerio.load(articleHtml);

            // Extract Data
            const title = $a('h1').first().text().trim() || $a('meta[property="og:title"]').attr('content');
            
            let content = $a('.detail-content').html() || $a('.content-details').html() || $a('.description').html();
            
            if (content) {
                const $c = cheerio.load(content);
                $c('script').remove();
                $c('.advertisement').remove();
                $c('style').remove();
                content = $c.text().trim().substring(0, 5000); 
            } else {
                content = $a('meta[name="description"]').attr('content') || '';
            }

            const imageUrl = $a('meta[property="og:image"]').attr('content');
            const subCategorySlug = determineSubCategory(catConf.slug, title, content);

            // Determine Bengali Category Name using Translations
            // If sub-category is found, use its Bengali name.
            // Otherwise use the Main Category's Bengali name.
            let finalCategory = TRANSLATIONS[catConf.slug] || catConf.slug;
            if (subCategorySlug && TRANSLATIONS[subCategorySlug]) {
                finalCategory = TRANSLATIONS[subCategorySlug];
            }

            // Create a unique slug from title if original slug is missing or just use title hash
            const slug = title.replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-').substring(0, 100) + '-' + Date.now();

            if (!title) {
                continue;
            }

            // Insert to DB
            const existing = await client.sql`SELECT id FROM articles WHERE title = ${title} LIMIT 1`;
            
            if (existing.rows.length === 0) {
                 await client.sql`
                  INSERT INTO articles (
                    title,
                    slug,
                    content,
                    image,
                    category,
                    status,
                    author_id,
                    created_at,
                    updated_at
                  ) VALUES (
                    ${title},
                    ${slug},
                    ${content},
                    ${imageUrl},
                    ${finalCategory},
                    'published',
                    ${authorId}, 
                    NOW(),
                    NOW()
                  )
                `;
                console.log(`   ✅ Inserted: ${title.substring(0, 30)}... [${finalCategory}]`);
                totalInserted++;
            } else {
                 console.log(`   ⚠️  Duplicate: ${title.substring(0, 20)}...`);
            }

            await delay(300); // polite delay

        } catch (err) {
            console.error(`   ❌ Failed to process ${fullLink}:`, err.message);
        }
      }
      
      await delay(1000);
    }

    console.log(`\n🎉 Seeding Completed! Total articles inserted: ${totalInserted}`);

  } catch (error) {
    console.error('Fatal Error:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

scrapeAndSeed();
