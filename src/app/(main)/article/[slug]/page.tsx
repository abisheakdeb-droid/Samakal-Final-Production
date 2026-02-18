import { redirect } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import {
  fetchArticleById,
  fetchArticlesByCategory,
  fetchLatestArticles,
} from "@/lib/actions-article";
import { fetchComments } from "@/lib/actions-comment";
import { auth } from "@/auth";
import { Metadata, ResolvingMetadata } from "next";
import { NewsItem } from "@/types/news";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await fetchArticleById(slug);

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
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com"}/article/${article.slug}`,
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
      canonical: `/article/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params; // Next.js 15+ convention for async params
  const slug = resolvedParams.slug;

  // 1. Fetch Article
  const article = await fetchArticleById(slug);

  // Redirect logic: If user visited /article/123 (numeric ID), redirect to /article/actual-slug
  if (article && /^\d+$/.test(slug) && article.slug !== slug) {
    redirect(`/article/${article.slug}`);
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground font-serif">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Article Not Found</h1>
          <p>The article you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // 2. Fetch Related & Sidebar Data
  const relatedNews = await fetchArticlesByCategory(article.category, 4);
  const authorNews = await fetchArticlesByCategory(article.category, 10);
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
