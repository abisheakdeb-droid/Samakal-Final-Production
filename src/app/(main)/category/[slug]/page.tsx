import Link from "next/link";
import Image from "next/image";
import LatestSidebarWidget from "@/components/LatestSidebarWidget";
import MostReadWidget from "@/components/MostReadWidget";
import { formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "@/components/NewsActionButtons";
import { clsx } from "clsx";
import {
  getArticles,
  fetchLatestArticles,
  fetchMostReadArticles,
} from "@/lib/actions-article";
import { CATEGORY_MAP } from "@/config/categories";
import { SUB_CATEGORIES } from "@/config/sub-categories";
import SubCategoryNav from "@/components/Category/SubCategoryNav";
import InfiniteLatestNews from "@/components/InfiniteLatestNews";
import ScrollReveal from "@/components/ScrollReveal";

import { getParentCategory } from "@/config/sub-categories";
import SaradeshFilter from "@/components/Category/SaradeshFilter";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "latest";
  const slug = decodeURIComponent(rawSlug);
  const categoryLabel =
    CATEGORY_MAP[slug] || (slug === "latest" ? "সর্বশেষ সংবাদ" : slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com",
    ),
    title: categoryLabel,
    description: `সমকালের ${categoryLabel} বিভাগে পড়ুন দেশ-বিদেশের সর্বশেষ সংবাদ ও বিশ্লেষণ।`,
    openGraph: {
      type: "website",
      title: categoryLabel,
      description: `সমকালের ${categoryLabel} বিভাগে পড়ুন দেশ-বিদেশের সর্বশেষ সংবাদ ও বিশ্লেষণ।`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com"}/category/${slug}`,
      siteName: "Samakal",
      images: [...previousImages],
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

// Helper to check if a slug belongs to Saradesh tree (Saradesh, Division, or District)
const isSaradeshTree = (slug: string) => {
  if (slug === "saradesh") return true;
  if (SUB_CATEGORIES["saradesh"]?.includes(slug)) return true; // Is Division
  // Is District (check if parent is a Division)
  const parent = getParentCategory(slug);
  return parent && SUB_CATEGORIES["saradesh"]?.includes(parent);
};

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "latest";
  const slug = decodeURIComponent(rawSlug);
  const categoryLabel =
    CATEGORY_MAP[slug] || (slug === "latest" ? "সর্বশেষ সংবাদ" : slug);

  // Determine if this is a parent or subcategory
  // const isSubcat = isSubcategory(slug);
  const hasChildren = !!SUB_CATEGORIES[slug]; // e.g. 'dhaka' has children (districts)

  // --- DATA FETCHING ---
  let newsItems = [];

  // Get Bengali category name for database query
  const categoryForQuery = CATEGORY_MAP[slug] || slug;

  if (slug === "latest") {
    newsItems = await fetchLatestArticles(20);
  } else {
    // If it has children (like Dhaka division), we treat it as a Parent Category to fetch aggregated news
    // If it is a subcat but has NO children (like Gazipur), we fetch specific

    newsItems = await getArticles({
      category: categoryForQuery,
      limit: 20
    });
  }

  // Sidebar Data
  const sidebarOpinionRaw = await getArticles({
    category: CATEGORY_MAP["opinion"],
    limit: 10,
  });
  const sidebarOpinion = sidebarOpinionRaw;
  const sidebarLatest = await fetchLatestArticles(10);
  const sidebarMostRead = await fetchMostReadArticles(5);

  // --- LAYOUT LOGIC ---

  // Distribution
  // 1. Big Lead (Index 0)
  // 2. Medium Lead (Index 1-2)
  // 3. Small Grid (Index 3-5)
  // 4. List (Index 6+)

  const primeBig = newsItems[0];
  const primeMedium = newsItems.slice(1, 3);
  const primeSmall = newsItems.slice(3, 6);
  const listNews = newsItems.slice(6);

  return (
    <div className="min-h-screen bg-background text-foreground font-serif">
      {/*
          NAVIGATION LOGIC:
          1. If "Saradesh" tree (Saradesh/Division/District page) -> Show Filter UI
          2. If other parent category (e.g. Sports) -> Show standard SubNav
      */}
      {isSaradeshTree(slug) ? (
        <SaradeshFilter currentSlug={slug} />
      ) : (
        /* Standard SubNav for other categories */
        /* If parent exists, show parent's children (siblings). Else show own children. */
        (getParentCategory(slug)
          ? SUB_CATEGORIES[getParentCategory(slug)!]
          : SUB_CATEGORIES[slug]) && (
          <SubCategoryNav
            subCategories={
              getParentCategory(slug)
                ? SUB_CATEGORIES[getParentCategory(slug)!]
                : SUB_CATEGORIES[slug]
            }
          />
        )
      )}

      <div className="container mx-auto px-4 mt-6 max-w-7xl">
        <Breadcrumb currentSlug={slug} />
      </div>

      {!newsItems || newsItems.length === 0 ? (
        <main className="container mx-auto px-4 py-8 max-w-7xl flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-500">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-newspaper"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 capitalize">
            {categoryLabel}
          </h1>
          <p className="text-lg">এই বিভাগে কোন নিউজ খুঁজে পাওয়া যাচ্ছে না</p>
          <Link
            href="/"
            className="text-brand-red font-medium underline mt-6 block hover:text-red-700 transition"
          >
            হোম পেজে ফিরে যান
          </Link>
        </main>
      ) : (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {categoryLabel}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
            <div className="lg:col-span-9 lg:pr-8">
              {/* Level 1 & 2 */}
              <ScrollReveal>
                <section className="grid grid-cols-1 lg:grid-cols-12 mb-12 border-b border-gray-100 pb-12">
                  <Link
                    href={`/article/${primeBig.id}`}
                    className="lg:col-span-8 group block lg:border-r lg:border-gray-200 lg:pr-8 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-4 text-center">
                      <Image
                        src={primeBig.image || "/samakal-logo.png"}
                        alt={primeBig.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        unoptimized={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-brand-red transition-colors">
                      {primeBig.title}
                    </h1>
                    <p className="text-gray-600 text-lg line-clamp-2 mb-3">
                      {primeBig.summary}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {primeBig.author || "সমকাল প্রতিবেদক"} •{" "}
                        {formatBanglaDateTime(primeBig.publishedAt)}
                      </span>
                      <NewsActionButtons
                        title={primeBig.title}
                        url={`/article/${primeBig.id}`}
                      />
                    </div>
                  </Link>
                  <div className="lg:col-span-4 flex flex-col pl-0 lg:pl-8 mt-6 lg:mt-0">
                    {primeMedium.map((news, idx) => (
                      <Link
                        key={news.id}
                        href={`/article/${news.id}`}
                        className={clsx(
                          "group flex flex-row lg:flex-col gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all",
                          idx === 0 && "border-b border-gray-200 pb-6 mb-6",
                        )}
                      >
                        <div className="w-1/3 lg:w-full aspect-video relative overflow-hidden rounded-lg shrink-0">
                          <Image
                            src={news.image || "/samakal-logo.png"}
                            alt={news.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            unoptimized={true}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="w-2/3 lg:w-full">
                          <h2 className="text-xl font-bold text-gray-800 leading-snug group-hover:text-brand-red mb-2">
                            {news.title}
                          </h2>
                          <div className="text-xs text-gray-400">
                            {formatBanglaDateTime(news.publishedAt)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </ScrollReveal>

              {/* Level 3 */}
              {primeSmall.length > 0 && (
                <ScrollReveal>
                  <section className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-12 mb-12 gap-6 md:gap-0">
                    {primeSmall.map((news, idx) => (
                      <Link
                        key={news.id}
                        href={`/article/${news.id}`}
                        className={clsx(
                          "group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all",
                          idx === 0 && "md:pr-8",
                          idx === 1 && "md:border-l md:border-gray-200 md:px-8",
                          idx === 2 && "md:border-l md:border-gray-200 md:pl-8",
                        )}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                          <Image
                            src={news.image || "/samakal-logo.png"}
                            alt={news.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            unoptimized={true}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 leading-snug group-hover:text-brand-red">
                          {news.title}
                        </h3>
                        <div className="mt-2 text-xs text-gray-400">
                          {formatBanglaDateTime(news.publishedAt)}
                        </div>
                      </Link>
                    ))}
                  </section>
                </ScrollReveal>
              )}

              {/* Level 4: List - Use Infinite Scroll for Latest page */}
              {slug === "latest" ? (
                <InfiniteLatestNews initialNews={listNews} />
              ) : (
                <ScrollReveal>
                  <section className="flex flex-col gap-6">
                    {listNews.map((news) => (
                      <Link
                        key={news.id}
                        href={`/article/${news.id}`}
                        className="group flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 last:border-0 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
                      >
                        <div className="w-full md:w-64 aspect-video md:aspect-4/3 relative overflow-hidden rounded-lg shrink-0">
                          <Image
                            src={news.image || "/samakal-logo.png"}
                            alt={news.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            unoptimized={true}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-brand-red mb-2">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-3 text-sm md:text-base">
                            {news.summary}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatBanglaDateTime(news.publishedAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </section>

                  <div className="mt-12 text-center">
                    <button className="px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-brand-red hover:text-white transition">
                      আরও সংবাদ দেখুন
                    </button>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            {/* Sidebar - Latest News Widget + Ads */}
            <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8">
              <ScrollReveal direction="left">
                <aside className="sticky bottom-4">
                  {slug === "latest" ? (
                    <MostReadWidget
                      opinionNews={sidebarOpinion}
                      mostReadNews={sidebarMostRead}
                    />
                  ) : (
                    <LatestSidebarWidget news={sidebarLatest} />
                  )}

                  {/* Advertisement 1 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center min-h-[250px] mb-6 mt-8">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm font-bold tracking-wider mb-2">
                        বিজ্ঞাপন
                      </p>
                      <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          Ad Space 1
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Advertisement 2 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center min-h-[250px]">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm font-bold tracking-wider mb-2">
                        বিজ্ঞাপন
                      </p>
                      <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          Ad Space 2
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>
              </ScrollReveal>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
