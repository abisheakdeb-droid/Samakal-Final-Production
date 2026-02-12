"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Clock } from "lucide-react";
import { clsx } from "clsx";

interface VideoItem {
  id: string | number;
  title: string;
  image?: string;
  thumb?: string; // Fallback
  category?: string;
  duration?: string;
  size?: "large" | "medium" | "wide";
}

interface VideoBentoGridProps {
  videos?: VideoItem[];
}

export default function VideoBentoGrid({ videos = [] }: VideoBentoGridProps) {
  // If no sizes are provided, assign them for the bento layout
  const gridVideos = videos.map((v, i) => ({
    ...v,
    size: v.size || (i === 0 ? "large" : i === 3 ? "wide" : "medium"),
  }));

  if (videos.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      {gridVideos.map((video) => (
        <Link
          key={video.id}
          href={`/article/${video.id}`}
          className={clsx(
            "relative group rounded-2xl overflow-hidden border border-white/5",
            video.size === "large" && "md:col-span-2 md:row-span-2",
            video.size === "medium" && "md:col-span-1 md:row-span-1",
            video.size === "wide" && "md:col-span-2 md:row-span-1",
          )}
        >
          {/* Background Image */}
          <Image
            src={video.image || video.thumb || "/placeholder.svg"}
            alt={video.title}
            fill
            sizes={
              video.size === "large"
                ? "(max-width: 1024px) 100vw, 800px"
                : "(max-width: 768px) 100vw, 400px"
            }
            unoptimized={
              video.image?.includes("samakal.com") ||
              video.thumb?.includes("samakal.com")
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Play Icon (Center) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
              <PlayCircle size={32} className="text-white fill-white ml-1" />
            </div>
          </div>

          {/* Content (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {video.category}
              </span>
              <span className="flex items-center gap-1 text-gray-300 text-xs font-medium">
                <Clock size={12} /> {video.duration}
              </span>
            </div>
            <h3
              className={clsx(
                "font-bold text-white leading-tight group-hover:text-red-400 transition-colors",
                video.size === "large" ? "text-2xl md:text-3xl" : "text-lg",
              )}
            >
              {video.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
