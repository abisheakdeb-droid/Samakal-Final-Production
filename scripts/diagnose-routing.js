const { loadEnvConfig } = require('@next/env');
const { cwd } = require('process');
const { createClient } = require('@vercel/postgres');

loadEnvConfig(cwd());

// --- MOCKED CONFIGS ---
const CATEGORY_MAP = {
    saradesh: "সারাদেশ",
    dhaka: "ঢাকা",
    munshiganj: "মুন্সিগঞ্জ",
};

const SUB_CATEGORIES = {
    saradesh: ["dhaka", "chattogram", "rajshahi", "khulna", "barishal", "sylhet", "rangpur", "mymensingh"],
    dhaka: ["dhaka", "faridpur", "gazipur", "gopalganj", "kishoreganj", "madaripur", "manikganj", "munshiganj", "narayanganj", "narsingdi", "rajbari", "shariatpur", "tangail"],
};

function getParentCategory(slug) {
    for (const [parent, children] of Object.entries(SUB_CATEGORIES)) {
        if (children.includes(slug)) return parent;
    }
    return null;
}

function normalizeCategory(input) {
    if (CATEGORY_MAP[input]) return CATEGORY_MAP[input];
    return input;
}

// --- DIAGNOSTIC LOGIC ---
async function diagnose(slug) {
    console.log(`\n--- Diagnosing Slug: ${slug} ---`);

    const categoryLabel = CATEGORY_MAP[slug] || slug;
    const parentSlug = getParentCategory(slug);
    const parentBengali = parentSlug ? CATEGORY_MAP[parentSlug] : undefined;
    const hasChildren = !!SUB_CATEGORIES[slug];
    const isParentCategory = hasChildren;

    const normalizedCategory = normalizeCategory(categoryLabel);
    const normParent = parentBengali ? normalizeCategory(parentBengali) : undefined;

    console.log('App Logic Values:', {
        slug,
        categoryLabel,
        parentSlug,
        parentBengali,
        hasChildren,
        isParentCategory,
        normalizedCategory,
        normParent
    });

    const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
    await client.connect();

    try {
        let query = '';
        let params = [];

        if (isParentCategory) {
            console.log('Using DIVISION Logic');
            query = `SELECT count(*) FROM articles WHERE (parent_category = $1 OR category = $1) AND status = 'published'`;
            params = [normalizedCategory];
        } else if (normParent) {
            console.log('Using DISTRICT Logic');
            query = `SELECT count(*) FROM articles WHERE category ILIKE $1 AND parent_category = $2 AND status = 'published'`;
            params = [normalizedCategory, normParent];
        } else {
            console.log('Using STANDARD Logic');
            query = `SELECT count(*) FROM articles WHERE category ILIKE $1 AND status = 'published'`;
            params = [normalizedCategory];
        }

        console.log('SQL Query:', query);
        console.log('SQL Params:', params);

        const res = await client.query(query, params);
        console.log('Count Result:', res.rows[0].count);

    } catch (err) {
        console.error('Diagnosis Failed:', err);
    } finally {
        await client.end();
    }
}

async function main() {
    await diagnose('dhaka');
    await diagnose('munshiganj');
    await diagnose('gazipur');
}

main().catch(console.error);
