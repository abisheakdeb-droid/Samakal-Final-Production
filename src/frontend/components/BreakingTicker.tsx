import Link from "next/link";
import { Zap } from "lucide-react";
import { fetchSettings } from "@/lib/actions-settings";
import { fetchLatestArticles } from "@/lib/actions-article";

interface BreakingTickerProps {
  customTicker?: string | null;
}

export default async function BreakingTicker({ customTicker }: BreakingTickerProps) {
  // Fetch global settings
  const settings = await fetchSettings();

  // If globally disabled, don't render anything
  if (!settings.breaking_news_is_active) {
    return null;
  }

  // Use DB ticker text if available, otherwise fallback to prop or mock data
  const tickerText = settings.breaking_news_ticker || customTicker;

  // Logic to parse ticker items
  let headlines: string[] = [];
  
  if (tickerText) {
      headlines = tickerText.split('|').map(t => t.trim()).filter(t => t.length > 0);
  } else {
      // Fallback to latest headlines from DB
      const latestNews = await fetchLatestArticles(10);
      headlines = latestNews.map(item => item.title);
  } 

  return (
    <div className="bg-orange-50 border-b border-orange-100 overflow-hidden">
      <div className="container mx-auto flex items-center">
        <div className="bg-brand-red text-white px-4 py-2 font-bold whitespace-nowrap text-sm relative z-20 flex items-center gap-2 shadow-lg">
          <Zap size={16} className="animate-pulse" />
          ব্রেকিং নিউজ
        </div>
        
        {/* Ticker Container - Masked Edges */}
        <div className="relative flex-1 overflow-hidden py-2 mask-linear-fade">
           <div className="flex w-max animate-marquee group">
               {/* Original Set */}
               <div className="flex gap-12 px-4">
                  {headlines.map((headline, idx) => (
                      <Link key={idx} href={`/`} className="text-gray-800 font-medium hover:text-brand-red transition-colors flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                          {headline}
                      </Link>
                  ))}
               </div>
               
               {/* Duplicate Set for Seamless Loop */}
               <div className="flex gap-12 px-4" aria-hidden="true">
                  {headlines.map((headline, idx) => (
                      <Link key={`dup-${idx}`} href={`/`} className="text-gray-800 font-medium hover:text-brand-red transition-colors flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                          {headline}
                      </Link>
                  ))}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

