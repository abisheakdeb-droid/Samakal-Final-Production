// Phase 1: Core Metadata Types

export type NewsType = 'breaking' | 'regular' | 'feature' | 'opinion' | 'photo_story';

export interface NewsTypeOption {
  value: NewsType;
  label: string;
  description?: string;
}

export const NEWS_TYPE_OPTIONS: NewsTypeOption[] = [
  { 
    value: 'breaking', 
    label: 'ব্রেকিং নিউজ',
    description: 'জরুরি এবং গুরুত্বপূর্ণ খবর'
  },
  { 
    value: 'regular', 
    label: 'সাধারণ খবর',
    description: 'দৈনন্দিন সংবাদ'
  },
  { 
    value: 'feature', 
    label: 'ফিচার',
    description: 'বিস্তারিত প্রতিবেদন'
  },
  { 
    value: 'opinion', 
    label: 'মতামত',
    description: 'সম্পাদকীয় এবং মতামত'
  },
  { 
    value: 'photo_story', 
    label: 'ফটো স্টোরি',
    description: 'ছবি-কেন্দ্রিক প্রতিবেদন'
  },
];

export const BANGLADESH_LOCATIONS = [
  'ঢাকা',
  'চট্টগ্রাম',
  'সিলেট',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'রংপুর',
  'ময়মনসিংহ',
  'কুমিল্লা',
  'নারায়ণগঞ্জ',
  'গাজীপুর',
  'নেত্রকোনা',
  'কিশোরগঞ্জ',
  'টাঙ্গাইল',
  'মানিকগঞ্জ',
  'মুন্সীগঞ্জ',
  'নরসিংদী',
  'ফরিদপুর',
  'মাদারীপুর',
  'শরীয়তপুর',
  'গোপালগঞ্জ',
  'রাজবাড়ী',
  'চাঁপাইনবাবগঞ্জ',
  'নাটোর',
  'নওগাঁ',
  'পাবনা',
  'সিরাজগঞ্জ',
  'বগুড়া',
  'জয়পুরহাট',
  'দিনাজপুর',
  'কুড়িগ্রাম',
  'গাইবান্ধা',
  'লালমনিরহাট',
  'নীলফামারী',
  'পঞ্চগড়',
  'ঠাকুরগাঁও',
  'কক্সবাজার',
  'রাঙামাটি',
  'বান্দরবান',
  'খাগড়াছড়ি',
  'ফেনী',
  'লক্ষ্মীপুর',
  'নোয়াখালী',
  'ব্রাহ্মণবাড়িয়া',
  'চাঁদপুর',
  'জামালপুর',
  'শেরপুর',
  'ভোলা',
  'পটুয়াখালী',
  'পিরোজপুর',
  'ঝালকাঠি',
  'বরগুনা',
  'যশোর',
  'সাতক্ষীরা',
  'মেহেরপুর',
  'নড়াইল',
  'চুয়াডাঙ্গা',
  'কুষ্টিয়া',
  'মাগুরা',
  'ঝিনাইদহ',
  'বাগেরহাট',
  'হবিগঞ্জ',
  'মৌলভীবাজার',
  'সুনামগঞ্জ',
];

export interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  category: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  
  // Phase 1 Metadata
  sub_headline?: string;
  news_type?: NewsType;
  location?: string;
  keywords?: string[];
  tags?: string[];
  event_id?: string;

  // Phase 2 Media
  video_url?: string;
  images?: ArticleImage[];

  // Phase 3 Attribution & SEO
  contributors?: Contributor[];
  source?: string;
  source_url?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
}

export interface ArticleImage {
  id?: string;
  url: string;
  caption?: string; 
  type: 'featured' | 'gallery' | 'thumbnail';
  file?: File;
}

export interface Contributor {
  id?: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  slug?: string;
  description?: string;
}
