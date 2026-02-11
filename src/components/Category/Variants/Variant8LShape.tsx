"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
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
              src={news[0].image}
              alt={news[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <h3 className="text-gray-900 text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red">
              {news[0].title}
            </h3>
          </div>
        </Link>

        {/* Item 3 - Top right */}
        <Link
          href={`/article/${news[2].id}`}
          className="md:col-span-2 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
        >
          <div className="relative aspect-video md:w-1/2 overflow-hidden rounded-l-xl md:rounded-l-xl bg-gray-100">
            <Image
              src={news[2].image}
              alt={news[2].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
              {news[2].title}
            </h3>
          </div>
        </Link>

        {/* Big Item 2 - Middle left L part (Span 2x2) */}
        <Link
          href={`/article/${news[1].id}`}
          className="md:col-span-2 md:row-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={news[1].image}
              alt={news[1].title}
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
              {news[1].published_at && (
                <p className="text-gray-400 text-xs">
                  {formatBanglaDateTime(news[1].published_at)}
                </p>
              )}
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
              src={news[3].image}
              alt={news[3].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 flex flex-col justify-center">
            <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
              {news[3].title}
            </h3>
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
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </ScrollReveal>
  );
}
