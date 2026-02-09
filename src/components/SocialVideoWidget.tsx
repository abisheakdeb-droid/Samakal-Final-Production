"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, PlayCircle } from 'lucide-react';
import { useVideoPlayer, VideoData } from '@/contexts/VideoPlayerContext';
import { useEffect, useState } from 'react';
import { fetchSettings, SiteSettings } from '@/lib/actions-settings';

export default function SocialVideoWidget() {
  // Safely get video player context - don't crash if provider is missing
  let playVideo: ((video: VideoData) => void) | null = null;
  try {
    const context = useVideoPlayer();
    playVideo = context.playVideo;
  } catch {
    // VideoPlayerProvider not available - videos will open in new tabs
    playVideo = null;
  }
  
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);
  
  // Dynamic FB Data
  const fbUrl = settings?.facebook_live_url || '10153231379946729'; 
  const showFbLive = settings?.facebook_is_live ?? false;

  // Mock YouTube Data (Ideally this would fetch from YT API using settings.youtube_playlist_id)
  const ytVideos = [
    { id: "dQw4w9WgXcQ", title: "সমকাল সন্ধ্যা ৭টার সংবাদ | ২০ জানুয়ারি ২০২৬", thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", duration: "১০:০৫" },
    { id: "3h2mJnvRbZ8", title: "রাজনীতিতে নতুন মোড়: বিশেষ আলোচনা", thumb: "https://img.youtube.com/vi/3h2mJnvRbZ8/mqdefault.jpg", duration: "০৫:৩০" },
    { id: "lx2G8Q-hW9E", title: "খেলার সংবাদ: জয়ে ফিরল বাংলাদেশ", thumb: "https://img.youtube.com/vi/lx2G8Q-hW9E/mqdefault.jpg", duration: "০৩:৪৫" },
    { id: "J---aiyznGQ", title: "বাণিজ্য মেলা জমে উঠেছে", thumb: "https://img.youtube.com/vi/J---aiyznGQ/mqdefault.jpg", duration: "০৪:১২" },
  ];

  const handleVideoClick = (video: typeof ytVideos[0]) => {
    if (!playVideo) {
      // Fallback: open YouTube in new tab if video player not available
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
      return;
    }
    playVideo({
      id: video.id,
      title: video.title,
      source: 'youtube' as const,
      url: video.id,
      thumbnail: video.thumb,
    });
  };

  return (
    <div className="space-y-8">
      
      {/* FACEBOOK LIVE WIDGET - Only show if LIVE is enabled in settings */}
      {showFbLive && (
        <div className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/30 rounded-none overflow-hidden mb-8">
            <div className="bg-[#1877F2] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
                <Facebook size={20} />
                <span>ফেসবুক লাইভ</span>
            </div>
            <Link href="https://facebook.com/samakal" target="_blank" className="text-blue-100 hover:text-white text-xs transition">
                আরও দেখুন →
            </Link>
            </div>
            <div className="p-6 bg-linear-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900">
            {/* Live Stream */}
            <div 
                className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 group cursor-pointer"
                onClick={() => {
                  if (!playVideo) {
                    window.open(`https://www.facebook.com/${fbUrl}`, '_blank');
                    return;
                  }
                  playVideo({
                    id: fbUrl,
                    title: 'সমকাল লাইভ: বিশেষ সংবাদ বুলেটিন',
                    source: 'facebook' as const,
                    url: fbUrl,
                    thumbnail: 'https://images.unsplash.com/photo-1517048430219-bd3cbda4784b?w=600&auto=format&fit=crop'
                  });
                }}
            >
                <Image 
                    src="https://images.unsplash.com/photo-1517048430219-bd3cbda4784b?w=600&auto=format&fit=crop"
                    alt="Facebook Live"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    লাইভ
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">প্রধান সংবাদ - সরাসরি সম্প্রচার</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">১.২ হাজার দর্শক দেখছেন</p>
            </div>
        </div>
      )}

      {/* YOUTUBE VIDEO LIST */}
      <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 rounded-none overflow-hidden">
        <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-2 text-white font-bold">
              <Youtube size={20} />
              <span>ইউটিউব চ্যানেল</span>
           </div>
           <Link href="/video" className="text-red-100 hover:text-white text-xs transition">
              আরও দেখুন →
           </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
           {ytVideos.map((video) => (
              <button
                 key={video.id}
                 onClick={() => handleVideoClick(video)}
                 className="w-full flex gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition group text-left"
              >
                 <div className="relative w-28 aspect-video shrink-0 rounded overflow-hidden bg-gray-900">
                    <Image 
                       src={video.thumb}
                       alt={video.title}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition-colors">
                       <PlayCircle size={28} className="text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                       {video.duration}
                    </span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                       {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">সমকাল টিভি</p>
                 </div>
              </button>
           ))}
        </div>
      </div>
      
    </div>
  );
}
