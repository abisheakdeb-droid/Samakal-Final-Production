"use client";

import Link from "next/link";
import NewsImage from "@/components/NewsImage";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";

interface LatestSidebarWidgetProps {
  news: NewsItem[];
  hideImages?: boolean;
}

export default function LatestSidebarWidget({
  news,
  hideImages = false,
}: LatestSidebarWidgetProps) {
  return (
    <ScrollReveal direction="left">
      <div className="flex flex-col gap-6 font-serif">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            সর্বশেষ সংবাদ
          </h2>
        </div>

        {/* News List Container with Scroll */}
        <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-col gap-4">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="group flex gap-3 p-2 items-start border-b border-gray-50 dark:border-gray-900 last:border-0 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all"
              >
                {/* Image Section - Conditional */}
                {!hideImages && (
                  <div className="w-24 h-16 relative overflow-hidden rounded-lg shrink-0 bg-gray-100 dark:bg-gray-800">
                    <NewsImage
                      src={item.image || "/samakal-logo.png"}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-red leading-snug line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                    {item.summary}
                  </p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                    {item.published_at
                      ? formatBanglaDateTime(item.published_at)
                      : (item.time || item.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <Link
          href="/category/latest"
          className="w-full py-2.5 bg-gray-50 dark:bg-gray-800/50 text-brand-red text-center font-bold rounded-full hover:bg-brand-red hover:text-white transition-all duration-300 text-xs border border-gray-100 dark:border-gray-700"
        >
          সব খবর পড়ুন
        </Link>
      </div>
    </ScrollReveal>
  );
}
