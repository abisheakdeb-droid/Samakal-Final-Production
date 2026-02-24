"use client";

import { NewsItem } from "@/types/news";
import MostReadWidget from '@/components/MostReadWidget';
import SocialVideoWidget from '@/components/SocialVideoWidget';
import AdSlot from '@/components/AdSlot';
import { NativeAdCompact } from '@/components/NativeAd';
import SocialLinksBar from '@/components/SocialLinksBar';

interface SidebarProps {
  opinionNews: NewsItem[];
  mostReadNews: NewsItem[];
  hideOpinion?: boolean;
}

export default function Sidebar({ opinionNews, mostReadNews, hideOpinion = false }: SidebarProps) {
  return (
    <aside className="space-y-8">

      {/* 0. SOCIAL LINKS - Prominent access */}
      <SocialLinksBar />

      {/* 1. Rectangle Ad - High value position */}
      <div className="mb-8">
        <AdSlot slotId="sidebar-rectangle-sticky" format="rectangle" />
      </div>

      {/* 2. MOST READ WIDGET */}
      <MostReadWidget
        opinionNews={opinionNews}
        mostReadNews={mostReadNews}
        hideOpinion={hideOpinion}
      />

      {/* 3. Native Ad Compact - Blends with content */}
      <NativeAdCompact
        title="সেরা ডিল এখন চলছে - দ্রুত কিনুন"
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200"
        url="#"
        sponsor="ShopBD"
      />

      {/* 4. FACEBOOK LIVE & YOUTUBE */}
      <SocialVideoWidget />

    </aside>
  );
}
