"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { generateBlurPlaceholder } from "@/utils/image";
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
    navigator.clipboard.writeText(
      window.location.origin + "/article/" + news.id,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link
      href={`/article/${news.id}`}
      className="group cursor-pointer block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4 bg-gray-100">
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
          <span className="bg-brand-red text-white px-3 py-1 text-sm font-bold rounded">
            {news.category}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-red transition-colors">
          {news.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 md:line-clamp-none">
          {news.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {news.author}
            </span>
            <span>•</span>
            <span>{news.time}</span>
          </div>

          <div className="relative">
            <button
              onClick={handleShare}
              className={clsx(
                "p-2 rounded-full transition-all duration-300 relative z-20 hover:scale-110 active:scale-95",
                copied
                  ? "bg-green-100 text-green-600"
                  : "text-gray-400 hover:text-gray-800 hover:bg-gray-100",
              )}
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>

            {/* Tooltip */}
            <div
              className={clsx(
                "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow transition-opacity duration-300 pointer-events-none whitespace-nowrap",
                copied ? "opacity-100" : "opacity-0",
              )}
            >
              কপি হয়েছে!
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
