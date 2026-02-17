"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant2HorizontalSplit({ news }: { news: NewsItem[] }) {
  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
        {news.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={getProxiedImageUrl(item.image, 400)}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red mb-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-3">
                {item.published_at && (
                  <p className="text-gray-400 text-xs">
                    {formatBanglaDateTime(item.published_at)}
                  </p>
                )}
                <NewsActionButtons
                  title={item.title}
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${item.id}`}
                  className="scale-75 origin-right"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollReveal>
  );
}
