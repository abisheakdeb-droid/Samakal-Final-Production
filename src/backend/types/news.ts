export interface NewsItem {
  id: string;
  title: string;
  sub_headline?: string;
  summary: string;
  category: string;
  slug: string;
  catSlug?: string;
  image: string;
  author: string;
  date: string;
  time: string;
  content: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at?: string;
  news_type?: 'breaking' | 'regular' | 'feature' | 'opinion' | 'photo_story';
  location?: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  relatedVideo?: {
    id: string;
    source: 'youtube' | 'facebook';
    title?: string;
    thumbnail?: string;
  };
  images?: {
    id: string;
    url: string;
    caption?: string;
    type: 'featured' | 'thumbnail' | 'gallery';
  }[];
  contributors?: {
    id: string;
    name: string;
    role: string;
  }[];
}
