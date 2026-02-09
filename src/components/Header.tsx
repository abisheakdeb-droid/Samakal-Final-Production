"use client";

import { Search, Menu, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { generateBlurPlaceholder } from "@/utils/image";
import NotificationManager from "@/components/NotificationManager";

import { useState } from "react";
import SearchOverlay from "@/components/SearchOverlay";
import MobileMenu from "@/components/MobileMenu";
// import ThemeToggle from '@/components/ThemeToggle';
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
  const navItems: NavItem[] = (settings?.navigation_menu as NavItem[]) || [
    { label: "সর্বশেষ", href: "/category/latest" },
    { label: "বাংলাদেশ", href: "/category/bangladesh" },
    { label: "সারাদেশ", href: "/category/saradesh" },
    { label: "রাজধানী", href: "/category/capital" },
    { label: "রাজনীতি", href: "/category/politics" },
    { label: "বিশ্ব", href: "/category/world" },
    { label: "অর্থনীতি", href: "/category/economics" },
    { label: "খেলা", href: "/category/sports" },
    { label: "বিনোদন", href: "/category/entertainment" },
    { label: "মতামত", href: "/category/opinion" },
    { label: "চাকরি", href: "/category/jobs" },
    { label: "আর্কাইভ", href: "/archive" },
    { label: "গ্যালারি", href: "/photo" },
    {
      label: "সব",
      href: "#",
      megaMenu: true,
      subItems: [
        { label: "প্রবাস", href: "/category/probash" },
        { label: "জীবন সংগ্রাম", href: "/category/jibon-songram" },
        { label: "ভ্রমণ", href: "/category/travel" },
        { label: "ফিচার", href: "/category/feature" },
        { label: "বিশেষ সমকাল", href: "/category/special-samakal" },
        { label: "প্রযুক্তি", href: "/category/technology" },
        { label: "সমকাল অনুসন্ধান", href: "/category/investigation" },
        { label: "অফবিট", href: "/category/offbeat" },
        { label: "শিল্পমঞ্চ", href: "/category/shilpomancha" },
        { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
      ],
    },
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
      <header className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm">
        {/* Top Bar: Logo & Date */}
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
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
          <div className="hidden md:flex gap-4 items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              ঢাকা <span className="text-gray-300">|</span> {date}
            </span>
            <Link
              href="https://epaper.samakal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-red text-white px-4 py-1 rounded text-sm hover:opacity-90 transition"
            >
              ই-পেপার
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 relative">
          <div className="container mx-auto px-4 flex justify-between items-center h-12">
            {/* Main Nav Links */}
            <nav className="hidden md:flex gap-1 text-gray-800 dark:text-gray-200 font-medium overflow-visible">
              {navItems.map((item: NavItem, idx) => {
                const isActive = pathname === item.href;
                const hasSub = !!item.subItems;
                const isHamburger = item.label === "সব" || item.label === "আরও";

                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={clsx(
                        "whitespace-nowrap transition-colors px-3 py-3 flex items-center gap-1 hover:text-brand-red",
                        isActive && "text-brand-red font-bold",
                        isHamburger && "px-4", // Extra padding for the icon
                      )}
                    >
                      {isHamburger ? <Menu size={20} /> : item.label}
                      {hasSub && !isHamburger && (
                        <ChevronDown
                          size={14}
                          className="group-hover:rotate-180 transition-transform duration-300"
                        />
                      )}
                    </Link>

                    {/* Active Indicator Line (Bottom) - Only for text items */}
                    {isActive && !isHamburger && (
                      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-red"></div>
                    )}

                    {/* Dropdown Menu */}
                    {hasSub && (
                      <div
                        className={clsx(
                          "absolute top-full bg-white dark:bg-gray-800 shadow-xl border-t-2 border-t-brand-red hidden group-hover:block z-50 rounded-b-lg border-x border-b border-gray-100 dark:border-gray-700 p-4 animate-in fade-in slide-in-from-top-2 duration-200",
                          item.megaMenu
                            ? "w-[400px]" // User asked for 2 columns, 400px is enough
                            : "min-w-[200px]",
                          // Align right for the last few items to prevent overflow
                          idx > navItems.length - 3 ? "right-0" : "left-0",
                        )}
                      >
                        <div
                          className={clsx(
                            "grid gap-x-6 gap-y-2",
                            // Force 2 columns for hamburger/mega, 1 otherwise
                            item.megaMenu || isHamburger
                              ? "grid-cols-2"
                              : "grid-cols-1",
                          )}
                        >
                          {item.subItems?.map(
                            (sub: { label: string; href: string }) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-red hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1.5 rounded transition block"
                              >
                                {sub.label}
                              </Link>
                            ),
                          )}
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

            {/* Right Actions (Search, Theme, User, Notifications) */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              {/* Theme Toggle Removed */}
              {/* <ThemeToggle /> */}

              {/* Notification Manager */}
              <NotificationManager />
              <Link
                href="/user/bookmarks"
                className="hover:text-brand-red"
                aria-label="Saved Articles"
              >
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
