"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";

interface MostReadWidgetProps {
  opinionNews: NewsItem[];
  mostReadNews: NewsItem[];
  hideOpinion?: boolean; // New prop
}

// Bangla number converter
import { toBanglaDigits } from "@/utils/bn";

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
    <div className="bg-transparent mb-8">
      {/* Tabs */}
      <div className="flex border-b-2 border-brand-red mb-2">
        {!hideOpinion && (
          <button
            onClick={() => setActiveTab("opinion")}
            className={`flex-1 px-4 py-2 font-bold text-sm transition ${
              activeTab === "opinion"
                ? "text-brand-red"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            মতামত
          </button>
        )}
        <button
          onClick={() => setActiveTab("mostRead")}
          className={`flex-1 px-4 py-2 font-bold text-sm transition ${
            activeTab === "mostRead"
              ? "text-brand-red"
              : "text-gray-500 hover:text-gray-800"
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
            className="group flex gap-4 p-3 border-b border-gray-100 dark:border-gray-800 last:border-none rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
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
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-red line-clamp-2">
                {news.title}
              </h4>
              {activeTab === "opinion" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {news.author}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Link */}
      <Link
        href={
          activeTab === "opinion" ? "/category/opinion" : "/category/latest"
        }
        className="block bg-gray-50 dark:bg-gray-800 p-3 text-center text-xs font-bold text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700"
      >
        {activeTab === "opinion" ? "সব মতামত পড়ুন" : "সব খবর পড়ুন"}
      </Link>
    </div>
  );
}
