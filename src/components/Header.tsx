"use client";

import { Search, Menu, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { generateBlurPlaceholder } from "@/utils/image";
import NotificationManager from "@/components/NotificationManager";

import { useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';
import MobileMenu from '@/components/MobileMenu';
import StickyHeader from '@/components/StickyHeader';
import { SiteSettings } from "@/lib/actions-settings";

type NavItem = {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  megaMenu?: boolean;
};

interface HeaderProps {
  settings?: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const navItems = settings?.navigation_menu || [
    { label: "সর্বশেষ", href: "/category/latest" },
    { label: "বাংলাদেশ", href: "/category/bangladesh" },
    { label: "রাজনীতি", href: "/category/politics" },
    { label: "অর্থনীতি", href: "/category/economics" },
    { label: "বিশ্ব", href: "/category/world" },
    { label: "খেলা", href: "/category/sports" },
    { label: "বিনোদন", href: "/category/entertainment" },
    { label: "মতামত", href: "/category/opinion" },
    { label: "জীবনযাপন", href: "/category/lifestyle" },
    { label: "অপরাধ", href: "/category/crime" },
    { label: "রাজধানী", href: "/category/capital" },
    { label: "চাকরি", href: "/category/jobs" },
    { label: "ভিডিও", href: "/video" },
    { label: "ছবি", href: "/photo" },
  ];
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const date = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
    <header className="flex flex-col border-b border-white/60 bg-white/85 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm/5">
      {/* Top Bar: Logo & Date */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="relative h-12 w-48 md:h-10 md:w-40">
          <Image
            src={settings?.site_logo || "/samakal-logo.png"}
            alt={settings?.site_name || "Samakal Logo"}
            fill
            sizes="(max-width: 768px) 192px, 160px"
            className="object-contain object-left"
            priority
            placeholder="blur"
            blurDataURL={generateBlurPlaceholder(12, 3)}
          />
        </Link>
        <div className="hidden md:flex gap-4 items-center text-sm text-gray-500">
          <span className="flex items-center gap-2">
             ঢাকা <span className="text-gray-300">|</span> {date}
          </span>
           <button className="bg-brand-red text-white px-4 py-1 rounded text-sm hover:opacity-90 transition">
            ই-পেপার
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-bg-subtle border-t border-gray-100 relative">
        <div className="container mx-auto px-4 flex justify-between items-center h-12">
          {/* Main Nav Links */}
          <nav className="hidden md:flex gap-1 text-gray-800 font-medium">
            {navItems.map((item: NavItem) => {
              const isActive = pathname === item.href;
              const hasSub = !!item.subItems;

              return (
                <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={clsx(
                        "whitespace-nowrap transition-colors px-3 py-3 flex items-center gap-1 hover:text-brand-red",
                        isActive && "text-brand-red font-bold",
                        // Add border bottom only for active main links, but handle Hover separately
                      )}
                    >
                      {item.label}
                      {hasSub && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                    </Link>
                    
                    {/* Active Indicator Line (Bottom) */}
                    {isActive && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-red"></div>}

                    {/* Dropdown Menu */}
                    {hasSub && (
                        <div className={clsx(
                            "absolute top-full left-0 bg-white shadow-xl border-t-2 border-t-brand-red hidden group-hover:block z-50 rounded-b-lg border-x border-b border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200",
                            item.megaMenu ? "w-[600px] right-0 left-auto md:left-auto" : "min-w-[200px]"
                        )}>
                            {/* Adjustment for mega menu to align properly if it goes off screen is tricky with pure CSS locally, 
                                but explicit width helps. For 'Onnanno' being last, 'right-0' is safer. */}
                                
                            <div className={clsx(
                                "grid gap-x-6 gap-y-2",
                                item.megaMenu ? "grid-cols-3" : "grid-cols-1"
                            )}>
                                {item.subItems?.map((sub: { label: string; href: string }) => (
                                    <Link 
                                        key={sub.label} 
                                        href={sub.href}
                                        className="text-sm text-gray-600 hover:text-brand-red hover:bg-gray-50 px-2 py-1.5 rounded transition block"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 hover:text-brand-red transition"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} />
          </button>

          {/* Utility Icons */}
          <div className="flex items-center gap-4 text-gray-600">
            <button 
                onClick={() => setIsSearchOpen(true)} 
                className="hover:text-brand-red transition-colors"
                aria-label="Search"
            >
                <Search size={20} />
            </button>
            {/* Push Notification Toggle */}
            <NotificationManager />
            <Link href="/user/bookmarks" className="hover:text-brand-red" aria-label="Saved Articles">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
    
    {/* Full Screen Search Overlay */}
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    
    {/* Mobile Menu Drawer */}
    <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    
    {/* Sticky Compact Header (appears on scroll) */}
    <StickyHeader 
      onSearchClick={() => setIsSearchOpen(true)}
      onMenuClick={() => setIsMobileMenuOpen(true)}
      siteLogo={settings?.site_logo}
      siteName={settings?.site_name}
    />
    </>
  );
}
