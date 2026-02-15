import { CATEGORY_MAP } from "@/config/categories";

/**
 * Normalizes a category input to its canonical Bengali representation in the database.
 * Handles:
 * 1. English slugs (e.g., "politics" -> "রাজনীতি")
 * 2. English Capitalized (e.g., "Politics" -> "রাজনীতি")
 * 3. Bengali Exact (e.g., "রাজনীতি" -> "রাজনীতি")
 * 4. Fallback (returns input if no match found, useful if input is already correct but unknown)
 */
export function normalizeCategory(input: string): string {
    if (!input) return "";

    const lowerInput = input.trim().toLowerCase();

    // 1. Check if it matches a known slug in CATEGORY_MAP
    if (CATEGORY_MAP[lowerInput]) {
        return CATEGORY_MAP[lowerInput];
    }

    // 2. Check value match (reverse lookup) - if input is already Bengali
    const performReverseLookup = Object.values(CATEGORY_MAP).find(val => val === input || val === input.trim());
    if (performReverseLookup) {
        return performReverseLookup;
    }

    // 3. Extended Mapping for DB compatibility (English words to Bengali DB values)
    // This handles cases where we might pass "Bangladesh" string literal instead of "bangladesh" slug
    const ENGLISH_TO_BENGALI: Record<string, string> = {
        'politics': 'রাজনীতি',
        'bangladesh': 'বাংলাদেশ',
        'saradesh': 'সারাদেশ',
        'sports': 'খেলা',
        'entertainment': 'বিনোদন',
        'international': 'আন্তর্জাতিক',
        'world': 'আন্তর্জাতিক', // alias
        'economics': 'অর্থনীতি',
        'business': 'বাণিজ্য', // DB might use वाणिज्य or business. Debug showed 'অর্থনীতি: 15'.
        'opinion': 'মতামত',
        'feature': 'ফিচার',
        'technology': 'প্রযুক্তি',
        'education': 'শিক্ষা',
        'lifestyle': 'লাইফস্টাইল',
        'jobs': 'চাকরি',
        // Common misspells or variations
        'national': 'বাংলাদেশ',
        'literature': 'সাহিত্য ও সংস্কৃতি',
        'lit': 'সাহিত্য ও সংস্কৃতি',
        'chittagong': 'চট্টগ্রাম',
        'barisal': 'বরিশাল',
    };

    if (ENGLISH_TO_BENGALI[lowerInput]) {
        return ENGLISH_TO_BENGALI[lowerInput];
    }

    // Special Handling for known DB divergences based on debug output
    // Debug output: ফিচার, বিনোদন, বাংলাদেশ, মতামত, খেলা, আন্তর্জাতিক, অর্থনীতি, রাজনীতি
    // If input matches any of these exactly, return it.
    const DB_CATEGORIES = [
        'ফিচার', 'বিনোদন', 'বাংলাদেশ', 'মতামত', 'খেলা', 'আন্তর্জাতিক', 'অর্থনীতি', 'রাজনীতি'
    ];
    if (DB_CATEGORIES.includes(input.trim())) {
        return input.trim();
    }

    // Fallback: If we can't map it, return as is (maybe it's a new category not in map)
    // 4. Handle encoded/hyphenated Bangla slugs (e.g., "সাহিত্য-ও-সংস্কৃতি" -> "সাহিত্য ও সংস্কৃতি")
    const replaced = input.replace(/-/g, ' ');
    if (performReverseLookup) return performReverseLookup;
    if (CATEGORY_MAP[replaced]) return CATEGORY_MAP[replaced];

    // Check against DB values again with spaces
    if (DB_CATEGORIES.includes(replaced) || replaced === 'সাহিত্য ও সংস্কৃতি') {
        return replaced;
    }

    return input;
}
