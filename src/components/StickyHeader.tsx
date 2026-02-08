"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import { clsx } from "clsx";
import { generateBlurPlaceholder } from "@/utils/image";

interface StickyHeaderProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
  siteLogo?: string;
  siteName?: string;
}

export default function StickyHeader({ 
  onSearchClick, 
  onMenuClick, 
  siteLogo, 
  siteName 
}: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show compact header when scrolled down past 150px
      if (currentScrollY > 150) {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Scrolling down - hide
        } else {
          setIsVisible(true); // Scrolling up - show
        }
      } else {
        setIsVisible(false); // Near top - hide compact header
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-gray-700" />
        </button>

        {/* Center: Logo */}
        <Link href="/" className="relative h-8 w-32 flex-shrink-0">
          <Image
            src={siteLogo || "/samakal-logo.png"}
            alt={siteName || "Samakal"}
            fill
            sizes="128px"
            className="object-contain"
            placeholder="blur"
            blurDataURL={generateBlurPlaceholder(8, 2)}
          />
        </Link>

        {/* Right: Search Button */}
        <button
          onClick={onSearchClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Search"
        >
          <Search size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
