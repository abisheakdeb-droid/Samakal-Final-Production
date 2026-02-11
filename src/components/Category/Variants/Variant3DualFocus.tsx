"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDate, formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant3DualFocus({ news }: { news: NewsItem[] }) {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto">
        {/* 2 Big Items */}
        {news.slice(0, 2).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="md:col-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
                {item.category}
              </span>
            </div>
            <div className="p-4 md:p-5">
              <h3 className="text-gray-900 text-xl font-bold leading-tight group-hover:text-brand-red mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 line-clamp-2 text-sm mb-3">
                {item.summary || item.title}
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

        {/* 2 Small Items */}
        {news.slice(2, 4).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="md:col-span-2 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 md:flex md:items-center md:gap-4 md:p-4"
          >
            <div className="relative aspect-video w-full md:w-1/3 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 md:p-0 md:flex-1">
              <h3 className="text-gray-900 text-lg font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs mt-2">
                {item.published_at ? formatBanglaDate(item.published_at) : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </ScrollReveal>
  );
}
