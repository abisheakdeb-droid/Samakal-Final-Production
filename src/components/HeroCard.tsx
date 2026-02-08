"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { generateBlurPlaceholder, unsplashLoader } from "@/utils/image";
import { NewsItem } from "@/types/news";

interface HeroCardProps {
  news: NewsItem;
}

export default function HeroCard({ news }: HeroCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Simulate copy
    navigator.clipboard.writeText(window.location.origin + "/article/" + news.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/article/${news.id}`} className="group cursor-pointer block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
        <Image 
          src={news.image} 
          alt={news.title}
          fill
          priority
          placeholder="blur"
          blurDataURL={generateBlurPlaceholder(16, 9)}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-brand-red text-white px-3 py-1 rounded text-sm font-bold shadow-sm">
            {news.category}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-brand-red transition-colors">
          {news.title}
        </h1>
        <p className="text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{news.author}</span>
            <span>•</span>
            <span>{news.time}</span>
          </div>
          
          <div className="relative">
             <button 
                onClick={handleShare}
                className={clsx(
                    "p-2 rounded-full transition relative z-20",
                    copied ? "bg-green-100 text-green-600" : "text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                )}
             >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
             </button>
             
             {/* Tooltip */}
             <div className={clsx(
                 "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow transition-opacity duration-300 pointer-events-none whitespace-nowrap",
                 copied ? "opacity-100" : "opacity-0"
             )}>
                 কপি হয়েছে!
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

