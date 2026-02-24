"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import { getProxiedImageUrl } from "@/utils/image";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant11BorderedGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 5) return null;
  const lead = news[0];
  const second = news[1];
  const list = news.slice(2, 6);

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Col 1: Main Lead (Span 2) - 50% Width */}
        <div className="lg:col-span-2">
          <Link
            href={`/article/${lead.id}`}
            className="block h-full bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
          >
            <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-4 bg-gray-100">
              <Image
                src={getProxiedImageUrl(lead.image, 800)}
                alt={lead.title}
                sizes="100vw"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 md:p-6 pt-0">
              <span className="text-brand-red text-sm font-bold mb-2 block">
                {lead.category}
              </span>
              <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-brand-red transition-colors">
                {lead.title}
              </h2>
              <p className="text-gray-600 text-base line-clamp-3 leading-relaxed hidden md:block mb-4">
                {lead.summary || lead.title}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {lead.author || "ডেস্ক রিপোর্ট"}
                  </span>
                  <span className="text-gray-400 text-[11px] md:text-xs">
                    {lead.published_at
                      ? formatBanglaDateTime(lead.published_at)
                      : lead.time || lead.date}
                  </span>
                </div>
                <NewsActionButtons
                  title={lead.title}
                  url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${lead.id}`}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Col 2: Secondary Item (Span 1) - 25% Width */}
        <div className="lg:col-span-1">
          <Link
            href={`/article/${second.id}`}
            className="block h-full bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
          >
            <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-4 bg-gray-100">
              <Image
                src={getProxiedImageUrl(second.image, 400)}
                alt={second.title}
                sizes="100vw"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 pt-0">
              <h3 className="text-gray-900 text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red transition-colors mb-2">
                {second.title}
              </h3>
              <div className="flex flex-col gap-1 mt-auto">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {second.author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[11px]">
                  {second.published_at
                    ? formatBanglaDateTime(second.published_at)
                    : second.time || second.date}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Col 3: List (Span 1) - 25% Width */}
        <div className="lg:col-span-1 flex flex-col">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex flex-col p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
            >
              <h3 className="text-gray-900 text-sm md:text-base font-medium leading-snug group-hover:text-brand-red transition-colors line-clamp-3">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.author || "ডেস্ক রিপোর্ট"}
                </span>
                <span className="text-gray-400 text-[10px]">
                  {item.published_at
                    ? formatBanglaDateTime(item.published_at)
                    : item.time || item.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
