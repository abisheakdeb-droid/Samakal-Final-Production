"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Camera, ChevronRight, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { CATEGORY_MAP } from "@/config/categories";

import { NewsItem } from "@/types/news";
import { PhotoAlbum } from "@/lib/actions-media";

interface HomeMediaSectionProps {
  videos: NewsItem[];
  photos: PhotoAlbum[];
}

export default function HomeMediaSection({
  videos,
  photos,
}: HomeMediaSectionProps) {
  if (videos.length === 0 && photos.length === 0) return null;

  return (
    <section className="py-16 bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <PlayCircle size={24} className="text-white fill-white ml-0.5" />
            </div>
            <h2 className="text-3xl font-bold font-serif">মাল্টিমিডিয়া</h2>
          </div>
          <div className="flex gap-4">
            <Link
              href="/video"
              className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold flex items-center gap-2"
            >
              ভিডিও <ChevronRight size={14} />
            </Link>
            <Link
              href="/photo"
              className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold flex items-center gap-2"
            >
              ছবি <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Video (Left) */}
          <div className="lg:col-span-8">
            <ScrollReveal direction="up">
              {videos[0] && (
                <Link
                  href={`/article/${videos[0].slug}`}
                  className="group relative block aspect-video rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={videos[0].image || "/placeholder.svg"}
                    alt={videos[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80" />

                  {/* Big Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 transform group-hover:scale-110 transition-transform">
                      <PlayCircle
                        size={40}
                        className="text-white fill-white ml-1.5"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {CATEGORY_MAP[videos[0].category] || videos[0].category}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-bold leading-tight group-hover:text-red-400 transition-colors">
                      {videos[0].title}
                    </h3>
                  </div>
                </Link>
              )}
            </ScrollReveal>

            {/* Sub Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {videos.slice(1, 4).map((video, i) => (
                <ScrollReveal key={video.id} direction="up" delay={i * 0.1}>
                  <Link href={`/article/${video.slug}`} className="group">
                    <div className="aspect-video relative rounded-xl overflow-hidden mb-3">
                      <Image
                        src={video.image || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle
                          size={32}
                          className="text-white fill-white"
                        />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">
                        <Clock size={8} className="inline mr-1" /> ০২:৩০
                      </span>
                    </div>
                    <h4 className="text-sm font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h4>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Photos Sidebar (Right) */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Camera size={20} className="text-red-500" />
              চিত্রগল্প
            </h3>
            <div className="space-y-8 flex-1">
              {photos.slice(0, 3).map((album, i) => (
                <ScrollReveal key={album.id} direction="left" delay={i * 0.2}>
                  <Link href={`/article/${album.slug}`} className="group block">
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <Image
                        src={album.cover_image || "/placeholder.svg"}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                          {album.images?.length || 0} টি ছবি
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 p-5">
                        <h4 className="text-lg font-bold group-hover:text-red-400 transition-colors line-clamp-2">
                          {album.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
