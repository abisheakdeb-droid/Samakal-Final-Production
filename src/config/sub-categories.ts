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
    'dhaka', 'faridpur', 'gazipur', 'gopalganj', 'kishoreganj', 'madaripur', 'manikganj', 'munshiganj', 'narayanganj', 'narsingdi', 'rajbari', 'shariatpur', 'tangail'
  ],
  chattogram: [
    'bandarban', 'brahmanbaria', 'chandpur', 'chattogram', 'comilla', 'coxs-bazar', 'feni', 'khagrachari', 'lakshmipur', 'noakhali', 'rangamati'
  ],
  rajshahi: [
    'bogra', 'joypurhat', 'naogaon', 'natore', 'pabna', 'rajshahi', 'sirajganj', 'chapainawabganj'
  ],
  khulna: [
    'bagerhat', 'chuadanga', 'jessore', 'jhenaidah', 'khulna', 'kushtia', 'magura', 'meherpur', 'narail', 'satkhira'
  ],
  barishal: [
    'barguna', 'barishal', 'bhola', 'jhalokati', 'patuakhali', 'pirojpur'
  ],
  sylhet: [
    'habiganj', 'moulvibazar', 'sunamganj', 'sylhet'
  ],
  rangpur: [
    'dinajpur', 'gaibandha', 'kurigram', 'lalmonirhat', 'nilphamari', 'panchagarh', 'rangpur', 'thakurgaon'
  ],
  mymensingh: [
    'jamalpur', 'mymensingh', 'netrokona', 'sherpur'
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
    't20-world-cup',
    'other-sports',
    'miscellaneous',
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
    'others',
    'australia',
    'india',
    'pakistan',
    'china',
    'middle-east',
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
