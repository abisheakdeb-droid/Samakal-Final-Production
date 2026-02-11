"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { toBanglaDigits } from "@/utils/bn";
import ScrollReveal from "@/components/ScrollReveal";

interface MostReadWidgetProps {
  opinionNews: NewsItem[];
  mostReadNews: NewsItem[];
  hideOpinion?: boolean;
}

// Get consistent profileauthor image IDs from Unsplash
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
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-4 relative">
          {!hideOpinion && (
            <button
              onClick={() => setActiveTab("opinion")}
              className={`flex-1 px-4 py-2 font-bold text-sm rounded-full transition-all duration-300 relative z-10 ${
                activeTab === "opinion"
                  ? "bg-white dark:bg-gray-700 text-brand-red shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              মতামত
            </button>
          )}
          <button
            onClick={() => setActiveTab("mostRead")}
            className={`flex-1 px-4 py-2 font-bold text-sm rounded-full transition-all duration-300 relative z-10 ${
              activeTab === "mostRead"
                ? "bg-white dark:bg-gray-700 text-brand-red shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            সর্বাধিক পঠিত
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {newsToShow.slice(0, 5).map((news, index) => (
            <Link
              key={news.id}
              href={`/article/${news.id}`}
              className="group flex gap-4 p-3 border-b border-gray-100 dark:border-gray-800 last:border-none rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all font-serif"
            >
              {/* Number Counter or Author Image */}
              {activeTab === "opinion" ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative shrink-0 border border-gray-100 dark:border-gray-700 mt-1">
                  {/* Author profile images from Unsplash */}
                  <Image
                    src={`https://images.unsplash.com/photo-${getAuthorImageId(index)}?w=100&h=100&fit=crop&crop=faces`}
                    alt="Author"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-brand-red/20 transition-colors -mt-1 w-8 shrink-0 text-center">
                  {toBanglaDigits(index + 1)}
                </span>
              )}

              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-red line-clamp-2 mb-1">
                  {news.title}
                </h4>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-brand-red">
                    {activeTab === "opinion"
                      ? news.author
                      : news.author || "ডেস্ক রিপোর্ট"}
                  </span>
                  <span className="text-[10px] text-gray-400">
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
        <div className="mt-4">
          <Link
            href={
              activeTab === "opinion" ? "/category/opinion" : "/category/latest"
            }
            className="block bg-gray-50 dark:bg-gray-800 p-3 text-center text-xs font-bold text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-full border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            {activeTab === "opinion" ? "সব মতামত পড়ুন" : "সব খবর পড়ুন"}
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
