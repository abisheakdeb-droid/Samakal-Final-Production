"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDate, formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant10StandardGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <ScrollReveal>
      <div className="flex flex-col gap-6">
        {/* Top Row: 2 Items (50-50) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.slice(0, 2).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 600)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                  {item.category}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm md:text-base mb-4">
                  {item.summary || "বিস্তারিত..."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  {item.published_at && (
                    <p className="text-gray-400 text-xs">
                      {formatBanglaDateTime(item.published_at)}
                    </p>
                  )}
                  <NewsActionButtons
                    title={item.title}
                    url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${item.id}`}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Row: 4 Items (25-25-25-25) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {news.slice(2, 6).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
            >
              <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-3 bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 400)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 pt-0">
                <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug group-hover:text-brand-red line-clamp-2">
                  {item.title}
                </h3>
                {item.published_at && (
                  <p className="text-gray-400 text-xs mt-2">
                    {formatBanglaDate(item.published_at)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
