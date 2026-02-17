import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
// import HeroCard from "@/components/HeroCard"; // Keep Hero static for LCP
import Sidebar from "@/components/Sidebar";
import ScrollReveal from "@/components/ScrollReveal";

import {
  fetchArticlesByCategory,
  fetchMostReadArticles,
  fetchFeaturedArticles,
  getHomepageData,
} from "@/lib/actions-article";
import { fetchVideoArticles, fetchPhotoAlbums } from "@/lib/actions-media";
import { formatBanglaDateTime } from "@/lib/utils";
import SelectedNews from "@/components/SelectedNews";
import CategorySection from "@/components/CategorySection";
import HomeMediaSection from "@/components/HomeMediaSection";
import { NewsItem } from "@/types/news";

// Dynamically Import Heavy / Below-Fold Components
const HeroCard = dynamic(() => import("@/components/HeroCard"));
// Suggest keeping Hero static for LCP, but user requested optimization previously.
// Given strict LCP requirements, static import is better, but dynamic with 'loading' is okay.
// Let's stick to dynamic for now as per previous code, or revert if needed.

const EventSection = dynamic(() => import("@/components/EventSection"), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded my-8"></div>
  ),
});

const AdSlot = dynamic(() => import("@/components/AdSlot"));
const NativeAd = dynamic(() => import("@/components/NativeAd"));

export const dynamicParams = true;
export const revalidate = 60;

export default async function Home() {
  // --- UNIFIED PARALLEL FETCHING STRATEGY ---

  // 1. Fetch Homepage Data (Hero, Sidebar, Feed) - NOW PARALLEL
  const homepagePromise = getHomepageData();

  // 2. Fetch Other Sections in Parallel
  const categories = [
    "বাংলাদেশ", "সারাদেশ", "রাজধানী", "রাজনীতি", "বিশ্ব", "অর্থনীতি",
    "খেলা", "অপরাধ", "লাইফস্টাইল", "প্রযুক্তি", "বিনোদন", "চাকরি"
  ];

  const categoryPromises = categories.map((cat) =>
    fetchArticlesByCategory(cat, cat === "চাকরি" ? 8 : 6, cat !== "চাকরি", undefined)
  );

  const [
    homepageData,
    videoArticles,
    photoAlbums,
    mostReadNews,
    opinionNews,
    featuredArticles,
    ...categoryResults
  ] = await Promise.all([
    homepagePromise,
    fetchVideoArticles(4),
    fetchPhotoAlbums(3),
    fetchMostReadArticles(5),
    fetchArticlesByCategory("মতামত", 5, true),
    fetchFeaturedArticles(10),
    ...categoryPromises
  ]);

  // 3. Destructure & Assign Data
  const { heroArticles, sidebarArticles, latestFeed: _latestFeed } = homepageData;
  const leadNewsFull = heroArticles;
  const categoryData = categoryResults as NewsItem[][];

  // Backfill Logic for Selected News
  let selectedNewsFull = featuredArticles || [];
  if (!selectedNewsFull || selectedNewsFull.length < 10) {
    const existingIds = new Set(selectedNewsFull.map(n => n.id));
    const potentialBackfill = sidebarArticles.filter(n => !existingIds.has(n.id));
    selectedNewsFull = [...selectedNewsFull, ...potentialBackfill].slice(0, 10);
  }

  // Sidebar List Processing
  const listNews = sidebarArticles.slice(0, 8);

  // Fallback Handling
  if (!leadNewsFull || leadNewsFull.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground font-serif">
        <div className="container mx-auto px-4 py-32 text-center text-gray-500">
          <h1 className="text-2xl font-bold">কোন নিউজ খুঁজে পাওয়া যাচ্ছে না</h1>
        </div>
      </main>
    );
  }

  // Slice Hero Data
  const heroNews = leadNewsFull[0];
  const subHeroNews = leadNewsFull.slice(1, 3);
  const gridNews = leadNewsFull.slice(3, 11);

  // Category slug mapping
  const categorySlugMap: Record<string, string> = {
    বাংলাদেশ: "bangladesh", সারাদেশ: "saradesh", রাজধানী: "capital", রাজনীতি: "politics",
    বিশ্ব: "world", অর্থনীতি: "economics", খেলা: "sports", অপরাধ: "crime",
    লাইফস্টাইল: "lifestyle", প্রযুক্তি: "technology", বিনোদন: "entertainment",
    চাকরি: "jobs", মতামত: "opinion",
  };



  return (
    <main className="min-h-screen pb-20 bg-white text-foreground font-serif">
      {/* Recommended for You (Personalized) */}

      {/* Leaderboard Ad - High visibility below header */}
      <div className="container mx-auto px-4 py-4">
        <AdSlot slotId="homepage-leaderboard-top" format="leaderboard" />
      </div>

      {/* --- TOP SECTION (Lead News & Sidebar) --- */}
      <div className="container mx-auto px-4 py-8 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 mb-8">
          {/* MAIN LEAD NEWS (Width 9) - Expanded */}
          <div className="lg:col-span-9 lg:pr-8">
            {/* TOP ROW: Hero (Left) + Sub-leads (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
              {/* 1. HERO NEWS (Span 8) */}
              <div className="md:col-span-8">
                <ScrollReveal direction="up" delay={1}>
                  {heroNews ? <HeroCard news={heroNews} /> : null}
                </ScrollReveal>
              </div>

              {/* 2. SUB-LEADS (Span 4 - Stacked Vertical: 3 Items) */}
              <div className="md:col-span-4 flex flex-col relative">
                {/* Explicit Vertical Divider - Absolute Positioned */}
                <div className="hidden md:block absolute -left-3 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700"></div>

                <div className="flex flex-col h-full gap-4">
                  {/* First Item: Large Vertical Card */}
                  {subHeroNews[0] && (
                    <div className="relative group flex-1">
                      <Link
                        href={`/article/${subHeroNews[0].id}`}
                        className="flex flex-col h-full group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300"
                      >
                        {/* Image Top */}
                        <div className="aspect-video w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <Image
                            src={subHeroNews[0].image}
                            alt={subHeroNews[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                              {subHeroNews[0].category}
                            </span>
                          </div>
                        </div>

                        {/* Content Bottom */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors mb-2">
                            {subHeroNews[0].title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 flex-1">
                            {subHeroNews[0].summary}
                          </p>
                          <div className="text-xs text-gray-400 font-medium mt-auto">
                            {subHeroNews[0].published_at
                              ? formatBanglaDateTime(
                                subHeroNews[0].published_at,
                              )
                              : subHeroNews[0].time}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Second Item: Standard Horizontal Card */}
                  {subHeroNews[1] && (
                    <div className="relative group">
                      <Link
                        href={`/article/${subHeroNews[1].id}`}
                        className="flex gap-4 items-center group bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300"
                      >
                        <div className="w-24 h-20 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={subHeroNews[1].image}
                            alt={subHeroNews[1].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors line-clamp-2">
                            {subHeroNews[1].title}
                          </h3>
                          <div className="mt-2 text-xs text-gray-400 font-medium">
                            {subHeroNews[1].published_at
                              ? formatBanglaDateTime(
                                subHeroNews[1].published_at,
                              )
                              : subHeroNews[1].time}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. GRID SECTION (Below Hero) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 relative">
              {/* Vertical Dividers for 4-col grid */}
              <div className="hidden lg:block absolute left-[calc(25%-0.375rem)] -translate-x-1/2 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
              <div className="hidden lg:block absolute left-[calc(75%+0.375rem)] -translate-x-1/2 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>

              {gridNews.slice(0, 4).map((news) => (
                <div key={news.id} className="group relative">
                  <Link
                    href={`/article/${news.id}`}
                    className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                  >
                    {/* Image Top */}
                    <div className="aspect-video w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {news.category && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            {news.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Bottom */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors mb-2 line-clamp-3">
                        {news.title}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
                        {news.published_at
                          ? formatBanglaDateTime(news.published_at)
                          : news.time}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="w-full h-12"></div>

            {/* 4. LIST VIEW SECTION (3 + 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800 relative">
              {/* Vertical Divider Center */}
              <div className="hidden md:block absolute left-1/2 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-800 -translate-x-1/2"></div>

              {/* Left Column (3 items) */}
              <div className="flex flex-col">
                {gridNews.slice(4, 7).map((news, index) => (
                  <div key={news.id} className="relative">
                    {index > 0 && (
                      <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    )}
                    <Link
                      href={`/article/${news.id}`}
                      className="flex gap-4 items-center group p-4 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-sm"
                    >
                      <div className="w-24 h-16 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                        <div className="mt-1 text-xs text-gray-400">
                          {news.published_at
                            ? formatBanglaDateTime(news.published_at)
                            : news.time}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Right Column (3 items) */}
              <div className="flex flex-col">
                {gridNews.slice(7, 10).map((news, index) => (
                  <div key={news.id} className="relative">
                    {index > 0 && (
                      <div className="mx-4 h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    )}
                    <Link
                      href={`/article/${news.id}`}
                      className="flex gap-4 items-center group p-4 rounded-xl hover:bg-white dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-sm"
                    >
                      <div className="w-24 h-16 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium leading-snug text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                        <div className="mt-1 text-xs text-gray-400">
                          {news.published_at
                            ? formatBanglaDateTime(news.published_at)
                            : news.time}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Native Ad */}
            <div className="mt-8">
              <NativeAd
                title="প্রিমিয়াম স্মার্টফোন অফার - এখনই কিনুন"
                description="সর্বশেষ টেকনোলজি সহ স্মার্টফোন এখন আপনার হাতের মুঠোয়। বিশেষ ছাড় পান।"
                image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
                url="#"
                sponsor="TechMart BD"
              />
            </div>
          </div>

          {/* Column 2: Sidebar / Opinion (Width 3) */}
          <div className="lg:col-span-3 lg:pl-8">
            <ScrollReveal direction="left" delay={2}>
              <Sidebar opinionNews={opinionNews} mostReadNews={mostReadNews} />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* --- EVENT SECTION --- */}
      <EventSection />

      {/* --- SELECTED NEWS SECTION (Nirbachito - Redesigned) --- */}
      <SelectedNews news={selectedNewsFull} latestNews={listNews} />

      {/* --- MULTIMEDIA SECTION --- */}
      <HomeMediaSection videos={videoArticles} photos={photoAlbums} />

      {/* --- ALL CATEGORY SECTIONS (Varied Layouts) --- */}
      <CategorySection
        title={categories[0]}
        categorySlug={categorySlugMap[categories[0]]}
        news={categoryData[0]}
        dualMode
        secondCategory={{
          title: categories[1],
          categorySlug: categorySlugMap[categories[1]],
          news: categoryData[1],
        }}
        thirdCategory={{
          title: categories[2],
          categorySlug: categorySlugMap[categories[2]],
          news: categoryData[2],
        }}
      />

      {/* রাজনীতি + বিশ্ব + অর্থনীতি - TRIPLE MODE Side by Side */}

      <CategorySection
        title={categories[3]}
        categorySlug={categorySlugMap[categories[3]]}
        news={categoryData[3]}
        dualMode // Enable dual/triple layout logic
        secondCategory={{
          title: categories[4],
          categorySlug: categorySlugMap[categories[4]],
          news: categoryData[4],
        }}
        thirdCategory={{
          title: categories[5],
          categorySlug: categorySlugMap[categories[5]],
          news: categoryData[5],
        }}
      />

      {/* খেলা + বিনোদন + চাকরি - TRIPLE MODE Side by Side */}

      <CategorySection
        title={categories[6]}
        categorySlug={categorySlugMap[categories[6]]}
        news={categoryData[6]}
        dualMode
        secondCategory={{
          title: categories[10],
          categorySlug: categorySlugMap[categories[10]],
          news: categoryData[10],
        }}
        thirdCategory={{
          title: categories[11],
          categorySlug: categorySlugMap[categories[11]],
          news: categoryData[11],
        }}
      />

      {/* অপরাধ + লাইফস্টাইল + প্রযুক্তি - TRIPLE MODE Side by Side */}

      <CategorySection
        title={categories[7]}
        categorySlug={categorySlugMap[categories[7]]}
        news={categoryData[7]}
        dualMode
        secondCategory={{
          title: categories[8],
          categorySlug: categorySlugMap[categories[8]],
          news: categoryData[8],
        }}
        thirdCategory={{
          title: categories[9],
          categorySlug: categorySlugMap[categories[9]],
          news: categoryData[9],
        }}
      />
    </main>
  );
}
