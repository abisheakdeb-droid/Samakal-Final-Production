

import { Suspense } from "react";
import ArticleCardSkeleton from "@/components/skeletons/ArticleCardSkeleton";
import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
import LatestSidebarWidget from "@/components/LatestSidebarWidget";
// import HeroCard from "@/components/HeroCard"; // Keep Hero static for LCP
import Sidebar from "@/components/Sidebar"; 
import ScrollReveal from "@/components/ScrollReveal"; 
import { StaggerWrapper, StaggerItem } from "@/components/StaggerWrapper"; 
import { CATEGORY_MAP, PARENT_CATEGORIES } from "@/config/categories"; 
// import AdSlot from "@/components/AdSlot";
// import NativeAd from "@/components/NativeAd"; 
// import EventSection from "@/components/EventSection";
import { fetchLatestArticles, fetchArticlesByCategory, fetchMostReadArticles, fetchFeaturedArticles } from "@/lib/actions-article";
import RecommendedFeed from "@/components/RecommendedFeed";
// import CategorySection from "@/components/CategorySection";

// Dynamically Import Heavy / Below-Fold Components
const HeroCard = dynamic(() => import("@/components/HeroCard")); // Actually, keep Hero dynamic if data fetch allows, but usually static is better for LCP. Let's keep Hero static? User requested Optimization. Let's keep Hero static for LCP, but others dynamic.
// Wait, `HeroCard` is above fold. Keep static.
// `Sidebar` is partly above fold. Keep static.
// `LatestSidebarWidget` is above fold. Keep static.

const EventSection = dynamic(() => import("@/components/EventSection"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded my-8"></div>
});

const CategorySection = dynamic(() => import("@/components/CategorySection"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded mb-8"></div>
});

const AdSlot = dynamic(() => import("@/components/AdSlot"));
const NativeAd = dynamic(() => import("@/components/NativeAd"));

export const dynamicParams = true; // Use valid Next.js segment config
export const revalidate = 60; 

export default async function Home() {
  // Fetch all core data in parallel to reduce waterfall latency
  const [
    leadNewsFull,
    selectedNewsInitial,
    opinionNews,
    mostReadNews
  ] = await Promise.all([
    fetchLatestArticles(20),
    fetchFeaturedArticles(5),
    fetchArticlesByCategory("মতামত", 5),
    fetchMostReadArticles(5)
  ]);
  
  // Fallback to empty if DB is empty
  if (!leadNewsFull || leadNewsFull.length === 0) {
      return (
      <main className="min-h-screen bg-background text-foreground font-serif">
            <div className="container mx-auto px-4 py-32 text-center text-gray-500">
                <div className="flex justify-center mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                      <path d="M18 14h-8"/>
                      <path d="M15 18h-5"/>
                      <path d="M10 6h8v4h-8V6Z"/>
                  </svg>
                </div>
              <h1 className="text-2xl font-bold">কোন নিউজ খুঁজে পাওয়া যাচ্ছে না</h1>
          </div>
      </main>
      );
  }

  const heroNews = leadNewsFull[0];      // Big Item
  const subHeroNews = leadNewsFull.slice(1, 3); // 2 Medium Items
  const gridNews = leadNewsFull.slice(3, 12);   // 9 Small Items (3x3)
  
  // Sidebar List - Try to get unique items (12+), but fallback to latest if not enough data
  let listNews = leadNewsFull.slice(12, 20);
  if (listNews.length < 5) {
      listNews = leadNewsFull.slice(0, 10);
  }

  // 2. SELECTED NEWS (Featured/Prime) logic
  let selectedNewsFull = selectedNewsInitial;

  // Fallback: If no featured news, use "Bangladesh" category or generic latest
  if (!selectedNewsFull || selectedNewsFull.length === 0) {
      selectedNewsFull = await fetchArticlesByCategory("বাংলাদেশ", 5);
      if (!selectedNewsFull || selectedNewsFull.length === 0) {
           selectedNewsFull = leadNewsFull.slice(0, 5); // Ultimate fallback
      }
  }

  const selectedMain = selectedNewsFull[0];
  const selectedSide = selectedNewsFull.slice(1, 5);

  // 3. CATEGORY SECTIONS - Only Parent Categories
  const categoriesToFetch = PARENT_CATEGORIES.filter(k => 
      k !== "latest" && k !== "politics" && k !== "bangladesh" && k !== "opinion"
  );

  const categorySections = await Promise.all(categoriesToFetch.map(async (slug) => {
      const bengaliCategory = CATEGORY_MAP[slug];
      const catNews = await fetchArticlesByCategory(bengaliCategory, 6, true);
      
      return {
        slug,
        label: CATEGORY_MAP[slug],
        news: catNews
      };
  }));

  // Filter out sections with no news
  const validCategorySections = categorySections.filter(s => s.news.length > 0);


  return (
    <main className="min-h-screen pb-20 bg-background text-foreground font-serif">
      
      {/* Recommended for You (Personalized) */}
      <Suspense fallback={
         <div className="w-full bg-linear-to-r from-red-50 to-white border-y border-red-100 py-6 mb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <ArticleCardSkeleton count={4} />
            </div>
         </div>
      }>
        <RecommendedFeed />
      </Suspense>
      
      {/* Leaderboard Ad - High visibility below header */}
      <div className="container mx-auto px-4 py-4">
        <AdSlot slotId="homepage-leaderboard-top" format="leaderboard" />
      </div>

      {/* --- TOP SECTION (Lead News & Sidebar) --- */}
      <div className="container mx-auto px-4 py-8 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-x-0 lg:divide-x divide-gray-100 mb-8">
          
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
                {heroNews ? (
                     <HeroCard news={heroNews} /> 
                ) : null}
            </ScrollReveal>
            
            {/* B. Sub-Hero (Staggered Grid) */}
            <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pb-8 border-b border-gray-100">
               {subHeroNews.map((news) => (
                 <StaggerItem key={news.id}>
                    <Link href={`/article/${news.id}`} className="group block">
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
                        <Link href={`/article/${news.id}`} className="group block">
                            <div className="aspect-video relative bg-gray-100 rounded mb-2 overflow-hidden">
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

      {/* --- SELECTED NEWS SECTION (Nirbachito) --- */}
      <section className="bg-gray-50 py-12 border-y border-gray-200 mb-12">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
                <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
                <h2 className="text-3xl font-bold text-gray-900">নির্বাচিত খবর</h2>
            </div>
            <div className="flex justify-end -mt-10 mb-8">
               <Link href="/category/bangladesh" className="text-brand-red font-bold text-sm hover:underline">
                    সব দেখুন &rarr;
               </Link>
            </div>


            
            {selectedMain && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1 Big Item (Left) */}
                {/* 1 Big Item (Left) */}
                <div className="lg:col-span-5 relative group">
                    <Link href={`/article/${selectedMain.id}`}>
                        <div className="aspect-video relative overflow-hidden rounded-xl mb-4">
                            <Image src={selectedMain.image} alt={selectedMain.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700"/>
                             {(selectedMain.is_featured || selectedMain.is_prime) && (
                                <div className="absolute top-4 left-4 bg-brand-red text-white text-xs px-2 py-1 rounded">কিউরেটেড</div>
                             )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-brand-red transition-colors">
                            {selectedMain.title}
                        </h1>
                        <p className="text-gray-600 text-lg line-clamp-3">{selectedMain.summary}</p>
                    </Link>
                </div>

                {/* Vertical Divider (Hidden on mobile) */}
                <div className="hidden lg:block w-px bg-gray-300 mx-auto"></div>

                {/* 4 Items Grid (Right) */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200 md:border-none">
                     {selectedSide.map((news, idx) => (
                         <Link href={`/article/${news.id}`} key={news.id} className={clsx(
                             "group block p-4 border-b border-gray-200",
                             // Add right border to odd items (0, 2) on Desktop
                             idx % 2 === 0 ? "md:border-r" : ""
                         )}>
                             <div className="aspect-video relative overflow-hidden rounded mb-3">
                                 <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                             </div>
                             <h3 className="text-lg font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                                 {news.title}
                             </h3>
                         </Link>
                     ))}
                </div>
            </div>
            )}

            {!selectedMain && <div className="text-center text-gray-500 py-12">No selected news available.</div>} 
         </div>
      </section>

       {/* --- CATEGORY ROUNDUP (Redesigned) --- */}
       <div className="container mx-auto px-4 space-y-4">
             {validCategorySections.map((section, index) => (
               <div key={section.slug} className="space-y-4">
                  <CategorySection 
                    label={section.label}
                    slug={section.slug}
                    news={section.news}
                  />
                  {/* Advertisement every 3 sections */}
                  {(index + 1) % 3 === 0 && index !== validCategorySections.length - 1 && (
                      <div className="py-6 flex justify-center">
                          <AdSlot slotId={`home-intercategory-${index}`} format="leaderboard" />
                      </div>
                  )}
               </div>
           ))}
       </div>
      </main>
    );
  }
