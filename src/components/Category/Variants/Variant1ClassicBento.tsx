"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import { formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "../../NewsActionButtons";
import ScrollReveal from "../../ScrollReveal";

export function Variant1ClassicBento({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const main = news[0];
  const subs = news.slice(1, 5);

  return (
    <ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto">
        {/* Main Item */}
        <Link
          href={`/article/${main.id}`}
          className="col-span-2 row-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={main.image}
              alt={main.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
              {main.category}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red transition-colors mb-2">
              {main.title}
            </h2>
            <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm md:text-base mb-3">
              {main.summary || "বিস্তারিত পড়তে ক্লিক করুন..."}
            </p>
            <div className="flex items-center justify-between mt-4">
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

        {/* Sub Items */}
        {subs.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="col-span-1 row-span-1 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
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
