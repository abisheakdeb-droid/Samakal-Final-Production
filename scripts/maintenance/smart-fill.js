const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { db } = require('@vercel/postgres');

loadEnvConfig(cwd());

// Helper to wait
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DISTRIBUTIONS = [
  {
    source: 'খেলা', // Sports
    targets: ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'টি–টোয়েন্টি বিশ্বকাপ', 'বিবিধ']
  },
  {
    source: 'বিনোদন', // Entertainment
    targets: ['বলিউড', 'হলিউড', 'ঢালিউড', 'টেলিভিশন', 'ওটিটি', 'মিউজিক']
  },
  {
    source: 'রাজনীতি', // Politics
    targets: ['আওয়ামী লীগ', 'বিএনপি', 'জামায়াত', 'জাতীয় পার্টি', 'নির্বাচন']
  },
  {
    source: 'প্রযুক্তি', // Technology
    targets: ['গ্যাজেট', 'সোশ্যাল মিডিয়া', 'আইটি খাত', 'বিজ্ঞান']
  },
  {
    source: 'জীবনযাপন', // Lifestyle
    targets: ['ভ্রমণ', 'ফ্যাশন', 'খাবার', 'স্বাস্থ্য টিপস', 'সম্পর্ক']
  },
  {
    source: 'অর্থনীতি', // Economics
    targets: ['শেয়ারবাজার', 'ব্যাংক-বীমা', 'শিল্প-বাণিজ্য', 'বাজেট']
  },
  {
    source: 'শিক্ষা', // Education
    targets: ['ক্যাম্পাস', 'ভর্তি', 'পরীক্ষা ও ফল']
  },
  {
    source: 'আন্তর্জাতিক', // World
    targets: ['এশিয়া', 'ইউরোপ', 'আমেরিকা', 'মধ্যপ্রাচ্য', 'যুদ্ধ-সংঘাত']
  },
   {
    source: 'অপরাধ', // Crime
    targets: ['খুন', 'দুর্নীতি', 'ধর্ষণ', 'আদালত']
  },
  {
    source: 'মতামত', // Opinion
    targets: ['সম্পাদকীয়', 'সাক্ষাৎকার', 'চতুরঙ্গ', 'মুক্তমঞ্চ']
  }
];

async function smartFill() {
  const client = await db.connect();
  let totalDistributed = 0;

  try {
    console.log('🔄 Starting Smart Distribution...');

    for (const rule of DISTRIBUTIONS) {
      console.log(`\n📂 Processing: ${rule.source}`);
      
      // Fetch all articles in this source category
      const articles = await client.sql`
        SELECT id, title FROM articles 
        WHERE category = ${rule.source}
      `;
      
      console.log(`   Found ${articles.rows.length} articles.`);
      
      if (articles.rows.length === 0) continue;

      // Round robin distribution
      let targetIndex = 0;
      
      for (const article of articles.rows) {
        const targetCategory = rule.targets[targetIndex];
        
        // Randomly decide to move it or clone it? 
        // For best results, let's keep the original AND create a copy for the sub-category
        // This ensures the main page remains full while sub-pages get content.
        
        // Actually, just UPDATE is cleaner for DB size, 
        // BUT if we update, the main parent page might get empty if it strictly filters by "Sports" 
        // and doesn't include "Cricket".
        // Let's check the frontend logic: fetchArticlesByCategory queries "category ILIKE ...".
        // So if we rename "Sports" to "Cricket", does the "Sports" page still show "Cricket" items?
        // NO, unless we implement hierarchical query.
        
        // BETTER APPROACH: DUPLICATE (CLONE)
        // We will make a copv of the article with the new sub-category.
        
        const original = await client.sql`SELECT * FROM articles WHERE id = ${article.id}`;
        const row = original.rows[0];
        
        // Create a new slug to avoid collision
        const newSlug = `${row.slug}-${targetCategory}-${Date.now()}`;
        
        // Insert Copy
        await client.sql`
          INSERT INTO articles (
             title, slug, content, status, category, image, author_id, 
             created_at, updated_at, sub_headline, news_type
          ) VALUES (
             ${row.title}, ${newSlug}, ${row.content}, ${row.status}, 
             ${targetCategory}, ${row.image}, ${row.author_id}, 
             NOW(), NOW(), ${row.sub_headline}, ${row.news_type}
          )
        `;
        
        console.log(`   ✨ Cloned "${row.title.substring(0, 20)}..." to [${targetCategory}]`);
        totalDistributed++;
        
        targetIndex = (targetIndex + 1) % rule.targets.length;
        await delay(50);
      }
    }

    console.log(`\n🎉 Distribution Completed! Created ${totalDistributed} new entries.`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

smartFill();
