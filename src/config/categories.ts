export const CATEGORY_MAP: Record<string, string> = {
  latest: "সর্বশেষ",
  politics: "রাজনীতি",
  bangladesh: "বাংলাদেশ", 
  saradesh: "সারাদেশ",
  capital: "রাজধানী",
  crime: "অপরাধ",
  world: "বিশ্ব",
  business: "বাণিজ্য",
  economics: "অর্থনীতি",  // Added for /category/economics
  feature: "ফিচার",        // Added for /category/feature
  opinion: "মতামত",
  sports: "খেলা",
  entertainment: "বিনোদন",
  technology: "প্রযুক্তি",
  education: "শিক্ষা",
  lifestyle: "জীবনযাপন",
  jobs: "চাকরি",
  other: "অন্যান্য",
  archive: "আর্কাইভ",
  gallery: "গ্যালারি",
  probash: "প্রবাস",
  "jibon-songram": "জীবন সংগ্রাম",
  "special-samakal": "বিশেষ সমকাল",
  investigation: "সমকাল অনুসন্ধান",
  offbeat: "অফবিট",
  shilpomancha: "শিল্পমঞ্চ",
  "special-arrangement": "বিশেষ আয়োজন",
  dhaka: "ঢাকা",
  chattogram: "চট্টগ্রাম",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  barishal: "বরিশাল",
  sylhet: "সিলেট",
  rangpur: "রংপুর",
  mymensingh: "ময়মনসিংহ",
  
  // Sub-categories
  "law-courts": "আইন ও বিচার",
  health: "স্বাস্থ্য",
  agriculture: "কৃষি",
  parliament: "সংসদ",
  environment: "পরিবেশ",
  struggle: "লড়াইয়ের মঞ্চ",
  
  // Economics Sub-categories
  "industry-trade": "শিল্প-বাণিজ্য",
  "share-market": "শেয়ারবাজার",
  "bank-insurance": "ব্যাংক-বীমা",
  "budget": "বাজেট",

  // Opinion Sub-categories
  "interview": "সাক্ষাৎকার",
  "chaturanga": "চতুরঙ্গ",
  "reaction": "প্রতিক্রিয়া",
  "khola-chokhe": "খোলাচোখে",
  "muktomunch": "মুক্তমঞ্চ",
  "onno-drishti": "অন্যদৃষ্টি",
  "editorial": "সম্পাদকীয়",

  // Entertainment Sub-categories
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

  // Sports Sub-categories
  "football": "ফুটবল",
  "cricket": "ক্রিকেট",
  "tennis": "টেনিস",
  "golf": "গলফ",
  "badminton": "ব্যাডমিন্টন",
  "t20-world-cup": "টি–টোয়েন্টি বিশ্বকাপ",
  "other-sports": "অন্যান্য",
  "miscellaneous": "বিবিধ",

  // Politics
  "awami-league": "আওয়ামী লীগ",
  "bnp": "বিএনপি",
  "jamaat": "জামায়াত",
  "jatiya-party": "জাতীয় পার্টি",
  "others-politics": "অন্যান্য",
  "election": "নির্বাচন",

  // World
  "asia": "এশিয়া",
  "europe": "ইউরোপ",
  "america": "আমেরিকা",
  "middle-east": "মধ্যপ্রাচ্য",
  "south-asia": "দক্ষিণ এশিয়া",
  "war": "যুদ্ধ-সংঘাত",

  // Technology
  "gadgets": "গ্যাজেট",
  "social-media": "সোশ্যাল মিডিয়া",
  "it-sector": "আইটি খাত",
  "science": "বিজ্ঞান",
  "apps-games": "অ্যাপ ও গেম",

  // Lifestyle
  "fashion": "ফ্যাশন",
  "food": "খাবার",
  "travel": "ভ্রমণ",
  "health-tips": "স্বাস্থ্য টিপস",
  "relationship": "সম্পর্ক",
  "religion": "ধর্ম ও জীবন",

  // Education
  "campus": "ক্যাম্পাস",
  "admission": "ভর্তি",
  "exam-results": "পরীক্ষা ও ফল",
  "scholarship": "বৃত্তি",
  "literature": "সাহিত্য ও সংস্কৃতি", // Updated based on user request

  // Crime
  "murder": "খুন",
  "corruption": "দুর্নীতি",
  "rape": "ধর্ষণ",
  "trafficking": "পাচার",
  "court": "আদালত",

  // Capital
  "north-city": "উত্তর সিটি",
  "south-city": "দক্ষিণ সিটি",
  "traffic": "যানজট",
  "services": "নাগরিক সেবা"
};

// List of parent categories only (for homepage)
export const PARENT_CATEGORIES = [
  'sports',
  'entertainment', 
  'politics',
  'economics',
  'world',
  'technology',
  'lifestyle',
  'education',
  'crime',
  'capital',
  'bangladesh',
  'opinion',
  'other'
];
