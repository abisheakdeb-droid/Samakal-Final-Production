/**
 * Database Row Types
 * Type definitions for database query results
 */

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  category?: string;
  views?: number;
  image?: string;
  created_at: string;
  content?: string;
  sub_headline?: string;
  news_type?: string;
  location?: string;
  video_url?: string;
  video_thumbnail?: string;
  source?: string;
  source_url?: string;
  author?: string;
  event_id?: string;
  is_featured?: boolean;
  is_prime?: boolean;
  published_at?: string;
  scheduled_at?: string;
  home_position?: number;
  is_pinned_home?: boolean;
  [key: string]: unknown; // Allow additional properties from SQL queries
}

export interface ArticleImageRow {
  id: string;
  article_id: string;
  image_url: string;
  image_type: 'featured' | 'thumbnail' | 'gallery';
  caption?: string;
  photographer?: string;
  display_order: number;
  created_at: string;
}

export interface ArticleContributorRow {
  id: string;
  article_id: string;
  contributor_id?: string;
  role: string;
  custom_name?: string;
  display_name?: string;
  display_order: number;
  created_at?: string;
}

export interface ArticleSEOData {
  source?: string;
  source_url?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
}

export interface ExtraArticleData {
  images?: ArticleImageRow[];
  contributors?: ArticleContributorRow[];
  tags?: string[];
}
