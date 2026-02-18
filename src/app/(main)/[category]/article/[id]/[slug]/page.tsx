
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { fetchArticleById, fetchArticlesByCategory, fetchLatestArticles } from "@/lib/actions-article";
import { fetchComments } from "@/lib/actions-comment";
import { auth } from "@/auth";
import { NewsItem } from "@/types/news";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
    params: Promise<{
        category: string;
        id: string;
        slug: string;
    }>;
}

// Generate Metadata for SEO
export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Fetch article by ID (legacy route uses numeric ID usually, but our fetcher handles it)
    const article = await fetchArticleById(id);

    if (!article) {
        return {
            title: "Article Not Found | Samakal",
            description: "The requested article could not be found.",
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const articleImage = article.image ? [article.image] : [];

    return {
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com",
        ),
        title: article.title,
        description:
            article.sub_headline ||
            article.summary ||
            `Detailed report on ${article.category} from Samakal.`,
        openGraph: {
            type: "article",
            title: article.title,
            description: article.sub_headline || article.summary || undefined,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com"}/${resolvedParams.category}/article/${resolvedParams.id}/${resolvedParams.slug}`,
            siteName: "Samakal",
            images: [...articleImage, ...previousImages],
            publishedTime: article.date,
            authors: [article.author || "Samakal Reporter"],
            tags: [article.category],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.sub_headline || article.summary || undefined,
            images: articleImage,
        },
        alternates: {
            // Canonical points to the modern /article/[slug] route to prevent duplicate content penalty
            canonical: `/article/${article.slug}`,
        },
    };
}

export default async function LegacyArticlePage({ params }: PageProps) {
    const resolvedParams = await params;
    const { id, category } = resolvedParams;

    // 1. Fetch Article by ID
    const article = await fetchArticleById(id);

    if (!article) {
        return notFound();
    }

    // Optional: Redirect if the slug in URL doesn't match the article's actual slug 
    // (Good for SEO consistency, but user asked for "Zero Redirect" initially, so maybe soft validation)
    // Current implementation: Just render.

    // 2. Fetch Related & Sidebar Data
    // We use the category from the article object to ensure relationship accuracy, 
    // falling back to URL param if needed.
    const articleCategory = article.category || category;

    const relatedNews = await fetchArticlesByCategory(articleCategory, 4);
    const authorNews = await fetchArticlesByCategory(articleCategory, 10);
    const sidebarNews = await fetchLatestArticles(10);

    // 3. Fetch Comments & User Session
    const comments = await fetchComments(article.id);
    const session = await auth();

    const formattedComments = comments.map((c) => ({
        id: c.id,
        content: c.content,
        author: c.author,
        avatar: c.avatar || undefined,
        created_at: c.created_at,
        timeAgo: c.timeAgo,
    }));

    return (
        <ArticleView
            article={article}
            relatedNews={relatedNews.map((n: NewsItem) => ({ ...n, author: String(n.author || 'ডেস্ক রিপোর্ট'), date: String(n.date || ''), time: String(n.time || ''), sub_headline: (n.sub_headline as string) || undefined, summary: String(n.summary || ''), category: String(n.category || ''), image: String(n.image || '') })) as NewsItem[]}
            authorNews={authorNews.map((n: NewsItem) => ({ ...n, author: String(n.author || 'ডেস্ক রিপোর্ট'), date: String(n.date || ''), time: String(n.time || ''), sub_headline: (n.sub_headline as string) || undefined, summary: String(n.summary || ''), category: String(n.category || ''), image: String(n.image || '') })) as NewsItem[]}
            sidebarNews={sidebarNews.map((n: NewsItem) => ({ ...n, author: String(n.author || 'ডেস্ক রিপোর্ট'), date: String(n.date || ''), time: String(n.time || ''), sub_headline: (n.sub_headline as string) || undefined, summary: String(n.summary || ''), category: String(n.category || ''), image: String(n.image || '') })) as NewsItem[]}
            comments={formattedComments}
            currentUser={session?.user}
        />
    );
}
