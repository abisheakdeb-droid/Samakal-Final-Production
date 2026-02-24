"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import ScrollReveal from "../../ScrollReveal";

export function SimpleList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  return (
    <ScrollReveal>
      <div className="flex flex-col">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
          >
            <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={getProxiedImageUrl(item.image, 200)}
                alt={item.title}
                sizes="100vw"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col gap-1 w-full relative">
              <h3 className="text-gray-900 text-sm font-medium leading-snug group-hover:text-brand-red line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[10px] md:text-xs">
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
