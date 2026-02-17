"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant9FocusList({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
        {/* Col 1: Large Vertical Item */}
        <div className="relative">
          <Link
            href={`/article/${news[0].id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={getProxiedImageUrl(news[0].image, 600)}
                alt={news[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                {news[0].category}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-3">
                {news[0].title}
              </h2>
              <p className="text-gray-600 line-clamp-3 text-base mb-4">
                {news[0].summary || "বিস্তারিত..."}
              </p>
              <div className="flex items-center justify-between mt-auto">
                {news[0].published_at && (
                  <p className="text-gray-400 text-xs">
                    {formatBanglaDateTime(news[0].published_at)}
                  </p>
                )}
                <NewsActionButtons
                  title={news[0].title}
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${news[0].id}`}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Col 2: Large Vertical Item */}
        <div className="relative">
          <Link
            href={`/article/${news[1].id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={getProxiedImageUrl(news[1].image, 600)}
                alt={news[1].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                {news[1].category}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-3">
                {news[1].title}
              </h2>
              <p className="text-gray-600 line-clamp-3 text-base mb-4">
                {news[1].summary || "বিস্তারিত..."}
              </p>
              <div className="flex items-center justify-between mt-auto">
                {news[1].published_at && (
                  <p className="text-gray-400 text-xs">
                    {formatBanglaDateTime(news[1].published_at)}
                  </p>
                )}
                <NewsActionButtons
                  title={news[1].title}
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${news[1].id}`}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Col 3: List of 4 items */}
        <div className="flex flex-col h-full">
          {news.slice(2, 6).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex gap-3 p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300 items-center flex-1"
            >
              <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden aspect-video bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 200)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
