"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant7MagazineHero({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const hero = news[0];
  const subs = news.slice(1, 6);

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-6 h-auto">
        {/* Hero Item */}
        <Link
          href={`/article/${hero.id}`}
          className="md:col-span-5 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={getProxiedImageUrl(hero.image, 1024)}
              alt={hero.title}
              sizes="100vw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-brand-red text-white text-xs px-2.5 py-1 rounded-lg">
                {hero.category}
              </span>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <h2 className="text-gray-900 text-xl md:text-3xl font-bold leading-tight group-hover:text-brand-red mb-3">
              {hero.title}
            </h2>
            <p className="text-gray-600 line-clamp-2 text-base mb-4 hidden md:block">
              {hero.summary}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {hero.author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[11px] md:text-xs">
                  {hero.published_at
                    ? formatBanglaDateTime(hero.published_at)
                    : hero.time || hero.date}
                </span>
              </div>
              <NewsActionButtons
                title={hero.title}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${hero.id}`}
              />
            </div>
          </div>
        </Link>

        {/* Sub Items */}
        {subs.map((item) => (
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
              <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-3 group-hover:text-brand-red mb-2">
                {item.title}
              </h3>
              <div className="flex flex-col gap-1 mt-auto">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 w-fit">
                  {item.author || "ডেস্ক রিপোর্ট"}
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
