"use client";

import Image from "next/image";
import Link from "next/link";
import { generateBlurPlaceholder, getProxiedImageUrl } from "@/utils/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "@/components/NewsActionButtons";
import ScrollReveal from "./ScrollReveal";

interface HeroCardProps {
  news: NewsItem;
}

export default function HeroCard({ news }: HeroCardProps) {
  return (
    <ScrollReveal>
      <Link
        href={`/article/${news.id}`}
        className="group cursor-pointer flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={getProxiedImageUrl(news.image, 800)}
            alt={news.title}
            fill
            priority
            placeholder="blur"
            blurDataURL={generateBlurPlaceholder(16, 9)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-brand-red text-white px-3 py-1 text-xs font-bold rounded shadow-sm">
              {news.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-brand-red transition-colors">
              {news.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
              {news.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 mt-auto border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {news.author}
              </span>
              <span>•</span>
              <span>
                {news.published_at
                  ? formatBanglaDateTime(news.published_at)
                  : news.time}
              </span>
            </div>

            <NewsActionButtons
              title={news.title}
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${news.id}`}
            />
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
