"use client";

import Link from "next/link";
import { NewsItem } from "@/types/news";
import ScrollReveal from "./ScrollReveal";
import {
  Variant1ClassicBento,
  Variant2HorizontalSplit,
  Variant3DualFocus,
  Variant4ListHeavy,
  Variant5Zigzag,
  Variant6MosaicMix,
  Variant7MagazineHero,
  Variant8LShape,
  Variant9FocusList,
  Variant10StandardGrid,
  Variant11BorderedGrid,
  DualCategoryGrid,
  SimpleList,
} from "./Category/Variants";

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

  // Ensure we have enough items for the variant (Relaxed for Dev: allow fewer items)
  // const minItemsNeeded = ... (Logic removed to allow partial rendering)

  // if (news.length < minItemsNeeded && !dualMode && !thirdCategory) { ... }

  // Triple category mode - render three categories side by side
  if (thirdCategory && secondCategory) {
    return (
      <ScrollReveal>
        <section className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* First Category */}
              <div className="lg:pr-6 mb-8 lg:mb-0">
                <Header
                  title={title}
                  slug={categorySlug}
                  showViewAll={showViewAll}
                />
                <DualCategoryGrid news={news.slice(0, 6)} />
              </div>

              {/* Second Category */}
              <div className="lg:px-6 mb-8 lg:mb-0">
                <Header
                  title={secondCategory.title}
                  slug={secondCategory.categorySlug}
                  showViewAll={showViewAll}
                />
                <DualCategoryGrid news={secondCategory.news.slice(0, 6)} />
              </div>

              {/* Third Category (Jobs - List Style) */}
              <div className="lg:pl-6">
                <Header
                  title={thirdCategory.title}
                  slug={thirdCategory.categorySlug}
                  showViewAll={showViewAll}
                />
                {thirdCategory.categorySlug === "jobs" ? (
                  <SimpleList news={thirdCategory.news.slice(0, 8)} />
                ) : (
                  <DualCategoryGrid news={thirdCategory.news.slice(0, 6)} />
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    );
  }

  // Dual category mode - render two categories side by side
  if (dualMode && secondCategory) {
    return (
      <ScrollReveal>
        <section className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* First Category */}
              <div className="lg:pr-8 mb-8 lg:mb-0">
                <Header
                  title={title}
                  slug={categorySlug}
                  showViewAll={showViewAll}
                />
                <DualCategoryGrid news={news.slice(0, 6)} />
              </div>

              {/* Second Category */}
              <div className="lg:pl-8">
                <Header
                  title={secondCategory.title}
                  slug={secondCategory.categorySlug}
                  showViewAll={showViewAll}
                />
                <DualCategoryGrid news={secondCategory.news.slice(0, 6)} />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    );
  }

  // Single category mode - render with variant
  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <Header title={title} slug={categorySlug} showViewAll={showViewAll} />

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

// Internal Header Helper
function Header({
  title,
  slug,
  showViewAll,
}: {
  title: string;
  slug: string;
  showViewAll: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
      </div>
      {showViewAll && (
        <Link
          href={`/category/${slug}`}
          className="text-brand-red font-bold text-sm hover:underline"
        >
          সব দেখুন &rarr;
        </Link>
      )}
    </div>
  );
}
