"use client";

import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  slotId: string;
  format?: 'banner' | 'rectangle' | 'leaderboard' | 'native';
  className?: string;
}

/**
 * Google AdSense placeholder component
 * Replace with actual AdSense script when you have publisher ID
 */
export default function AdSlot({ slotId, format = 'rectangle', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load ads only when visible (performance optimization)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Get dimensions based on format
  const getDimensions = () => {
    switch (format) {
      case 'banner':
        return 'h-[90px] md:h-[120px]'; // 728x90 or 970x90
      case 'leaderboard':
        return 'h-[90px]'; // 728x90
      case 'native':
        return 'h-auto'; // Dynamic height
      case 'rectangle':
      default:
        return 'h-[250px] md:h-[280px]'; // 300x250 or 336x280
    }
  };

  return (
    <div
      ref={adRef}
      className={`ad-slot ${getDimensions()} bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm flex items-center justify-center ${className}`}
      data-ad-slot={slotId}
      data-ad-format={format}
    >
      {isVisible ? (
        <div className="text-center p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">বিজ্ঞাপন</p>
          {/* Google AdSense code will go here */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ad Slot: {slotId}
            <br />
            <span className="text-xs">({format})</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 dark:text-gray-500 text-sm">Loading ad...</div>
      )}
    </div>
  );
}
