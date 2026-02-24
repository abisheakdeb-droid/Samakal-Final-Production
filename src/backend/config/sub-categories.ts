import { CATEGORY_MAP } from './categories';

export const SUB_CATEGORIES: Record<string, string[]> = {
  bangladesh: [
    'education',
    'law-courts',
    'agriculture',
    'parliament',
    'environment',
    'struggle',
  ],
  saradesh: [
    'dhaka',
    'chattogram',
    'rajshahi',
    'khulna',
    'barishal',
    'sylhet',
    'rangpur',
    'mymensingh'
  ],
  dhaka: [
    'faridpur', 'gazipur', 'gopalganj', 'kishoreganj', 'madaripur', 'manikganj', 'munshiganj', 'narayanganj', 'narsingdi', 'rajbari', 'shariatpur', 'tangail'
  ],
  chattogram: [
    'bandarban', 'brahmanbaria', 'chandpur', 'comilla', 'coxs-bazar', 'feni', 'khagrachari', 'lakshmipur', 'noakhali', 'rangamati'
  ],
  rajshahi: [
    'bogra', 'joypurhat', 'naogaon', 'natore', 'pabna', 'sirajganj', 'chapainawabganj'
  ],
  khulna: [
    'bagerhat', 'chuadanga', 'jessore', 'jhenaidah', 'kushtia', 'magura', 'meherpur', 'narail', 'satkhira'
  ],
  barishal: [
    'barguna', 'bhola', 'jhalokati', 'patuakhali', 'pirojpur'
  ],
  sylhet: [
    'habiganj', 'moulvibazar', 'sunamganj'
  ],
  rangpur: [
    'dinajpur', 'gaibandha', 'kurigram', 'lalmonirhat', 'nilphamari', 'panchagarh', 'thakurgaon'
  ],
  mymensingh: [
    'jamalpur', 'netrokona', 'sherpur'
  ],
  economics: [
    'industry-trade',
    'share-market',
    'bank-insurance',
    'budget',
  ],
  opinion: [
    'interview',
    'chaturanga',
    'reaction',
    'khola-chokhe',
    'muktomunch',
    'onno-drishti',
    'editorial',
  ],
  entertainment: [
    'bollywood',
    'hollywood',
    'dhallywood',
    'tollywood',
    'television',
    'music',
    'other-entertainment',
    'entertainment-photos',
    'ott',
    'stage',
  ],
  sports: [
    'football',
    'cricket',
    'tennis',
    'golf',
    'badminton',
    'other-sports',
  ],
  politics: [
    'awami-league',
    'bnp',
    'jamaat',
    'jatiya-party',
    'others-politics',
    'election',
  ],
  world: [
    'asia',
    'europe',
    'africa',
    'usa-canada',
    'australia',
    'india',
    'pakistan',
    'china',
    'middle-east',
    'others',
  ],
  technology: [
    'gadgets',
    'social-media',
    'it-sector',
    'science',
    'apps-games',
  ],
  lifestyle: [
    'food',
    'fashion',
    'relationship',
    'beauty-care',
    'lifestyle-health',
  ],
  /* education: [
    'campus',
    'admission',
    'exam-results',
    'scholarship',
  ], */
  crime: [
    'murder',
    'corruption',
    'rape',
    'trafficking',
    'court',
  ],

  other: [
    'literature',
  ],
  "special-arrangement": [
    "anniversary",
    "roundtable",
    "national-day",
    "womens-day",
    "eid-ananda",
    "durga-puja",
    "pohela-boishakh",
    "kaler-jatra",
  ],
  "national-day": [
    "independence-day",
    "victory-day",
    "february-21",
  ],
  "shilpomancha": [
    "literature",
    "culture",
    "shilpomancha-interview",
    "translation",
    "classic",
    "book-review",
    "shilpomancha-travel"
  ],

  feature: [
    "kaler-kheya",
    "nondon",
    "shoili",
    "sarabela",
    "suhrid-somabesh",
    "ghasforing",
    "campus",
    "kichu-alo",
    "neel",
    "doctor-bari",
    "somriddhi",
    "sahosh",
    "somota",
  ],
};

// Helper to check if a slug is a subcategory
export function isSubcategory(slug: string): boolean {
  return Object.values(SUB_CATEGORIES).flat().includes(slug);
}

// Get parent category for a subcategory slug
export function getParentCategory(slug: string): string | null {
  for (const [parent, children] of Object.entries(SUB_CATEGORIES)) {
    if (children.includes(slug)) {
      return parent;
    }
  }
  return null;
}

// Get all subcategories for a parent (Bengali names)
export function getSubcategoriesBengali(parentSlug: string): string[] {
  const childSlugs = SUB_CATEGORIES[parentSlug] || [];
  return childSlugs.map(slug => CATEGORY_MAP[slug]).filter(Boolean);
}
// Check if currentSlug is a descendant of parentSlug (recursive)
export function isDescendantOf(parentSlug: string, currentSlug: string, visited: Set<string> = new Set()): boolean {
  if (parentSlug === currentSlug) return true;
  if (visited.has(parentSlug)) return false;

  visited.add(parentSlug);
  const children = SUB_CATEGORIES[parentSlug] || [];
  if (children.includes(currentSlug)) return true;

  // Recursively check children
  for (const child of children) {
    if (isDescendantOf(child, currentSlug, visited)) return true;
  }

  return false;
}
// Reverse lookup: Bengali name → English slug
// Ejemplo: "খেলা" → "sports", "ক্রিকেট" → "cricket"
function resolveToSlug(input: string): string {
  // Si ya es un slug conocido, devolverlo directamente
  if (SUB_CATEGORIES[input] || CATEGORY_MAP[input]) {
    return input;
  }

  // Buscar en CATEGORY_MAP por valor (Bengali → slug)
  for (const [slug, bengaliName] of Object.entries(CATEGORY_MAP)) {
    if (bengaliName === input) {
      return slug;
    }
  }

  return input;
}

// Get entire category tree (parent + all children recursively) as flat array
export function getCategoryTree(input: string, visited: Set<string> = new Set()): string[] {
  const slug = resolveToSlug(input);

  // Prevent infinite recursion
  if (visited.has(slug)) return [];
  visited.add(slug);

  const tree = [slug];
  const children = SUB_CATEGORIES[slug] || [];

  for (const child of children) {
    tree.push(...getCategoryTree(child, visited));
  }

  // Remove duplicates just in case
  return Array.from(new Set(tree));
}
