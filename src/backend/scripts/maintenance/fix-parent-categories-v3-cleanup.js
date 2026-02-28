import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { db } from '@vercel/postgres';

loadEnvConfig(cwd());

// Targeted Cleanup Map: "Subcategory Name" -> "Parent Name"
// This list is derived from the check-categories.js output where Parent was NULL
const TARGETED_FIXES = {
    // Sports (খেলা)
    'ক্রিকেট': 'খেলা',
    'ফুটবল': 'খেলা',
    'টেনিস': 'খেলা',
    'বিবিধ': 'খেলা',
    'টি–টোয়েন্টি বিশ্বকাপ': 'খেলা',

    // Entertainment (বিনোদন)
    'হলিউড': 'বিনোদন',
    'বলিউড': 'বিনোদন',
    'ঢালিউড': 'বিনোদন', // Just in case
    'মিউজিক': 'বিনোদন',
    'ওটিটি': 'বিনোদন',

    // Economics (অর্থনীতি)
    'শিল্প-বাণিজ্য': 'অর্থনীতি',
    'বাজেট': 'অর্থনীতি',
    'ব্যাংক-বীমা': 'অর্থনীতি',
    'শেয়ারবাজার': 'অর্থনীতি',

    // Unknown/Misc -> Opinion? No, these are Opinion subcategories
    'মুক্তমঞ্চ': 'মতামত',
    'সম্পাদকীয়': 'মতামত',
    'চতুরঙ্গ': 'মতামত',
    'সাক্ষাৎকার': 'মতামত',
    'প্রতিক্রিয়া': 'মতামত',

    // Crime (অপরাধ)
    'খুন': 'অপরাধ', // Murder
    'ধর্ষণ': 'অপরাধ', // Rape
    'আদালত': 'অপরাধ', // Court
    'পাচার': 'অপরাধ',
    'দুর্নীতি': 'অপরাধ',

    // Education (শিক্ষা)
    'ভর্তি': 'শিক্ষা',
    'ক্যাম্পাস': 'শিক্ষা',
    'পরীক্ষা ও ফল': 'শিক্ষা',
    'বৃত্তি': 'শিক্ষা',
    
    // Tech (প্রযুক্তি)
    'গ্যাজেট': 'প্রযুক্তি',
    'বিজ্ঞান': 'প্রযুক্তি', // Science
    'সোশ্যাল মিডিয়া': 'প্রযুক্তি',
    
    // Lifestyle (জীবনযাপন)
    'ফ্যাশন': 'জীবনযাপন',
    'স্বাস্থ্য টিপস': 'জীবনযাপন',
    'ভ্রমণ': 'জীবনযাপন',
    'সম্পর্ক': 'জীবনযাপন',
    'খাবার': 'জীবনযাপন',

    // World (বিশ্ব)
    'আমেরিকা': 'বিশ্ব',
    'এশিয়া': 'বিশ্ব',
    'ইউরোপ': 'বিশ্ব',
    'মধ্যপ্রাচ্য': 'বিশ্ব',
    'যুদ্ধ-সংঘাত': 'বিশ্ব',

    // Politics (রাজনীতি)
    'বিএনপি': 'রাজনীতি',
    'নির্বাচন': 'রাজনীতি',
    'আওয়ামী লীগ': 'রাজনীতি',
    'জামায়াত': 'রাজনীতি',
    'জাতীয় পার্টি': 'রাজনীতি'
};

// Handle the Education ambiguity
// Config shows Education is a child of Bangladesh.
// Previous output showed: শিক্ষা | বাংলাদেশ : 9, শিক্ষা | null : 1
// We should standardize. 
// However, 'Education' can be a top-level category too. 
// For now, I will fix the subcategories of Education (Campus, etc) to point to Education.
// And I will leave 'Education' itself alone or map it to Bangladesh if that's the established pattern.
// Based on count (9 vs 1), 'Bangladesh' is the dominant parent for 'Education' articles.
const SPECIAL_FIXES = {
    'শিক্ষা': 'বাংলাদেশ'
};


async function fixParentCategoriesV3() {
  console.log('🔄 Starting Parent Category Fix V3 (Cleanup)...');
  
  const client = await db.connect();
  
  try {
    let updatedCount = 0;

    // 1. Apply STANDARD TARGETED FIXES
    // "Where category = X AND parent_category IS NULL"
    for (const [category, parent] of Object.entries(TARGETED_FIXES)) {
        const result = await client.sql`
            UPDATE articles 
            SET parent_category = ${parent}
            WHERE category = ${category} AND (parent_category IS NULL OR parent_category = '')
        `;
        
        if (result.rowCount > 0) {
            console.log(`✅ Fixed ${result.rowCount} articles for: ${category} -> Parent: ${parent}`);
            updatedCount += result.rowCount;
        }
    }

    // 2. Apply SPECIAL FIXES (Education -> Bangladesh)
    for (const [category, parent] of Object.entries(SPECIAL_FIXES)) {
          const result = await client.sql`
            UPDATE articles 
            SET parent_category = ${parent}
            WHERE category = ${category} AND (parent_category IS NULL OR parent_category = '')
        `;
         if (result.rowCount > 0) {
            console.log(`✅ Fixed ${result.rowCount} articles for: ${category} -> Parent: ${parent}`);
            updatedCount += result.rowCount;
        }
    }
    
    console.log(`\n✨ V3 Cleanup Done! Total updates: ${updatedCount}`);

    // 3. Final Verification
    console.log('\n📊 Final Database State:');
    const stats = await client.sql`
        SELECT category, parent_category, count(*) 
        FROM articles 
        WHERE status = 'published'
        GROUP BY category, parent_category 
        ORDER BY category ASC
    `;
    stats.rows.forEach(row => console.log(`${row.category} | ${row.parent_category} : ${row.count}`));

  } catch {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixParentCategoriesV3();
