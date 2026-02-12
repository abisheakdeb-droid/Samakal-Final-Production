"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDate, formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function DualCategoryGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 1) return null;
  const lead = news[0];
  const list = news.slice(1, 5);

  return (
    <ScrollReveal>
      <div className="flex flex-col gap-6">
        {/* Lead Item (Card Style) */}
        <Link
          href={`/article/${lead.id}`}
          className="group block bg-white rounded-xl p-4 shadow-sm border border-white hover:border-red-50 hover:shadow-md transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4 bg-gray-100">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="">
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-brand-red transition-colors">
              {lead.title}
            </h2>
            <p className="text-gray-600 line-clamp-2 text-sm mb-3">
              {lead.summary}
            </p>
            <div className="flex items-center justify-between mt-4">
              {lead.published_at && (
                <p className="text-gray-400 text-xs">
                  {formatBanglaDateTime(lead.published_at)}
                </p>
              )}
              <NewsActionButtons
                title={lead.title}
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/article/${lead.id}`}
              />
            </div>
          </div>
        </Link>

        {/* List Items */}
        <div className="flex flex-col">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex gap-3 items-start p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
            >
              <div className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-900 text-sm md:text-base font-medium leading-snug group-hover:text-brand-red line-clamp-2">
                  {item.title}
                </h3>
                {item.published_at && (
                  <span className="text-gray-400 text-xs">
                    {formatBanglaDate(item.published_at)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
