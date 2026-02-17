import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

// Load environment variables
loadEnvConfig(cwd());

// Parent-Child Category Mapping (Bengali names)
const PARENT_CHILD_MAP = {
  'খেলা': ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'গলফ', 'ব্যাডমিন্টন', 'টি–টোয়েন্টি বিশ্বকাপ', 'বিবিধ'],
  'বিনোদন': ['বলিউড', 'হলিউড', 'ঢালিউড', 'টালিউড', 'টেলিভিশন', 'মিউজিক', 'বিনোদনের ছবি', 'ওটিটি', 'মঞ্চ'],
  'রাজনীতি': ['আওয়ামী লীগ', 'বিএনপি', 'জামায়াত', 'জাতীয় পার্টি', 'নির্বাচন'],
  'অর্থনীতি': ['শিল্প-বাণিজ্য', 'শেয়ারবাজার', 'ব্যাংক-বীমা', 'বাজেট'],
  'বিশ্ব': ['এশিয়া', 'ইউরোপ', 'আমেরিকা', 'মধ্যপ্রাচ্য', 'দক্ষিণ এশিয়া', 'যুদ্ধ-সংঘাত'],
  'প্রযুক্তি': ['গ্যাজেট', 'সোশ্যাল মিডিয়া', 'আইটি খাত', 'বিজ্ঞান', 'অ্যাপ ও গেম'],
  'জীবনযাপন': ['ফ্যাশন', 'খাবার', 'ভ্রমণ', 'স্বাস্থ্য টিপস', 'সম্পর্ক', 'ধর্ম ও জীবন'],
  'শিক্ষা': ['ক্যাম্পাস', 'ভর্তি', 'পরীক্ষা ও ফল', 'বৃত্তি'],
  'অপরাধ': ['খুন', 'দুর্নীতি', 'ধর্ষণ', 'পাচার', 'আদালত'],
  'রাজধানী': ['উত্তর সিটি', 'দক্ষিণ সিটি', 'যানজট', 'নাগরিক সেবা'],
  'বাংলাদেশ': ['শিক্ষা', 'আইন ও বিচার', 'স্বাস্থ্য', 'কৃষি', 'সংসদ', 'পরিবেশ', 'লড়াইয়ের মঞ্চ'],
  'মতামত': ['সাক্ষাৎকার', 'চতুরঙ্গ', 'প্রতিক্রিয়া', 'খোলাচোখে', 'মুক্তমঞ্চ', 'অন্যদৃষ্টি', 'সম্পাদকীয়']
};

async function migrateParentCategory() {
  const client = await db.connect();
  
  try {
    console.log('🚀 Starting parent_category migration...\n');
    
    // Step 1: Add column if not exists
    console.log('Step 1: Adding parent_category column...');
    await client.sql`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS parent_category VARCHAR(100)
    `;
    console.log('✅ Column added successfully\n');
    
    // Step 2: Update existing data
    console.log('Step 2: Migrating existing article data...');
    let totalUpdated = 0;
    
    for (const [parent, children] of Object.entries(PARENT_CHILD_MAP)) {
      for (const child of children) {
        const result = await client.sql`
          UPDATE articles 
          SET parent_category = ${parent}
          WHERE category = ${child}
        `;
        
        if (result.rowCount > 0) {
          console.log(`   ✓ Updated ${result.rowCount} articles: ${child} → ${parent}`);
          totalUpdated += result.rowCount;
        }
      }
    }
    
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Total articles updated: ${totalUpdated}`);
    
    // Verification query
    console.log('\n📋 Verification Summary:');
    const summary = await client.sql`
      SELECT 
        parent_category,
        COUNT(*) as count
      FROM articles
      WHERE parent_category IS NOT NULL
      GROUP BY parent_category
      ORDER BY count DESC
    `;
    
    console.log('\nArticles by Parent Category:');
    summary.rows.forEach(row => {
      console.log(`   ${row.parent_category}: ${row.count} articles`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    process.exit(0);
  }
}

migrateParentCategory();
