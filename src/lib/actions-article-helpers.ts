import type { ArticleRow, ExtraArticleData } from "@/types/database";
import { getBengaliCategory } from "@/utils/category";
import { formatBanglaDate } from "@/lib/utils";

// Helper to map DB result to UI NewsItem shape
import { formatRelativeTime } from "@/utils/bn";

// Helper to decode HTML entities like &nbsp;
function decodeHTMLEntities(text: string): string {
    const entities: Record<string, string> = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'"
    };
    
    return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

function stripHtml(html: string): string {
    // Remove HTML tags and decode entities
    const withoutTags = html.replace(/<[^>]*>/g, '');
    return decodeHTMLEntities(withoutTags);
}

export function mapArticleToNewsItem(
    article: ArticleRow, 
    extraData: ExtraArticleData = {}
) {
    const dateObj = new Date(article.created_at);
    
    // Video Mapping
    let relatedVideo = undefined;
    if (article.video_url) {
        const isYoutube = article.video_url.includes('youtube') || article.video_url.includes('youtu.be');
        // Removed unused isFacebook check
        
        let videoId = article.video_url; 
        if (isYoutube) {
             const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
             const match = article.video_url.match(regExp);
             videoId = (match && match[2].length === 11) ? match[2] : videoId;
        }

        relatedVideo = {
            id: videoId,
            source: (isYoutube ? 'youtube' : 'facebook') as 'youtube' | 'facebook',
            title: 'Related Video'
        };
    }

    return {
        id: article.id,
        title: article.title,
        sub_headline: article.sub_headline,
        status: article.status as 'draft' | 'published' | 'archived' | 'scheduled',
        slug: article.slug,
        image: article.image || '/placeholder.svg',
        category: getBengaliCategory(article.category),
        catSlug: (article.category || 'uncategorized').toLowerCase(),
        author: article.author || 'ডেস্ক রিপোর্ট',
        date: formatBanglaDate(dateObj),
        time: formatRelativeTime(dateObj.toISOString()),
        summary: stripHtml(article.content || '').substring(0, 150) + '...',
        content: article.content || '',
        news_type: article.news_type as 'breaking' | 'regular' | 'feature' | 'opinion' | 'photo_story',
        location: article.location,
        source: article.source,
        sourceUrl: article.source_url,
        published_at: dateObj.toISOString(),
        tags: extraData.tags || [],
        is_featured: !!article.is_featured,
        is_prime: !!article.is_prime,
        images: extraData.images?.map((img) => ({
            id: img.id,
            url: img.image_url,
            caption: img.caption,
            type: img.image_type
        })),
        contributors: extraData.contributors?.map((con) => ({
             id: con.id,
             name: con.display_name || 'Contributor', 
             role: con.role
        })),
        relatedVideo: relatedVideo
    };
}

