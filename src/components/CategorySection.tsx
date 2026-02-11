"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import {
  formatBanglaDate,
  formatBanglaDateTime,
  formatBanglaTime,
} from "@/lib/utils";
import NewsActionButtons from "./NewsActionButtons";

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  news: NewsItem[];
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  showViewAll?: boolean;
  dualMode?: boolean;
  secondCategory?: {
    title: string;
    categorySlug: string;
    news: NewsItem[];
  };
  thirdCategory?: {
    title: string;
    categorySlug: string;
    news: NewsItem[];
  };
}

export default function CategorySection({
  title,
  categorySlug,
  news,
  variant = 1,
  showViewAll = true,
  dualMode = false,
  secondCategory,
  thirdCategory,
}: CategorySectionProps) {
  if (!news || news.length === 0) return null;

  // Ensure we have enough items for the variant
  // Variants need at minimum 4-6 items. If less, use simple list fallback
  const minItemsNeeded =
    variant === 7
      ? 6
      : variant === 5
        ? 6
        : variant === 6
          ? 5
          : variant === 9
            ? 6
            : variant === 10
              ? 6
              : variant === 11
                ? 5
                : 4;
  if (news.length < minItemsNeeded && !dualMode && !thirdCategory) {
    // Fallback to simple grid if not enough items
    return (
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h2>
            </div>
            {showViewAll && (
              <Link
                href={`/category/${categorySlug}`}
                className="text-brand-red font-bold text-sm hover:underline"
              >
                সব দেখুন &rarr;
              </Link>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="relative aspect-video rounded-lg overflow-hidden group"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Triple category mode - render three categories side by side
  if (thirdCategory && secondCategory) {
    return (
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* First Category */}
            <div className="lg:pr-6 mb-8 lg:mb-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {title}
                  </h2>
                </div>
                {showViewAll && (
                  <Link
                    href={`/category/${categorySlug}`}
                    className="text-brand-red font-bold text-sm hover:underline"
                  >
                    সব দেখুন &rarr;
                  </Link>
                )}
              </div>
              <DualCategoryGrid news={news.slice(0, 6)} />
            </div>

            {/* Second Category */}
            <div className="lg:px-6 mb-8 lg:mb-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {secondCategory.title}
                  </h2>
                </div>
                {showViewAll && (
                  <Link
                    href={`/category/${secondCategory.categorySlug}`}
                    className="text-brand-red font-bold text-sm hover:underline"
                  >
                    সব দেখুন &rarr;
                  </Link>
                )}
              </div>
              <DualCategoryGrid news={secondCategory.news.slice(0, 6)} />
            </div>

            {/* Third Category (Jobs - List Style) */}
            <div className="lg:pl-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {thirdCategory.title}
                  </h2>
                </div>
                {showViewAll && (
                  <Link
                    href={`/category/${thirdCategory.categorySlug}`}
                    className="text-brand-red font-bold text-sm hover:underline"
                  >
                    সব দেখুন &rarr;
                  </Link>
                )}
              </div>
              {/* Check if it's Jobs, then render List of 8. Else default grid. */}
              {thirdCategory.categorySlug === "jobs" ? (
                <SimpleList news={thirdCategory.news.slice(0, 8)} />
              ) : (
                <DualCategoryGrid news={thirdCategory.news.slice(0, 6)} />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Dual category mode - render two categories side by side
  if (dualMode && secondCategory) {
    return (
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* First Category */}
            <div className="lg:pr-8 mb-8 lg:mb-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {title}
                  </h2>
                </div>
                {showViewAll && (
                  <Link
                    href={`/category/${categorySlug}`}
                    className="text-brand-red font-bold text-sm hover:underline"
                  >
                    সব দেখুন &rarr;
                  </Link>
                )}
              </div>
              <DualCategoryGrid news={news.slice(0, 6)} />
            </div>

            {/* Second Category */}
            <div className="lg:pl-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {secondCategory.title}
                  </h2>
                </div>
                {showViewAll && (
                  <Link
                    href={`/category/${secondCategory.categorySlug}`}
                    className="text-brand-red font-bold text-sm hover:underline"
                  >
                    সব দেখুন &rarr;
                  </Link>
                )}
              </div>
              <DualCategoryGrid news={secondCategory.news.slice(0, 6)} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Single category mode - render with variant
  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link
              href={`/category/${categorySlug}`}
              className="text-brand-red font-bold text-sm hover:underline"
            >
              সব দেখুন &rarr;
            </Link>
          )}
        </div>

        {variant === 1 && <Variant1ClassicBento news={news} />}
        {variant === 2 && <Variant2HorizontalSplit news={news} />}
        {variant === 3 && <Variant3DualFocus news={news} />}
        {variant === 4 && <Variant4ListHeavy news={news} />}
        {variant === 5 && <Variant5Zigzag news={news} />}
        {variant === 6 && <Variant6MosaicMix news={news} />}
        {variant === 7 && <Variant7MagazineHero news={news} />}
        {variant === 8 && <Variant8LShape news={news} />}
        {variant === 9 && <Variant9FocusList news={news} />}
        {variant === 10 && <Variant10StandardGrid news={news} />}
        {variant === 11 && <Variant11BorderedGrid news={news} />}
      </div>
    </section>
  );
}

// Dual Category Grid (3x2 compact layout)
// Dual Category Grid (Daily Star Style: Lead + List)
function DualCategoryGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 5) return null;
  const lead = news[0];
  const list = news.slice(1, 5);

  return (
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
  );
}

// Variant 1: Classic Bento (1 big + 4 small)
function Variant1ClassicBento({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const main = news[0];
  const subs = news.slice(1, 5);

  return (
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
  );
}

// Variant 2: Horizontal Split (3+3)
function Variant2HorizontalSplit({ news }: { news: NewsItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
      {news.slice(0, 6).map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={item.image}
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
  );
}

// Variant 3: Dual Focus (2 big + 2 small)
function Variant3DualFocus({ news }: { news: NewsItem[] }) {
  return (
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
          className="md:col-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 md:flex md:items-center md:gap-4 md:p-4"
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
  );
}

// Variant 4: List Heavy (1 big + 5 list)
function Variant4ListHeavy({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const main = news[0];
  const list = news.slice(1, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Big Item */}
      <Link
        href={`/article/${main.id}`}
        className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
          <Image
            src={main.image}
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
                src={item.image}
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
  );
}

// Variant 5: Balanced Mix (1 Square Lead + 2 Stacked + 3 List)
function Variant5Zigzag({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
      {/* Left Column: Lead Item (Square-ish) */}
      <Link
        href={`/article/${news[0].id}`}
        className="lg:col-span-5 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
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
        <div className="p-4 md:p-6">
          <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-2">
            {news[0].title}
          </h2>
          <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm md:text-base mb-4">
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

      {/* Middle Column: 2 Items Stacked */}
      <div className="lg:col-span-3 flex flex-col gap-6 h-full">
        {news.slice(1, 3).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex-1"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Right Column: 3 Items List */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full">
        {news.slice(3, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
          >
            <div className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {item.published_at ? formatBanglaTime(item.published_at) : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Variant 6: Balanced Grid (1 Lead + 1 Top + 3 Bottom) -> REDESIGNED: 1 Lead (Left) + 3 List (Right)
function Variant6MosaicMix({ news }: { news: NewsItem[] }) {
  if (news.length < 4) return null;

  return (
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
  );
}

// Variant 7: Magazine Hero (1 hero + 5 small)
function Variant7MagazineHero({ news }: { news: NewsItem[] }) {
  if (news.length < 2) return null;
  const hero = news[0];
  const subs = news.slice(1, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-6 h-auto">
      {/* Hero Item */}
      <Link
        href={`/article/${hero.id}`}
        className="md:col-span-5 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
          <Image
            src={hero.image}
            alt={hero.title}
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
            {hero.published_at && (
              <p className="text-gray-400 text-xs">
                {formatBanglaDateTime(hero.published_at)}
              </p>
            )}
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
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-3">
            <h3 className="text-gray-900 text-sm font-bold leading-snug line-clamp-3 group-hover:text-brand-red">
              {item.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Variant 8: L-Shape
function Variant8LShape({ news }: { news: NewsItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto">
      {/* Big Item 1 - Top left L part (Span 2x1) */}
      <Link
        href={`/article/${news[0].id}`}
        className="md:col-span-2 md:row-span-1 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
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
        className="md:col-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
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
        className="md:col-span-2 block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 flex flex-col md:flex-row gap-4"
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
  );
}

// Variant 9: Focus List (2 Big Left + 4 List Right)
// Capital Section Redesign
function Variant9FocusList({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
      {/* Col 1: Large Vertical Item */}
      <div className="relative">
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
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-3">
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

      {/* Col 2: Large Vertical Item */}
      <div className="relative">
        <Link
          href={`/article/${news[1].id}`}
          className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300 h-full"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={news[1].image}
              alt={news[1].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm z-10">
              {news[1].category}
            </span>
          </div>
          <div className="p-5 md:p-6">
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-3">
              {news[1].title}
            </h2>
            <p className="text-gray-600 line-clamp-3 text-base mb-4">
              {news[1].summary || "বিস্তারিত..."}
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
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Col 3: List of 4 items */}
      <div className="flex flex-col h-full">
        {news.slice(2, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300 items-center flex-1"
          >
            <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden aspect-video bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Variant 10: Standard Grid (2 Top + 4 Bottom)
// Economy Section Redesign
function Variant10StandardGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: 2 Items (50-50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.slice(0, 2).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
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
            <div className="p-5 md:p-6">
              <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red mb-2">
                {item.title}
              </h2>
              <p className="text-gray-500 line-clamp-3 leading-relaxed text-sm md:text-base mb-4">
                {item.summary || "বিস্তারিত..."}
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
      </div>

      {/* Bottom Row: 4 Items (25-25-25-25) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
        {news.slice(2, 6).map((item, index) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="block bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
          >
            <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-3 bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 pt-0">
              <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug group-hover:text-brand-red line-clamp-2">
                {item.title}
              </h3>
              {item.published_at && (
                <p className="text-gray-400 text-xs mt-2">
                  {formatBanglaDate(item.published_at)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Variant 11: Bordered Grid (Daily Star Style) -> Converted to Card Grid
function Variant11BorderedGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 5) return null;
  const lead = news[0];
  const second = news[1];
  const list = news.slice(2, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Col 1: Main Lead (Span 2) - 50% Width */}
      <div className="lg:col-span-2">
        <Link
          href={`/article/${lead.id}`}
          className="block h-full bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-4 bg-gray-100">
            <Image
              src={lead.image}
              alt={lead.title}
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
      </div>

      {/* Col 2: Secondary Item (Span 1) - 25% Width */}
      <div className="lg:col-span-1">
        <Link
          href={`/article/${second.id}`}
          className="block h-full bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border border-transparent hover:border-red-50 transition-all duration-300"
        >
          <div className="relative aspect-video w-full rounded-t-xl overflow-hidden mb-4 bg-gray-100">
            <Image
              src={second.image}
              alt={second.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 pt-0">
            <h3 className="text-gray-900 text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red transition-colors">
              {second.title}
            </h3>
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
            {item.published_at && (
              <span className="text-gray-400 text-xs mt-1">
                {formatBanglaTime(item.published_at)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Simple List (Just a list of items, no Lead)
function SimpleList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  return (
    <div className="flex flex-col">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="group flex gap-3 items-center p-3 bg-transparent hover:bg-white rounded-xl shadow-none hover:shadow-md border-b border-gray-200 last:border-0 transition-all duration-300"
        >
          <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-gray-900 text-sm font-medium leading-snug group-hover:text-brand-red line-clamp-2">
              {item.title}
            </h3>
            {item.published_at && (
              <span className="text-gray-400 text-xs">
                {formatBanglaTime(item.published_at)}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
