"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import {
  formatBanglaDate,
  formatBanglaDateTime,
  formatBanglaTime,
} from "@/lib/utils";
import NewsActionButtons from "./NewsActionButtons";

const toBengaliNumber = (num: number): string => {
  const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => bengaliNumerals[parseInt(digit)] || digit)
    .join("");
};

interface SelectedNewsProps {
  news: NewsItem[];
  latestNews: NewsItem[];
}

export default function SelectedNews({ news, latestNews }: SelectedNewsProps) {
  if (!news || news.length === 0) return null;

  // Data Partitioning
  const mainLead = news[0]; // Left Column (Lead)
  const selectedList = news.slice(1, 6); // Middle Column (List of 5)
  // Sidebar: Take 10 items
  const latestList = latestNews ? latestNews.slice(0, 10) : [];

  return (
    <section className="bg-gray-50 py-12 border-t border-gray-200 mb-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
          <h2 className="text-3xl font-bold text-gray-900">নির্বাচিত খবর</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* COLUMN 1: LEAD NEWS (Span 5) - Large Card */}
          <div className="lg:col-span-5 lg:pr-6 mb-8 lg:mb-0">
            {mainLead && (
              <Link
                href={`/article/${mainLead.id}`}
                className="group block h-full bg-transparent hover:bg-white rounded-2xl p-5 shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={mainLead.image}
                    alt={mainLead.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                    {mainLead.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-snug group-hover:text-brand-red transition-colors duration-300 mb-3">
                  {mainLead.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 leading-relaxed text-base mb-4">
                  {mainLead.summary || "বিস্তারিত পড়তে ক্লিক করুন..."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  {mainLead.published_at && (
                    <p className="text-gray-400 text-xs">
                      {formatBanglaDateTime(mainLead.published_at)}
                    </p>
                  )}
                  <NewsActionButtons
                    title={mainLead.title}
                    url={`/article/${mainLead.id}`}
                  />
                </div>
              </Link>
            )}
          </div>

          {/* COLUMN 2: SELECTED NEWS LIST (Span 4) - Stacked Cards */}
          <div className="lg:col-span-4 lg:px-6 mb-8 lg:mb-0 flex flex-col gap-4">
            {selectedList.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="group flex gap-4 items-center bg-transparent hover:bg-white rounded-xl p-4 shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
              >
                <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-400 mt-1.5 block font-medium">
                    {item.published_at
                      ? formatBanglaDateTime(item.published_at)
                      : item.time || item.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* COLUMN 3: LATEST NEWS SIDEBAR (Span 3) - Stacked Small Cards */}
          <div className="lg:col-span-3 lg:pl-6">
            <h3 className="text-brand-red mb-5 capitalize text-xs tracking-wider flex items-center gap-2 font-bold">
              <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
              সর্বশেষ
            </h3>

            {/* Scrollable Container - showing ~4 items initially */}
            <div className="h-[400px] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-4">
              <div className="flex flex-col divide-y divide-gray-100">
                {latestList.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/article/${item.id}`}
                    className="group flex gap-3 items-center bg-transparent hover:bg-white rounded-xl p-3 transition-all duration-300"
                  >
                    <span className="text-2xl font-bold text-gray-300 group-hover:text-brand-red/20 transition-colors duration-300 w-8 shrink-0 text-center leading-none">
                      {toBengaliNumber(index + 1)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2 transition-colors duration-300 mb-1.5">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[10px] font-semibold text-brand-red bg-red-50 px-1.5 py-0.5 rounded">
                          {item.author || "ডেস্ক রিপোর্ট"}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.published_at
                            ? formatBanglaDateTime(item.published_at)
                            : item.time || "সদ্যপ্রাপ্ত"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/latest"
              className="w-full text-center mt-4 px-4 py-3 bg-white border-2 border-red-50 text-brand-red font-bold rounded-full hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              আরও খবর
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
