"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant4ListHeavy({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const main = news[0];
  const list = news.slice(1, 6);

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Big Item */}
        <Link
          href={`/article/${main.id}`}
          className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(main.image, 800)}
              alt={main.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-5">
            <h2 className="text-gray-900 text-2xl font-bold leading-tight group-hover:text-brand-red mb-3">
              {main.title}
            </h2>
            <p className="text-gray-600 line-clamp-3 text-base mb-4">
              {main.summary || "বিস্তারিত পড়ুন..."}
            </p>
            <div className="flex items-center justify-between mt-auto">
              {main.published_at && (
                <p className="text-gray-400 text-xs">
                  {formatBanglaDateTime(main.published_at)}
                </p>
              )}
              <NewsActionButtons
                title={main.title}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${main.id}`}
              />
            </div>
          </div>
        </Link>

        {/* List Items */}
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
            >
              <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getProxiedImageUrl(item.image, 200)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-400 mt-1 block">
                  {item.time || item.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
