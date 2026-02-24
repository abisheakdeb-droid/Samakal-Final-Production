"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant8LShape({ news }: { news: NewsItem[] }) {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto">
        {/* Big Item 1 - Top left L part (Span 2x1) */}
        <Link
          href={`/article/${news[0].id}`}
          className="md:col-span-2 md:row-span-1 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
        >
          <div className="relative aspect-video md:w-1/2 overflow-hidden rounded-l-xl md:rounded-l-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(news[0].image, 600)}
              alt={news[0].title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-4 flex flex-col justify-center w-full">
            <h3 className="text-gray-900 text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red mb-2">
              {news[0].title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {news[0].author || "ডেস্ক"}
              </span>
              <span className="text-gray-400 text-[10px]">
                {news[0].published_at
                  ? formatBanglaDateTime(news[0].published_at)
                  : news[0].time || news[0].date}
              </span>
            </div>
          </div>
        </Link>

        {/* Item 3 - Top right */}
        <Link
          href={`/article/${news[2].id}`}
          className="md:col-span-2 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
        >
          <div className="relative aspect-video md:w-1/2 overflow-hidden rounded-l-xl md:rounded-l-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(news[2].image, 400)}
              alt={news[2].title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 flex flex-col justify-center w-full">
            <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red mb-2">
              {news[2].title}
            </h3>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {news[2].author || "ডেস্ক"}
              </span>
              <span className="text-gray-400 text-[10px]">
                {news[2].published_at
                  ? formatBanglaDateTime(news[2].published_at)
                  : news[2].time || news[2].date}
              </span>
            </div>
          </div>
        </Link>

        {/* Big Item 2 - Middle left L part (Span 2x2) */}
        <Link
          href={`/article/${news[1].id}`}
          className="md:col-span-2 md:row-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(news[1].image, 800)}
              alt={news[1].title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-4 md:p-6">
            <h3 className="text-gray-900 text-lg md:text-2xl font-bold leading-tight group-hover:text-brand-red">
              {news[1].title}
            </h3>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2 mb-3">
              {news[1].summary}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {news[1].author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[11px] md:text-xs">
                  {news[1].published_at
                    ? formatBanglaDateTime(news[1].published_at)
                    : news[1].time || news[1].date}
                </span>
              </div>
              <NewsActionButtons
                title={news[1].title}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${news[1].id}`}
                className="scale-90 origin-right"
              />
            </div>
          </div>
        </Link>

        {/* Item 4 - Middle right */}
        <Link
          href={`/article/${news[3].id}`}
          className="md:col-span-2 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
        >
          <div className="relative aspect-video md:w-1/2 overflow-hidden rounded-l-xl md:rounded-l-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(news[3].image, 400)}
              alt={news[3].title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 flex flex-col justify-center w-full">
            <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red mb-2">
              {news[3].title}
            </h3>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {news[3].author || "ডেস্ক"}
              </span>
              <span className="text-gray-400 text-[10px]">
                {news[3].published_at
                  ? formatBanglaDateTime(news[3].published_at)
                  : news[3].time || news[3].date}
              </span>
            </div>
          </div>
        </Link>

        {/* Items 5 & 6 - Bottom row */}
        {news.slice(4, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="md:col-span-1 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
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
            <div className="p-3">
              <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-red mb-1.5">
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.author || "ডেস্ক"}
                </span>
                <span className="text-gray-400 text-[10px]">
                  {item.published_at
                    ? formatBanglaDateTime(item.published_at)
                    : item.time || item.date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollReveal>
  );
}
