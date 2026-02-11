"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant6MosaicMix({ news }: { news: NewsItem[] }) {
  if (news.length < 4) return null;

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
        {/* Left Column: Lead Item (66%) */}
        <div className="lg:col-span-8 lg:pr-6 lg:border-r border-gray-200">
          <Link
            href={`/article/${news[0].id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={news[0].image}
                alt={news[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                {news[0].category}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <h2 className="text-gray-900 text-xl md:text-3xl font-bold leading-tight group-hover:text-brand-red mb-3">
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

        {/* Right Column: List of 3 Items (33%) */}
        <div className="lg:col-span-4 flex flex-col gap-4 pl-0 lg:pl-2">
          {news.slice(1, 4).map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
            >
              <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-3">
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
