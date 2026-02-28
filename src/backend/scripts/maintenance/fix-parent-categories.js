import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

// 1. REPLICATE CONFIG MAPPINGS (since we can't import TS easily in JS script)

const CATEGORY_MAP = {
  latest: "সর্বশেষ",
  politics: "রাজনীতি",
  bangladesh: "বাংলাদেশ", 
  saradesh: "সারাদেশ",
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
};

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

// Map subcategory slug back to parent slug
const SUB_TO_PARENT = {};
Object.entries(SUB_CATEGORIES).forEach(([parent, children]) => {
    children.forEach(child => {
        SUB_TO_PARENT[child] = parent;
    });
});


// 2. HELPER FUNCTIONS

function normalizeCategory(input) {
    if (!input) return null;
    const lowerInput = input.trim().toLowerCase();

    // Check specific manual overrides first (for mixed Bengali/English inputs)
    const EXTENDED_MAP = {
        'politics': 'রাজনীতি',
        'bangladesh': 'বাংলাদেশ',
        'saradesh': 'বাংলাদেশ',
        'sports': 'খেলা',
        'entertainment': 'বিনোদন',
        'international': 'আন্তর্জাতিক',
        'world': 'আন্তর্জাতিক',
        'economics': 'অর্থনীতি',
        'business': 'বাণিজ্য',
        'opinion': 'মতামত',
        'feature': 'ফিচার',
        'technology': 'প্রযুক্তি',
        'education': 'শিক্ষা',
        'lifestyle': 'জীবনযাপন',
        'jobs': 'চাকরি',
        'national': 'বাংলাদেশ',
    };

    if (EXTENDED_MAP[lowerInput]) return EXTENDED_MAP[lowerInput];
    if (CATEGORY_MAP[lowerInput]) return CATEGORY_MAP[lowerInput];
    
    // Reverse lookup (if already Bengali)
    const isBengali = Object.values(CATEGORY_MAP).includes(input) || Object.values(EXTENDED_MAP).includes(input);
    if (isBengali) return input;
    
    // If it's a known subcategory, return it as-is (we don't translate subcategory slugs yet, usually)
    if (SUB_TO_PARENT[lowerInput]) return lowerInput;

    return input; 
}

function getParentCategoryBengali(categorySlug) {
    if (!categorySlug) return null;
    const lowerSlug = categorySlug.toLowerCase().trim();
    
    const parentSlug = SUB_TO_PARENT[lowerSlug];
    if (!parentSlug) return null;

    // Use EXTENDED_MAP logic for parent too, or direct CATEGORY_MAP
    if (CATEGORY_MAP[parentSlug]) return CATEGORY_MAP[parentSlug];
    
    // Manually map common parents if missing from basic map
    const PARENT_MAP = {
        'bangladesh': 'বাংলাদেশ',
        'economics': 'অর্থনীতি',
        'opinion': 'মতামত',
        'entertainment': 'বিনোদন',
        'sports': 'খেলা',
        'politics': 'রাজনীতি',
        'world': 'আন্তর্জাতিক',
        'technology': 'প্রযুক্তি',
        'lifestyle': 'জীবনযাপন',
        'education': 'শিক্ষা',
        'crime': 'অপরাধ',
        'capital': 'রাজধানী'
    };
    
    return PARENT_MAP[parentSlug] || null;
}


// 3. MAIN MIGRATION

async function fixParentCategories() {
  console.log('🔄 Starting Parent Category Fix...');
  
  const client = await db.connect();
  
  try {
    // get all articles
    const { rows: articles } = await client.sql`SELECT id, title, category, parent_category FROM articles`;
    console.log(`📊 Found ${articles.length} articles to process.`);

    let updatedCount = 0;
    
    for (const article of articles) {
        let needsUpdate = false;
        let finalCategory = article.category;
        let finalParent = article.parent_category;

        // 1. Normalize Category (if needed)
        // If current category is English Main Category (e.g. "Sports"), convert to "খেলা"
        const normalized = normalizeCategory(article.category);
        if (normalized && normalized !== article.category) {
            finalCategory = normalized;
            needsUpdate = true;
        }

        // 2. Determine Parent
        // Check if the ORIGINAL category (likely slug "cricket") or Normalized is a subcategory
        const categoryForLookup = article.category; // usually slugs like 'cricket' are stored as category
        const calculatedParent = getParentCategoryBengali(categoryForLookup);

        if (calculatedParent) {
            // It IS a subcategory
            if (finalParent !== calculatedParent) {
                finalParent = calculatedParent;
                needsUpdate = true;
            }
        } else {
             // It is NOT a subcategory (is a Main Category)
             // Ensure parent_category is NULL (or empty) to avoid stale data
             if (finalParent !== null) {
                 finalParent = null; 
                 needsUpdate = true; // Clear incorrect parent if any
             }
        }

        // 3. Update DB
        if (needsUpdate) {
            await client.sql`
                UPDATE articles 
                SET category = ${finalCategory}, 
                    parent_category = ${finalParent}
                WHERE id = ${article.id}
            `;
            console.log(`✅ Updated: [${article.title.substring(0, 20)}...] Cat: ${article.category} -> ${finalCategory} | Parent: ${article.parent_category} -> ${finalParent}`);
            updatedCount++;
        }
    }
    
    console.log(`\n✨ Done! Updated ${updatedCount} articles.`);

    // 4. Verification Stats
    console.log('\n📊 Final Stats (Top 20 Categories):');
    const stats = await client.sql`
        SELECT category, parent_category, count(*) 
        FROM articles 
        GROUP BY category, parent_category 
        ORDER BY count(*) DESC
        LIMIT 20
    `;
    console.table(stats.rows);

  } catch {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixParentCategories();
