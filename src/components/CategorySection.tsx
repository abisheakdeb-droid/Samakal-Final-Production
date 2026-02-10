"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";
import {
  formatBanglaDate,
  formatBanglaDateTime,
  formatBanglaTime,
} from "@/lib/utils";

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
      <section className="bg-white py-12 border-b border-gray-200">
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
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* First Category */}
            <div>
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
            <div className="lg:border-l border-gray-200 lg:pl-8">
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
            <div className="lg:border-l border-gray-200 lg:pl-8">
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
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First Category */}
            <div>
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
            <div className="lg:border-l border-gray-200 lg:pl-8">
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
    <section className="bg-white py-12 border-b border-gray-200">
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
        className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={lead.image}
            alt={lead.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-4">
          <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-brand-red transition-colors">
            {lead.title}
          </h2>
          {lead.published_at && (
            <p className="text-gray-500 text-xs">
              {formatBanglaDateTime(lead.published_at)}
            </p>
          )}
        </div>
      </Link>

      {/* List Items */}
      <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
        {list.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 items-start p-2 rounded-lg hover:bg-red-50 transition-all border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="relative w-24 aspect-video shrink-0 rounded overflow-hidden">
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
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
      {/* Main Item */}
      <Link
        href={`/article/${main.id}`}
        className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={main.image}
          alt={main.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
          <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
            {main.category}
          </span>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red transition-colors">
            {main.title}
          </h2>
        </div>
      </Link>

      {/* Sub Items */}
      {subs.map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-2 md:p-3 flex flex-col justify-end">
            <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
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
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
      {news.slice(0, 6).map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
              {item.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Variant 3: Dual Focus (2 big + 2 small)
function Variant3DualFocus({ news }: { news: NewsItem[] }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
      {news.slice(0, 2).map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="row-span-2 relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 md:p-6 flex flex-col justify-end">
            <h3 className="text-white text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red">
              {item.title}
            </h3>
          </div>
        </Link>
      ))}
      {news.slice(2, 4).map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
            <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
              {item.title}
            </h3>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
      {/* Big Item */}
      <Link
        href={`/article/${main.id}`}
        className="relative rounded-lg overflow-hidden group h-[300px] lg:h-full"
      >
        <Image
          src={main.image}
          alt={main.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
            {main.title}
          </h2>
        </div>
      </Link>

      {/* List Items */}
      <div className="flex flex-col gap-4">
        {list.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-4 p-2 rounded-lg hover:bg-red-50 transition-all"
          >
            <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
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

// Variant 5: Balanced Mix (1 Square Lead + 2 Stacked + 3 List)
function Variant5Zigzag({ news }: { news: NewsItem[] }) {
  if (news.length < 6) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[450px]">
      {/* Left Column: Lead Item (Square-ish) */}
      <Link
        href={`/article/${news[0].id}`}
        className="lg:col-span-5 relative rounded-lg overflow-hidden group h-[300px] lg:h-full"
      >
        <Image
          src={news[0].image}
          alt={news[0].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
          <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
            {news[0].category}
          </span>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
            {news[0].title}
          </h2>
        </div>
      </Link>

      {/* Middle Column: 2 Items Stacked */}
      <div className="lg:col-span-3 flex flex-col gap-6 h-full">
        {news.slice(1, 3).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="relative flex-1 rounded-lg overflow-hidden group min-h-[140px]"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Right Column: 3 Items List */}
      <div className="lg:col-span-4 flex flex-col justify-between h-full gap-4 lg:gap-0">
        {news.slice(3, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-4 p-2 rounded-lg hover:bg-red-50 transition-all h-[30%] items-center"
          >
            <div className="relative w-24 h-full shrink-0 rounded overflow-hidden">
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
              <p className="text-xs text-gray-500 mt-1">
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[400px]">
      {/* Left Column: Lead Item (66%) */}
      <div className="lg:col-span-8 relative lg:border-r border-gray-200 lg:pr-6">
        <Link
          href={`/article/${news[0].id}`}
          className="relative block rounded-lg overflow-hidden group min-h-[300px] lg:h-full"
        >
          <Image
            src={news[0].image}
            alt={news[0].title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
            <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
              {news[0].category}
            </span>
            <h2 className="text-white text-xl md:text-3xl font-bold leading-tight group-hover:text-brand-red">
              {news[0].title}
            </h2>
          </div>
        </Link>
      </div>

      {/* Right Column: List of 3 Items (33%) */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-4 h-full pl-0 lg:pl-2">
        {news.slice(1, 4).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 p-2 rounded-lg hover:bg-red-50 transition-all items-center flex-1 border-b border-gray-100 last:border-0"
          >
            <div className="relative w-24 h-full shrink-0 rounded overflow-hidden aspect-video">
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
    <div className="grid grid-cols-5 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
      {/* Hero Item */}
      <Link
        href={`/article/${hero.id}`}
        className="col-span-5 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
            {hero.title}
          </h2>
        </div>
      </Link>

      {/* Sub Items */}
      {subs.map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-end">
            <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
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
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[500px] md:h-[600px]">
      {/* Big Item 1 - Top left L part */}
      <Link
        href={`/article/${news[0].id}`}
        className="col-span-2 row-span-1 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={news[0].image}
          alt={news[0].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-white text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red">
            {news[0].title}
          </h3>
        </div>
      </Link>

      {/* Item 3 - Top right */}
      <Link
        href={`/article/${news[2].id}`}
        className="col-span-2 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={news[2].image}
          alt={news[2].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
          <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
            {news[2].title}
          </h3>
        </div>
      </Link>

      {/* Big Item 2 - Middle left L part */}
      <Link
        href={`/article/${news[1].id}`}
        className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={news[1].image}
          alt={news[1].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-4 md:p-6 flex flex-col justify-end">
          <h3 className="text-white text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red">
            {news[1].title}
          </h3>
        </div>
      </Link>

      {/* Item 4 - Middle right */}
      <Link
        href={`/article/${news[3].id}`}
        className="col-span-2 relative rounded-lg overflow-hidden group"
      >
        <Image
          src={news[3].image}
          alt={news[3].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
          <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
            {news[3].title}
          </h3>
        </div>
      </Link>

      {/* Items 5 & 6 - Bottom row */}
      {news.slice(4, 6).map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="col-span-2 relative rounded-lg overflow-hidden group"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
            <h3 className="text-white text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand-red">
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
      {/* Col 1: Large Vertical Item */}
      <div className="relative lg:border-r border-gray-200 lg:pr-6">
        <Link
          href={`/article/${news[0].id}`}
          className="block relative rounded-lg overflow-hidden group min-h-[300px] lg:h-full"
        >
          <Image
            src={news[0].image}
            alt={news[0].title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
            <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
              {news[0].category}
            </span>
            <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
              {news[0].title}
            </h2>
          </div>
        </Link>
      </div>

      {/* Col 2: Large Vertical Item */}
      <div className="relative lg:border-r border-gray-200 lg:pr-6">
        <Link
          href={`/article/${news[1].id}`}
          className="block relative rounded-lg overflow-hidden group min-h-[300px] lg:h-full"
        >
          <Image
            src={news[1].image}
            alt={news[1].title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
            <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
              {news[1].category}
            </span>
            <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
              {news[1].title}
            </h2>
          </div>
        </Link>
      </div>

      {/* Col 3: List of 4 items */}
      <div className="flex flex-col gap-3 h-full overflow-y-auto pl-0 lg:pl-2">
        {news.slice(2, 6).map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex gap-3 p-2 rounded-lg hover:bg-red-50 transition-all items-center flex-1 border-b border-gray-100 last:border-0"
          >
            <div className="relative w-24 h-full shrink-0 rounded overflow-hidden aspect-video">
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
            className="relative rounded-lg overflow-hidden group min-h-[250px] md:h-[350px]"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
                {item.category}
              </span>
              <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-red">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Row: 4 Items (25-25-25-25) with Vertical Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-200 pt-6">
        {news.slice(2, 6).map((item, index) => (
          <div
            key={item.id}
            className={`relative ${index < 3 ? "md:border-r border-gray-200 md:pr-4" : ""}`}
          >
            <Link
              href={`/article/${item.id}`}
              className="group block p-2 rounded-lg hover:bg-red-50 transition-all h-full"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-gray-900 text-sm md:text-base font-bold leading-snug group-hover:text-brand-red line-clamp-2">
                {item.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// Variant 11: Bordered Grid (Daily Star Style)
// Features: Vertical Dividers, Strict Alignment, 3-Column Layout
function Variant11BorderedGrid({ news }: { news: NewsItem[] }) {
  if (news.length < 5) return null;
  const lead = news[0];
  const second = news[1];
  const list = news.slice(2, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto border-t border-gray-100 pt-6">
      {/* Col 1: Main Lead (Span 2) - 50% Width */}
      <div className="lg:col-span-2 relative pr-0 lg:pr-6 lg:border-r border-gray-200 group">
        <Link href={`/article/${lead.id}`} className="h-full flex flex-col">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col grow">
            <span className="text-brand-red text-sm font-bold mb-2 block">
              {lead.category}
            </span>
            <h2 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-brand-red transition-colors">
              {lead.title}
            </h2>
            <p className="text-gray-600 text-base line-clamp-3 leading-relaxed hidden md:block">
              {lead.summary || lead.title}
            </p>
          </div>
        </Link>
      </div>

      {/* Col 2: Secondary Item (Span 1) - 25% Width */}
      <div className="lg:col-span-1 relative pr-0 lg:pr-6 lg:border-r border-gray-200 group">
        <Link href={`/article/${second.id}`} className="h-full flex flex-col">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={second.image}
              alt={second.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h3 className="text-gray-900 text-lg md:text-xl font-bold leading-tight group-hover:text-brand-red transition-colors">
            {second.title}
          </h3>
        </Link>
      </div>

      {/* Col 3: List (Span 1) - 25% Width */}
      <div className="lg:col-span-1 flex flex-col gap-4 pl-0 lg:pl-2">
        {list.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="group flex flex-col p-2 rounded-lg hover:bg-red-50 transition-all border-b border-gray-100 last:border-0"
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
    <div className="flex flex-col gap-2">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/article/${item.id}`}
          className="group flex gap-2 items-center p-2 rounded-lg hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0"
        >
          <div className="relative w-20 h-16 shrink-0 rounded overflow-hidden">
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
