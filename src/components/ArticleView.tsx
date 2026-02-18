
import React from 'react';
import ArticleContent, { ArticleComment } from "@/components/ArticleContent";
import LatestSidebarWidget from "@/components/LatestSidebarWidget";
import ScrollReveal from "@/components/ScrollReveal";
import AdSlot from "@/components/AdSlot";
import ViewTracker from "@/components/ViewTracker";
import JsonLd from "@/components/JsonLd";
import Breadcrumb from "@/components/Breadcrumb";

import { NewsItem } from "@/types/news";

interface ArticleViewProps {
    article: NewsItem;
    relatedNews: NewsItem[];
    authorNews: NewsItem[];
    sidebarNews: NewsItem[];
    comments: ArticleComment[];
    currentUser?: {
        id?: string;
        name?: string | null;
        image?: string | null;
        email?: string | null;
    } | null;
}

export default function ArticleView({
    article,
    relatedNews,
    authorNews,
    sidebarNews,
    comments,
    currentUser
}: ArticleViewProps) {
    return (
        <div className="min-h-screen bg-background text-foreground font-serif">
            <JsonLd article={article} />
            <ViewTracker articleId={article.id} />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <Breadcrumb
                    currentSlug={article.catSlug || article.category}
                    isArticle={true}
                    articleTitle={article.title}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <ArticleContent
                            article={article}
                            relatedNews={relatedNews}
                            authorNews={authorNews}
                            comments={comments}
                            currentUser={
                                currentUser && currentUser.id
                                    ? {
                                        id: currentUser.id,
                                        name: currentUser.name,
                                        image: currentUser.image,
                                    }
                                    : undefined
                            }
                        />
                    </div>

                    {/* Sidebar Column - Only Latest News + Ads */}
                    <div className="lg:col-span-4 border-l border-gray-200 dark:border-gray-800 lg:pl-8">
                        <ScrollReveal direction="left">
                            <aside className="sticky bottom-4">
                                <LatestSidebarWidget news={sidebarNews} hideImages={true} />

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
