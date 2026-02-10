"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchArticlesWithPagination } from "@/lib/actions-article";
import { localizeTime } from "@/utils/bn";
import { generateBlurPlaceholder } from "@/utils/image";
import { useCallback } from "react";

interface NewsItem {
  id: string;
  title: string;
  image: string;
  summary: string;
  time: string;
}

export default function InfiniteLatestNews({
  initialNews,
}: {
  initialNews: NewsItem[];
}) {
  const [news, setNews] = useState(initialNews);
  const [offset, setOffset] = useState(20); // Initial load was 20
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newArticles = await fetchArticlesWithPagination(offset, 20);

    if (newArticles.length === 0) {
      setHasMore(false);
    } else {
      setNews((prev) => [...prev, ...newArticles]);
      setOffset((prev) => prev + 20);
    }

    setLoading(false);
  }, [loading, hasMore, offset]);

  // Intersection Observer for auto-load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [offset, loading, hasMore, loadMore]);

  return (
    <>
      <section className="flex flex-col gap-6">
        {news.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 last:border-0 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
          >
            <div className="w-full md:w-64 aspect-video md:aspect-4/3 relative overflow-hidden rounded-lg shrink-0">
              <Image
                src={article.image}
                alt={article.title}
                fill
                placeholder="blur"
                blurDataURL={generateBlurPlaceholder(4, 3)}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-red mb-2 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-3 text-sm md:text-base">
                {article.summary}
              </p>
              <span className="text-xs text-gray-400">
                {localizeTime(article.time)}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Loader / Trigger */}
      <div ref={loaderRef} className="mt-12 text-center py-8">
        {loading && (
          <div className="flex justify-center items-center gap-2">
            <div
              className="w-2 h-2 bg-brand-red rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-red rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-red rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
        {!hasMore && <p className="text-gray-400">আর কোন খবর নেই</p>}
      </div>
    </>
  );
}
