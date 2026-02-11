import LatestSidebarWidget from "@/components/LatestSidebarWidget";
import ScrollReveal from "@/components/ScrollReveal";
import AdSlot from "@/components/AdSlot";
import { redirect } from "next/navigation";
import ArticleContent from "@/components/ArticleContent";
import ViewTracker from "@/components/ViewTracker";
import {
  fetchArticleById,
  fetchArticlesByCategory,
  fetchLatestArticles,
} from "@/lib/actions-article";
import { fetchComments } from "@/lib/actions-comment";
import { auth } from "@/auth";
import JsonLd from "@/components/JsonLd";
import { Metadata, ResolvingMetadata } from "next";

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
    title: `${article.title} | সমকাল`,
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

  return (
    <div className="min-h-screen bg-background text-foreground font-serif">
      <JsonLd article={article} />
      <ViewTracker articleId={article.id} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <ArticleContent
              article={article}
              relatedNews={relatedNews}
              authorNews={authorNews}
              comments={comments.map((c) => ({
                id: c.id,
                content: c.content,
                author: c.author,
                avatar: c.avatar || undefined,
                created_at: c.created_at,
                timeAgo: c.timeAgo,
              }))}
              currentUser={session?.user}
            />
          </div>

          {/* Sidebar Column - Only Latest News + Ads */}
          <div className="lg:col-span-4 border-l border-gray-200 dark:border-gray-800 lg:pl-8">
            <ScrollReveal direction="left">
              <aside className="sticky bottom-4">
                <LatestSidebarWidget news={sidebarNews} />

                {/* Advertisement 1 */}
                <div className="mb-6 mt-8 w-full flex justify-center">
                  <AdSlot slotId="article-sidebar-1" format="rectangle" />
                </div>

                {/* Advertisement 2 */}
                <div className="flex justify-center w-full">
                  <AdSlot slotId="article-sidebar-2" format="rectangle" />
                </div>
              </aside>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
