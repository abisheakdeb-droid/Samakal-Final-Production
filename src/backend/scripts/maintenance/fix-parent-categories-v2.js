import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

// 1. CONFIG MAPPINGS (English -> Bengali)
const CATEGORY_MAP = {
  // Main Categories
  latest: "সর্বশেষ",
  politics: "রাজনীতি",
  bangladesh: "বাংলাদেশ", 
  saradesh: "সারাদেশ", // treat as bangladesh
  capital: "রাজধানী",
  crime: "অপরাধ",
  world: "বিশ্ব",
  business: "বাণিজ্য",
  economics: "অর্থনীতি",
  feature: "ফিচার",
  opinion: "মতামত",
  sports: "খেলা",
  entertainment: "বিনোদন",
  technology: "প্রযুক্তি",
  education: "শিক্ষা",
  lifestyle: "জীবনযাপন",
  jobs: "চাকরি",
  dhaka: "ঢাকা",
  chattogram: "চট্টগ্রাম",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  barishal: "বরিশাল",
  sylhet: "সিলেট",
  rangpur: "রংপুর",
  mymensingh: "ময়মনসিংহ",
  
  // Sub-categories (Standardizing output to Bengali)
  "law-courts": "আইন ও বিচার",
  health: "স্বাস্থ্য",
  agriculture: "কৃষি",
  parliament: "সংসদ",
  environment: "পরিবেশ",
  struggle: "লড়াইয়ের মঞ্চ",
  "industry-trade": "শিল্প-বাণিজ্য",
  "share-market": "শেয়ারবাজার",
  "bank-insurance": "ব্যাংক-বীমা",
  "budget": "বাজেট",
  "interview": "সাক্ষাৎকার",
  "chaturanga": "চতুরঙ্গ",
  "reaction": "প্রতিক্রিয়া",
  "khola-chokhe": "খোলাচোখে",
  "muktomunch": "মুক্তমঞ্চ",
  "onno-drishti": "অন্যদৃষ্টি",
  "editorial": "সম্পাদকীয়",
  "bollywood": "বলিউড",
  "hollywood": "হলিউড",
  "dhallywood": "ঢালিউড",
  "tollywood": "টালিউড",
  "television": "টেলিভিশন",
  "music": "মিউজিক",
  "other-entertainment": "অন্যান্য",
  "entertainment-photos": "বিনোদনের ছবি",
  "ott": "ওটিটি",
  "stage": "মঞ্চ",
  "football": "ফুটবল",
  "cricket": "ক্রিকেট",
  "tennis": "টেনিস",
  "golf": "গলফ",
  "badminton": "ব্যাডমিন্টন",
  "t20-world-cup": "টি–টোয়েন্টি বিশ্বকাপ",
  "other-sports": "অন্যান্য",
  "miscellaneous": "বিবিধ",
  "awami-league": "আওয়ামী লীগ",
  "bnp": "বিএনপি",
  "jamaat": "জামায়াত",
  "jatiya-party": "জাতীয় পার্টি",
  "others-politics": "অন্যান্য",
  "election": "নির্বাচন",
  "asia": "এশিয়া",
  "europe": "ইউরোপ",
  "america": "আমেরিকা",
  "middle-east": "মধ্যপ্রাচ্য",
  "south-asia": "দক্ষিণ এশিয়া",
  "war": "যুদ্ধ-সংঘাত",
  "gadgets": "গ্যাজেট",
  "social-media": "সোশ্যাল মিডিয়া",
  "it-sector": "আইটি খাত",
  "science": "বিজ্ঞান",
  "apps-games": "অ্যাপ ও গেম",
  "fashion": "ফ্যাশন",
  "food": "খাবার",
  "travel": "ভ্রমণ",
  "health-tips": "স্বাস্থ্য টিপস",
  "relationship": "সম্পর্ক",
  "religion": "ধর্ম ও জীবন",
  "campus": "ক্যাম্পাস",
  "admission": "ভর্তি",
  "exam-results": "পরীক্ষা ও ফল",
  "scholarship": "বৃত্তি",
  "murder": "খুন",
  "corruption": "দুর্নীতি",
  "rape": "ধর্ষণ",
  "trafficking": "পাচার",
  "court": "আদালত",
  "north-city": "উত্তর সিটি",
  "south-city": "দক্ষিণ সিটি",
  "traffic": "যানজট",
  "services": "নাগরিক সেবা"
};

// Reverse Mapping: Bengali -> English Slug
const BENGALI_TO_ENGLISH = {};
Object.entries(CATEGORY_MAP).forEach(([english, bengali]) => {
    BENGALI_TO_ENGLISH[bengali] = english;
});

// Parent Logic
const SUB_CATEGORIES = {
  bangladesh: ['education', 'law-courts', 'health', 'agriculture', 'parliament', 'environment', 'struggle'],
  economics: ['industry-trade', 'share-market', 'bank-insurance', 'budget'],
  opinion: ['interview', 'chaturanga', 'reaction', 'khola-chokhe', 'muktomunch', 'onno-drishti', 'editorial'],
  entertainment: ['bollywood', 'hollywood', 'dhallywood', 'tollywood', 'television', 'music', 'other-entertainment', 'entertainment-photos', 'ott', 'stage'],
  sports: ['football', 'cricket', 'tennis', 'golf', 'badminton', 't20-world-cup', 'other-sports', 'miscellaneous'],
  politics: ['awami-league', 'bnp', 'jamaat', 'jatiya-party', 'others-politics', 'election'],
  world: ['asia', 'europe', 'america', 'middle-east', 'south-asia', 'war'],
  technology: ['gadgets', 'social-media', 'it-sector', 'science', 'apps-games'],
  lifestyle: ['fashion', 'food', 'travel', 'health-tips', 'relationship', 'religion'],
  education: ['campus', 'admission', 'exam-results', 'scholarship'],
  crime: ['murder', 'corruption', 'rape', 'trafficking', 'court'],
  capital: ['north-city', 'south-city', 'traffic', 'services'],
};

// Child English -> Parent English
const CHILD_TO_PARENT_ENGLISH = {};
Object.entries(SUB_CATEGORIES).forEach(([parent, children]) => {
    children.forEach(child => {
        CHILD_TO_PARENT_ENGLISH[child] = parent;
    });
});

// Manual corrections map for things that might match multiple inputs
const MANUAL_PARENT_MAP_BENGALI = {
    'উত্তর সিটি': 'রাজধানী', // Capital
    'দক্ষিণ সিটি': 'রাজধানী',
    'ক্যাম্পাস': 'শিক্ষা', // Education
    // Add others if ambiguity exists, but English mapping usually suffices
};


async function fixParentCategoriesV2() {
  console.log('🔄 Starting Parent Category Fix V2...');
  
  const client = await db.connect();
  
  try {
    const { rows: articles } = await client.sql`SELECT id, title, category, parent_category FROM articles`;
    console.log(`📊 Found ${articles.length} articles to process.`);

    let updatedCount = 0;
    
    for (const article of articles) {
        if (!article.category) continue;

        let needsUpdate = false;
        let finalCategory = article.category.trim(); // Assume it's already normalized to Bengali or English
        let finalParent = article.parent_category;

        // 1. Identify English Slug
        let englishSlug = article.category.trim().toLowerCase();
        
        // If it's already Bengali, find the English slug
        if (BENGALI_TO_ENGLISH[finalCategory]) {
            englishSlug = BENGALI_TO_ENGLISH[finalCategory];
        }

        // 2. Normalize Category to Bengali (if not already)
        // Check if we have a mapping for this English slug
        if (CATEGORY_MAP[englishSlug]) {
            const normalized = CATEGORY_MAP[englishSlug];
            if (normalized !== finalCategory) {
                finalCategory = normalized;
                needsUpdate = true;
            }
        }

        // 3. Find Parent (Using English Slug)
        const parentEnglishSlug = CHILD_TO_PARENT_ENGLISH[englishSlug];
        let calculatedParentBengali = null;

        if (parentEnglishSlug) {
            // It IS a subcategory
            calculatedParentBengali = CATEGORY_MAP[parentEnglishSlug];
        } else {
             // Not found in subcategories list? 
             // Maybe it's a main category (like 'sports' -> 'খেলা') or unknown
             // Check Manual Map if needed
             if (MANUAL_PARENT_MAP_BENGALI[finalCategory]) {
                 calculatedParentBengali = MANUAL_PARENT_MAP_BENGALI[finalCategory];
             }
        }

        // 4. Update Parent
        if (calculatedParentBengali) {
            if (finalParent !== calculatedParentBengali) {
                finalParent = calculatedParentBengali;
                needsUpdate = true;
            }
        } else {
            // Should be NULL (Main category)
            if (finalParent !== null) {
                finalParent = null; 
                needsUpdate = true;
            }
        }

        // 5. Execute Update
        if (needsUpdate) {
            await client.sql`
                UPDATE articles 
                SET category = ${finalCategory}, 
                    parent_category = ${finalParent}
                WHERE id = ${article.id}
            `;
            // Log only changes
            console.log(`✅ Fixed: [${article.title.substring(0, 15)}...] 
               Slug: ${englishSlug}
               Cat: ${article.category} -> ${finalCategory} 
               Parent: ${article.parent_category} -> ${finalParent}`);
            updatedCount++;
        }
    }
    
    console.log(`\n✨ V2 Fix Done! Updated ${updatedCount} articles.`);

    // 4. Final Verification
    console.log('\n📊 Database State (Top 30):');
    const stats = await client.sql`
        SELECT category, parent_category, count(*) 
        FROM articles 
        GROUP BY category, parent_category 
        ORDER BY count(*) DESC
        LIMIT 30
    `;
    console.table(stats.rows);

  } catch {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixParentCategoriesV2();
