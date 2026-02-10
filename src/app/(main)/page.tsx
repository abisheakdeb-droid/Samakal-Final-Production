import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import LatestSidebarWidget from "@/components/LatestSidebarWidget";
// import HeroCard from "@/components/HeroCard"; // Keep Hero static for LCP
import Sidebar from "@/components/Sidebar";
import ScrollReveal from "@/components/ScrollReveal";
import { StaggerWrapper, StaggerItem } from "@/components/StaggerWrapper";

import {
  fetchLatestArticles,
  fetchArticlesByCategory,
  fetchMostReadArticles,
  fetchFeaturedArticles,
} from "@/lib/actions-article";
import SelectedNews from "@/components/SelectedNews";
import CategorySection from "@/components/CategorySection";

// Dynamically Import Heavy / Below-Fold Components
const HeroCard = dynamic(() => import("@/components/HeroCard")); // Actually, keep Hero dynamic if data fetch allows, but usually static is better for LCP. Let's keep Hero static? User requested Optimization. Let's keep Hero static for LCP, but others dynamic.
// Wait, `HeroCard` is above fold. Keep static.
// `Sidebar` is partly above fold. Keep static.
// `LatestSidebarWidget` is above fold. Keep static.

const EventSection = dynamic(() => import("@/components/EventSection"), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded my-8"></div>
  ),
});

const AdSlot = dynamic(() => import("@/components/AdSlot"));
const NativeAd = dynamic(() => import("@/components/NativeAd"));

export const dynamicParams = true; // Use valid Next.js segment config
export const revalidate = 60;

export default async function Home() {
  // Fetch all core data in parallel to reduce waterfall latency
  // Category names in navigation order
  const categories = [
    "বাংলাদেশ",
    "সারাদেশ",
    "রাজধানী",
    "রাজনীতি",
    "বিশ্ব",
    "অর্থনীতি",
    "খেলা",
    "অপরাধ",
    "বিনোদন",
    "চাকরি",
  ];

  const [
    leadNewsFull,
    selectedNewsInitial,
    opinionNews,
    mostReadNews,
    ...categoryData
  ] = await Promise.all([
    fetchLatestArticles(20),
    fetchFeaturedArticles(10),
    fetchArticlesByCategory("মতামত", 5, true),
    fetchMostReadArticles(5),
    ...categories.map((cat) =>
      fetchArticlesByCategory(cat, cat === "চাকরি" ? 8 : 6, cat !== "চাকরি"),
    ), // Fetch aggregated (true) except for Jobs (false)
  ]);

  // Fallback to empty if DB is empty
  if (!leadNewsFull || leadNewsFull.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground font-serif">
        <div className="container mx-auto px-4 py-32 text-center text-gray-500">
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
          <h1 className="text-2xl font-bold">কোন নিউজ খুঁজে পাওয়া যাচ্ছে না</h1>
        </div>
      </main>
    );
  }

  const heroNews = leadNewsFull[0]; // Big Item
  const subHeroNews = leadNewsFull.slice(1, 3); // 2 Medium Items
  const gridNews = leadNewsFull.slice(3, 12); // 9 Small Items (3x3)

  // Sidebar List - Try to get unique items (12+), but fallback to latest if not enough data
  let listNews = leadNewsFull.slice(12, 20);
  if (listNews.length < 5) {
    listNews = leadNewsFull.slice(0, 10);
  }

  // Category slug mapping
  const categorySlugMap: Record<string, string> = {
    বাংলাদেশ: "bangladesh",
    সারাদেশ: "saradesh",
    রাজধানী: "capital",
    রাজনীতি: "politics",
    বিশ্ব: "world",
    অর্থনীতি: "economics",
    খেলা: "sports",
    অপরাধ: "crime",
    বিনোদন: "entertainment",
    চাকরি: "jobs",
  };

  // 2. SELECTED NEWS (Featured/Prime) logic
  let selectedNewsFull = selectedNewsInitial;

  // Backfill Logic: Ensure we have 10 items for the Bento+List layout
  if (!selectedNewsFull || selectedNewsFull.length < 10) {
    const currentItems = selectedNewsFull || [];
    const existingIds = new Set(currentItems.map((n) => n.id));

    // 1. Fill from Bangladesh Category
    const fromBangladesh = categoryData[0].filter(
      (n: { id: string }) => !existingIds.has(n.id),
    );
    let combined = [...currentItems, ...fromBangladesh];

    // 2. If still not enough, fill from Latest
    if (combined.length < 10) {
      const existingIds2 = new Set(combined.map((n) => n.id));
      const fromLatest = leadNewsFull.filter((n) => !existingIds2.has(n.id));
      combined = [...combined, ...fromLatest];
    }

    selectedNewsFull = combined.slice(0, 10);
  }

  // const selectedMain = selectedNewsFull[0]; // Not needed, component handles splitting
  // const selectedSide = selectedNewsFull.slice(1, 5);

  return (
    <main className="min-h-screen pb-20 bg-white text-foreground font-serif">
      {/* Recommended for You (Personalized) */}

      {/* Leaderboard Ad - High visibility below header */}
      <div className="container mx-auto px-4 py-4">
        <AdSlot slotId="homepage-leaderboard-top" format="leaderboard" />
      </div>

      {/* --- TOP SECTION (Lead News & Sidebar) --- */}
      <div className="container mx-auto px-4 py-8 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-x-0 lg:divide-x divide-gray-200 mb-8">
          {/* Column 1: Latest News List (Width 3) */}
          <div className="lg:col-span-3 lg:pr-6 order-2 lg:order-1">
            <ScrollReveal direction="right" delay={2}>
              <LatestSidebarWidget news={listNews} />
            </ScrollReveal>
          </div>

          {/* Column 2: MAIN LEAD NEWS (Width 6) - 12 Items Total */}
          <div className="lg:col-span-6 lg:px-6 order-1 lg:order-2">
            {/* A. Hero */}
            {/* A. Hero */}
            <ScrollReveal direction="up" delay={1}>
              {heroNews ? <HeroCard news={heroNews} /> : null}
            </ScrollReveal>

            {/* B. Sub-Hero (Staggered Grid) */}
            <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pb-8 border-b border-gray-200">
              {subHeroNews.map((news) => (
                <StaggerItem key={news.id}>
                  <Link
                    href={`/article/${news.id}`}
                    className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
                  >
                    <div className="aspect-video relative bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xl font-bold leading-snug group-hover:text-brand-red transition-colors">
                      {news.title}
                    </h3>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerWrapper>

            {/* C. 3x3 Grid (Staggered) */}
            <StaggerWrapper className="grid grid-cols-3 gap-x-4 gap-y-6 mt-8">
              {/* Native Ad after 4th article */}
              <StaggerItem className="col-span-3">
                <NativeAd
                  title="প্রিমিয়াম স্মার্টফোন অফার - এখনই কিনুন"
                  description="সর্বশেষ টেকনোলজি সহ স্মার্টফোন এখন আপনার হাতের মুঠোয়। বিশেষ ছাড় পান।"
                  image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
                  url="#"
                  sponsor="TechMart BD"
                />
              </StaggerItem>
              {gridNews.map((news) => (
                <StaggerItem key={news.id}>
                  <Link
                    href={`/article/${news.id}`}
                    className="group block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
                  >
                    <div className="aspect-video relative bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-sm font-bold leading-tight group-hover:text-brand-red line-clamp-3">
                      {news.title}
                    </h4>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerWrapper>
          </div>

          {/* Column 3: Sidebar / Opinion (Width 3) */}
          <div className="lg:col-span-3 lg:pl-6 order-3">
            <ScrollReveal direction="left" delay={2}>
              <Sidebar opinionNews={opinionNews} mostReadNews={mostReadNews} />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* --- EVENT SECTION --- */}
      <EventSection />

      {/* --- SELECTED NEWS SECTION (Nirbachito - Redesigned) --- */}
      <SelectedNews news={selectedNewsFull} />

      {/* --- ALL CATEGORY SECTIONS (Varied Layouts) --- */}
      {/* বাংলাদেশ + রাজধানী - DUAL MODE Side by Side */}
      <CategorySection
        title={categories[0]}
        categorySlug={categorySlugMap[categories[0]]}
        news={categoryData[0]}
        dualMode
        secondCategory={{
          title: categories[2],
          categorySlug: categorySlugMap[categories[2]],
          news: categoryData[2],
        }}
      />

      {/* সারাদেশ - Variant 2: Horizontal Split */}
      <CategorySection
        title={categories[1]}
        categorySlug={categorySlugMap[categories[1]]}
        news={categoryData[1]}
        variant={2}
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

      {/* অপরাধ - Variant 8: L-Shape */}
      <CategorySection
        title={categories[7]}
        categorySlug={categorySlugMap[categories[7]]}
        news={categoryData[7]}
        variant={8}
      />
    </main>
  );
}
