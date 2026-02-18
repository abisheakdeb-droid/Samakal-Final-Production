"use client";

import { useState } from "react";
import Link from "next/link";
import NewsImage from "@/components/NewsImage";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { toBanglaDigits } from "@/utils/bn";
import ScrollReveal from "@/components/ScrollReveal";

interface MostReadWidgetProps {
  opinionNews: NewsItem[];
  mostReadNews: NewsItem[];
  hideOpinion?: boolean;
}

// Get consistent profile/author image IDs from Unsplash
const getAuthorImageId = (index: number): string => {
  const imageIds = [
    "1580489944761-99b265f6fa56", // Professional
    "1507003211169-0a1dd7228f2d", // Business
    "1494790108377-be9c29b29330", // Young
    "1573496359142-b8d87734a5a2", // Mature
    "1566492031773-4f4e44671857", // Creative
  ];
  return imageIds[index % imageIds.length];
};

export default function MostReadWidget({
  opinionNews,
  mostReadNews,
  hideOpinion = false,
}: MostReadWidgetProps) {
  // If hideOpinion is true, default to mostRead tab
  const [activeTab, setActiveTab] = useState<"opinion" | "mostRead">(
    hideOpinion ? "mostRead" : "opinion",
  );

  const newsToShow = activeTab === "opinion" ? opinionNews : mostReadNews;

  return (
    <ScrollReveal direction="left">
      <div className="bg-transparent mb-8 font-serif">
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-6 relative border border-gray-200 dark:border-gray-700">
          {!hideOpinion && (
            <button
              onClick={() => setActiveTab("opinion")}
              className={`flex-1 px-4 py-2 font-bold text-sm rounded-full transition-all duration-300 relative z-10 ${activeTab === "opinion"
                ? "bg-white dark:bg-gray-700 text-brand-red shadow-md"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              মতামত
            </button>
          )}
          <button
            onClick={() => setActiveTab("mostRead")}
            className={`flex-1 px-4 py-2 font-bold text-sm rounded-full transition-all duration-300 relative z-10 ${activeTab === "mostRead"
              ? "bg-white dark:bg-gray-700 text-brand-red shadow-md"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            সর্বাধিক পঠিত
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {newsToShow.slice(0, 5).map((news, index) => (
            <Link
              key={news.id}
              href={`/article/${news.id}`}
              className="group flex gap-4 p-3 border-b border-gray-100 dark:border-gray-800 last:border-none rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-all"
            >
              {/* Image Section */}
              {activeTab === "opinion" ? (
                <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-brand-red/10">
                  <NewsImage
                    src={news.image || `https://images.unsplash.com/photo-${getAuthorImageId(index)}?w=100&h=100&fit=crop&crop=faces`}
                    alt={news.author || "Author"}
                    fill
                    sizes="100px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="shrink-0 w-12 flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-200 dark:text-gray-700 group-hover:text-brand-red/20 transition-colors">
                    {toBanglaDigits(index + 1)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-brand-red line-clamp-2 leading-snug mb-1 transition-colors">
                  {news.title}
                </h4>
                {news.summary && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1 font-medium italic">
                    {news.summary}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-red">
                    {activeTab === "opinion"
                      ? news.author
                      : news.author || "ডেস্ক রিপোর্ট"}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                    {news.published_at
                      ? formatBanglaDateTime(news.published_at)
                      : news.time || news.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-8">
          <Link
            href={
              activeTab === "opinion" ? "/category/opinion" : "/category/latest"
            }
            className="block text-center py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-brand-red hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-800 rounded-full bg-gray-50 dark:bg-gray-800/50"
          >
            {activeTab === "opinion" ? "সব মতামত পড়ুন" : "সব খবর পড়ুন"}
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
