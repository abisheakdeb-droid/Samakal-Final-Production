// Bengali text constants for the entire application
// সমস্ত UI text এর Bengali translations

export const BENGALI_TEXT = {
  // Navigation
  nav: {
    home: 'প্রচ্ছদ',
    latest: 'সর্বশেষ',
    trending: 'জনপ্রিয়',
    categories: 'বিভাগ',
    search: 'খুঁজুন',
    login: 'প্রবেশ করুন',
    register: 'নিবন্ধন',
  },

  // Categories
  categories: {
    bangladesh: 'বাংলাদেশ',
    politics: 'রাজনীতি',
    economics: 'অর্থনীতি',
    sports: 'খেলা',
    entertainment: 'বিনোদন',
    international: 'আন্তর্জাতিক',
    opinion: 'মতামত',
    feature: 'ফিচার',
    samagra: 'সমগ্র',
    literature: 'সাহিত্য',
    all: 'সব',
  },

  // Article Page
  article: {
    readMore: 'আরো পড়ুন',
    share: 'শেয়ার করুন',
    relatedNews: 'সম্পর্কিত খবর',
    published: 'প্রকাশিত',
    updated: 'আপডেট',
    author: 'লেখক',
    reporter: 'প্রতিবেদক',
    deskReport: 'ডেস্ক রিপোর্ট',
    views: 'দেখা হয়েছে',
    comments: 'মন্তব্য',
  },

  // Homepage Sections
  home: {
    leadStory: 'প্রধান খবর',
    latestNews: 'সর্বশেষ খবর',
    selectedNews: 'নির্বাচিত খবর',
    primeNews: 'প্রধান সংবাদ',
    featuredNews: 'বিশেষ প্রতিবেদন',
    moreNews: 'আরও খবর',
    allCategories: 'সকল বিভাগ',
  },

  // Common Actions
  actions: {
    viewAll: 'সব দেখুন',
    loadMore: 'আরও লোড করুন',
    back: 'ফিরে যান',
    next: 'পরবর্তী',
    previous: 'পূর্ববর্তী',
    close: 'বন্ধ করুন',
    submit: 'জমা দিন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    save: 'সংরক্ষণ',
  },

  // Time & Date
  time: {
    justNow: 'এইমাত্র',
    minutesAgo: 'মিনিট আগে',
    hoursAgo: 'ঘণ্টা আগে',
    daysAgo: 'দিন আগে',
    weeksAgo: 'সপ্তাহ আগে',
    monthsAgo: 'মাস আগে',
    yearsAgo: 'বছর আগে',
    today: 'আজ',
    yesterday: 'গতকাল',
  },

  // Search
  search: {
    placeholder: 'খবর খুঁজুন...',
    noResults: 'কোনো ফলাফল পাওয়া যায়নি',
    searching: 'খোঁজা হচ্ছে...',
    results: 'ফলাফল',
  },

  // Footer
  footer: {
    aboutUs: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    privacyPolicy: 'গোপনীয়তা নীতি',
    termsConditions: 'শর্তাবলী',
    advertise: 'বিজ্ঞাপন',
    careers: 'ক্যারিয়ার',
    followUs: 'আমাদের অনুসরণ করুন',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত',
  },

  // Error Messages
  errors: {
    pageNotFound: 'পৃষ্ঠা পাওয়া যায়নি',
    somethingWentWrong: 'কিছু একটা ভুল হয়েছে',
    tryAgain: 'আবার চেষ্টা করুন',
    loadingFailed: 'লোড করতে ব্যর্থ',
  },

  // Loading States
  loading: {
    loadingArticle: 'নিবন্ধ লোড হচ্ছে...',
    loadingContent: 'বিষয়বস্তু লোড হচ্ছে...',
    pleaseWait: 'অনুগ্রহ করে অপেক্ষা করুন...',
  },
} as const;

// Category mapping helper (English to Bengali)
export const CATEGORY_BENGALI_MAP: Record<string, string> = {
  'Bangladesh': 'বাংলাদেশ',
  'Politics': 'রাজনীতি',
  'Economics': 'অর্থনীতি',
  'Sports': 'খেলা',
  'Entertainment': 'বিনোদন',
  'International': 'আন্তর্জাতিক',
  'Opinion': 'মতামত',
  'Feature': 'ফিচার',
  'Samagra': 'সমগ্র',
  'Literature': 'সাহিত্য',
  
  // Already Bengali (for consistency)
  'বাংলাদেশ': 'বাংলাদেশ',
  'রাজনীতি': 'রাজনীতি',
  'অর্থনীতি': 'অর্থনীতি',
  'খেলা': 'খেলা',
  'বিনোদন': 'বিনোদন',
  'আন্তর্জাতিক': 'আন্তর্জাতিক',
  'মতামত': 'মতামত',
  'ফিচার': 'ফিচার',
  'সমগ্র': 'সমগ্র',
  'সাহিত্য': 'সাহিত্য',
};

// Helper function to get Bengali category name
export function getBengaliCategory(category: string): string {
  return CATEGORY_BENGALI_MAP[category] || category;
}

// Helper function to format Bengali numbers
export function toBengaliNumber(num: number): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    return /\d/.test(digit) ? bengaliNumerals[parseInt(digit)] : digit;
  }).join('');
}

// Helper function for relative time in Bengali
export function getRelativeTimeBengali(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return BENGALI_TEXT.time.justNow;
  if (diffMins < 60) return `${toBengaliNumber(diffMins)} ${BENGALI_TEXT.time.minutesAgo}`;
  if (diffHours < 24) return `${toBengaliNumber(diffHours)} ${BENGALI_TEXT.time.hoursAgo}`;
  if (diffDays < 7) return `${toBengaliNumber(diffDays)} ${BENGALI_TEXT.time.daysAgo}`;
  if (diffDays < 30) return `${toBengaliNumber(Math.floor(diffDays / 7))} ${BENGALI_TEXT.time.weeksAgo}`;
  if (diffDays < 365) return `${toBengaliNumber(Math.floor(diffDays / 30))} ${BENGALI_TEXT.time.monthsAgo}`;
  return `${toBengaliNumber(Math.floor(diffDays / 365))} ${BENGALI_TEXT.time.yearsAgo}`;
}
