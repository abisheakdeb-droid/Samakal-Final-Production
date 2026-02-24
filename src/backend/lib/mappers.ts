import type { ArticleRow, ExtraArticleData } from "@/types/database";
import { getBengaliCategory } from "@/utils/category";

// Helper to map DB result to UI NewsItem shape
import { toBanglaDigits } from "@/utils/bn";

export function mapArticleToNewsItem(
    article: ArticleRow, 
    extraData: ExtraArticleData = {}
) {
    const dateObj = new Date(article.created_at);
    
    // Video Mapping
    let relatedVideo = undefined;
    if (article.video_url) {
        const isYoutube = article.video_url.includes('youtube') || article.video_url.includes('youtu.be');
        const isFacebook = article.video_url.includes('facebook');
        
        // Simple ID extraction (robust regex could be better)
        let videoId = article.video_url; 
        if (isYoutube) {
             const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
             const match = article.video_url.match(regExp);
             videoId = (match && match[2].length === 11) ? match[2] : videoId;
        } else if (isFacebook) {
             // Basic fallback for FB, usually full URL or ID extraction needed
             // For now, passing ID/URL as is, assuming player handles it or needs update
        }

        relatedVideo = {
            id: videoId,
            source: (isYoutube ? 'youtube' : 'facebook') as 'youtube' | 'facebook',
            title: 'Related Video'
        };
    }

    return {
        id: article.id, // Using UUID as ID for routing
        title: article.title,
        sub_headline: article.sub_headline,
        slug: article.slug,
        image: article.image || '/placeholder.svg',
        category: getBengaliCategory(article.category),
        catSlug: (article.category || 'uncategorized').toLowerCase(),
        author: article.author || 'ডেস্ক রিপোর্ট',
        date: dateObj.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }), // Bengali Date
        time: getTimeAgo(dateObj),
        summary: stripHtml(article.content || '').substring(0, 150) + '...', // Simple extract
        content: article.content || '',

        status: (article.status as 'draft' | 'published' | 'archived' | 'scheduled') || 'published',
        // New Fields
        news_type: article.news_type as 'breaking' | 'regular' | 'feature' | 'opinion' | 'photo_story',
        location: article.location,
        source: article.source,
        sourceUrl: article.source_url,
        tags: extraData.tags || [],
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

function getTimeAgo(date: Date) {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60 / 60);
    return diff < 1 ? 'এইমাত্র' : `${toBanglaDigits(diff)} ঘণ্টা আগে`;
}

function stripHtml(html: string) {
   if (!html) return '';
   return html.replace(/<[^>]*>?/gm, '');
}
