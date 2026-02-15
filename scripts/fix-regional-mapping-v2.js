const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { createClient } = require('@vercel/postgres');

loadEnvConfig(cwd());

const BENGALI_PARENT = 'সারাদেশ';

const DIVISION_TO_DISTRICTS = {
    'ঢাকা': ['ঢাকা', 'ফরিদপুর', 'গাজীপুর', 'গোপালগঞ্জ', 'কিশোরগঞ্জ', 'মাদারীপুর', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'নারায়ণগঞ্জ', 'নরসিংদী', 'রাজবাড়ী', 'শরীয়তপুর', 'টাঙ্গাইল'],
    'চট্টগ্রাম': ['বান্দরবান', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'কুমিল্লা', 'কক্সবাজার', 'ফেনী', 'খাগড়াছড়ি', 'লক্ষ্মীপুর', 'নোয়াখালী', 'রাঙামাটি', 'চট্টগ্রাম'],
    'রাজশাহী': ['বগুড়া', 'জয়পুরহাট', 'নওগাঁ', 'নাটোর', 'পাবনা', 'সিরাজগঞ্জ', 'চাপাইনবাবগঞ্জ', 'রাজশাহী'],
    'খুলনা': ['বাগেরহাট', 'চুয়াডাঙ্গা', 'যশোর', 'ঝিনাইদহ', 'কুষ্টিয়া', 'মাগুরা', 'মেহেরপুর', 'নড়াইল', 'সাতক্ষীরা', 'খুলনা'],
    'বরিশাল': ['বরগুনা', 'ভোলা', 'ঝালকাঠি', 'পটুয়াখালী', 'পিরোজপুর', 'বরিশাল'],
    'সিলেট': ['হবিগঞ্জ', 'মৌলভীবাজার', 'সুনামগঞ্জ', 'সিলেট'],
    'রংপুর': ['দিনাজপুর', 'গাইবান্ধা', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও', 'রংপুর'],
    'ময়মনসিংহ': ['জামালপুর', 'নেত্রকোনা', 'শেরপুর', 'ময়মনসিংহ']
};

async function main() {
    console.log('🚀 Starting Advanced Regional Mapping Fix (V2)...');
    const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    await client.connect();

    try {
        // 1. Map Districts to Divisions
        console.log('📦 Mapping Districts to their parent Divisions...');
        for (const [division, districts] of Object.entries(DIVISION_TO_DISTRICTS)) {
            const districtList = districts.map(d => `'${d}'`).join(',');
            const res = await client.query(`
        UPDATE articles 
        SET parent_category = $1 
        WHERE category IN (${districtList}) 
        AND category != $1
      `, [division]);
            console.log(`   ✅ Division ${division}: Updated ${res.rowCount} district articles`);
        }

        // 2. Map Divisions to Saradesh
        console.log('📦 Mapping Divisions to "সারাদেশ"...');
        const divisionList = Object.keys(DIVISION_TO_DISTRICTS).map(d => `'${d}'`).join(',');
        const divRes = await client.query(`
      UPDATE articles 
      SET parent_category = $1 
      WHERE category IN (${divisionList})
    `, [BENGALI_PARENT]);
        console.log(`   ✅ Updated ${divRes.rowCount} division articles to parent_category='${BENGALI_PARENT}'`);

        // 3. Final cleanup for 'saradesh' itself
        const finalRes = await client.sql`
      UPDATE articles 
      SET category = 'সারাদেশ', parent_category = 'সারাদেশ'
      WHERE category = 'saradesh' OR category = 'Bangladesh';
    `;
        console.log(`✅ Normalized ${finalRes.rowCount} root labels`);

    } catch (err) {
        console.error('❌ Error during migration:', err);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
