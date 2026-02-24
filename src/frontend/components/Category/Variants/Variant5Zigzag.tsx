"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant5Zigzag({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
        {/* Left Column: Lead Item (Square-ish) */}
        <Link
          href={`/article/${news[0].id}`}
          className="lg:col-span-5 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(news[0].image, 800)}
              alt={news[0].title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
              {news[0].category}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-2">
              {news[0].title}
            </h2>
            <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm md:text-base mb-4">
              {news[0].summary || "বিস্তারিত..."}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {news[0].author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[11px] md:text-xs">
                  {news[0].published_at
                    ? formatBanglaDateTime(news[0].published_at)
                    : news[0].time || news[0].date}
                </span>
              </div>
              <NewsActionButtons
                title={news[0].title}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${news[0].id}`}
              />
            </div>
          </div>
        </Link>

        {/* Middle Column: 2 Items Stacked */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full">
          {news.slice(1, 3).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex-1"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 400)}
                  alt={item.title}
                  sizes="100vw"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-full">
                <h3 className="text-gray-900 text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {item.author || "ডেস্ক রিপোর্ট"}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    {item.published_at
                      ? formatBanglaDateTime(item.published_at)
                      : item.time || item.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column: 3 Items List */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          {news.slice(3, 6).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
            >
              <div className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 200)}
                  alt={item.title}
                  sizes="100vw"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col justify-center w-full">
                <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2 mb-1.5">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {item.author || "ডেস্ক"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {item.published_at
                      ? formatBanglaDateTime(item.published_at)
                      : item.time || item.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
