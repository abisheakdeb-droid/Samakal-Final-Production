import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import { createClient } from '@vercel/postgres';

loadEnvConfig(cwd());

const DIVISION_MAP = {
    'ঢাকা': 'saradesh',
    'চট্টগ্রাম': 'saradesh',
    'রাজশাহী': 'saradesh',
    'খুলনা': 'saradesh',
    'বরিশাল': 'saradesh',
    'সিলেট': 'saradesh',
    'রংপুর': 'saradesh',
    'ময়মনসিংহ': 'saradesh',
    'Dhaka': 'saradesh',
    'Chattogram': 'saradesh'
};

const BENGALI_PARENT = 'সারাদেশ';

async function main() {
    console.log('🚀 Starting Regional Mapping Fix...');
    const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    await client.connect();

    try {
        // 1. Identify articles that are in a division but missing 'সারাদেশ' parent
        console.log('🔍 Checking for articles to update...');

        // We update parent_category to 'সারাদেশ' for any article whose category is a division
        const divisions = Object.keys(DIVISION_MAP).map(d => `'${d}'`).join(',');

        const updateRes = await client.sql`
      UPDATE articles 
      SET parent_category = ${BENGALI_PARENT}
      WHERE (category IN (
        'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
        'Gazipur', 'Faridpur', 'Sylhet', 'Comilla', 'Noakhali'
      ) OR parent_category IN (
        'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'
      ))
      AND (parent_category IS NULL OR parent_category != ${BENGALI_PARENT});
    `;

        console.log(`✅ Updated ${updateRes.rowCount} articles to parent_category='${BENGALI_PARENT}'`);

        // 2. Fix sub-district mappings if possible (Reverse mapping from our config)
        // This is more complex, but let's at least ensure divisions are correct.

        const cleanRes = await client.sql`
      UPDATE articles
      SET category = 'সারাদেশ'
      WHERE category = 'saradesh' OR category = 'Bangladesh';
    `;
        console.log(`✅ Normalized ${cleanRes.rowCount} category labels`);

    } catch {
        console.error('❌ Error during migration:', err);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
