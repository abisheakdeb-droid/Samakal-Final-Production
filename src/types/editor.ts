export interface ArticleSettings {
    // 1. Basic Taxonomy
    primary_category_id: number;      // Determines the URL slug
    additional_category_ids: number[]; // Appears in related sections

    // 2. Geo-Location (Crucial for 'Saradesh')
    location: {
        division_id: number | null;
        district_id: number | null;
        upazila_id: number | null;
    };

    // 3. Post Format Logic
    post_format: 'standard' | 'video' | 'gallery';
    video_url?: string;        // Only valid if format == 'video'
    gallery_images?: string[]; // Only valid if format == 'gallery'

    // 4. Grouping & Series
    tags: string[];            // Generic tags (e.g., "Accident", "Police")
    series_topic_id?: number;  // Specific Event (e.g., "Budget 2026")

    // 5. SEO & Social Overrides
    seo_title?: string;        // Different from H1 Headline
    meta_description?: string;
    social_share_image?: string; // Optimized for OG Tags (1200x630)

    // 6. Publishing Options
    is_featured: boolean;      // Pin to Category Lead?
    is_breaking: boolean;      // Add to Breaking Ticker?
}
