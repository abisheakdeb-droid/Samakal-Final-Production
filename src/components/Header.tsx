"use client";

import {
  Search,
  Menu,
  User as UserIcon,
  ChevronDown,
  Globe,
  MessageSquare,
  Palette,
  Zap,
  Cpu,
  Plane,
  Smile,
  Briefcase,
  Heart,
  Gift,
  Archive,
  Image as ImageIcon,
  Play,
  Star,
  ShieldAlert,
  Flag,
  Trophy,
  PenTool,
  Sun,
  Clock,
  Moon,
  Flower2,
  Users,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

import type { User } from '@/types/user';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { generateBlurPlaceholder } from "@/utils/image";
import NotificationManager from "@/components/NotificationManager";

import { useState, useRef } from "react";
import MobileMenu from "@/components/MobileMenu";
import AuthModal from "@/components/auth/AuthModal";
import UserDropdown from "@/components/auth/UserDropdown";
import { useSession, signOut } from "next-auth/react";
import { SiteSettings } from "@/lib/actions-settings";
import { isDescendantOf } from "@/config/sub-categories";
import { formatBanglaDate } from "@/lib/utils";
import { useUI } from "@/context/UIContext";

export function BreadcrumbToggle() {
  const { showBreadcrumb, toggleBreadcrumb } = useUI();
  return (
    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBreadcrumb(); }} className="relative inline-flex items-center cursor-pointer text-brand-red">
      {showBreadcrumb ? <ToggleRight size={28} className="fill-current" /> : <ToggleLeft size={28} className="text-gray-400" />}
    </div>
  );
}

type NavItem = {
  label: string;
  href: string;
  subItems?: NavItem[];
  items?: NavItem[]; // Robustness for potential data format variations
  megaMenu?: boolean;
};

interface HeaderProps {
  settings?: SiteSettings;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "অপরাধ": ShieldAlert,
  "সমকাল অনুসন্ধান": Search,
  "বিশেষ সমকাল": Star,
  "মতামত": MessageSquare,
  "শিল্পমঞ্চ": Palette,
  "জীবনধারা": Zap,
  "প্রযুক্তি": Cpu,
  "ভ্রমণ": Plane,
  "অফবিট": Smile,
  "প্রবাস": Globe,
  "চাকরি": Briefcase,
  "জীবন সংগ্রাম": Heart,
  "প্রতিষ্ঠাবার্ষিকী": Gift,
  "গোলটেবিল": Users,
  "স্বাধীনতা দিবস": Flag,
  "বিজয় দিবস": Trophy,
  "২১ ফেব্রুয়ারি": PenTool,
  "পহেলা বৈশাখ": Sun,
  "কালের যাত্রা": Clock,
  "নারী দিবস": Smile,
  "ঈদ আনন্দ": Moon,
  "শারদীয় দুর্গোৎসব": Flower2,
  "বিশেষ আয়োজন": Gift,
  "আর্কাইভ": Archive,
  "ছবি": ImageIcon,
  "ভিডিও": Play,
};

const MEGA_MENU_GROUPS = [
  {
    title: "সংবাদ ও অনুসন্ধান",
    categories: ["অপরাধ", "সমকাল অনুসন্ধান", "বিশেষ সমকাল", "জীবন সংগ্রাম"]
  },
  {
    title: "চিন্তা ও জনপদ",
    categories: ["মতামত", "শিল্পমঞ্চ", "প্রবাস", "অফবিট"]
  },
  {
    title: "জীবনধারা ও প্রযুক্তি",
    categories: ["জীবনধারা", "প্রযুক্তি", "ভ্রমণ", "চাকরি"]
  },
  {
    title: "মিডিয়া ও আর্কাইভ",
    categories: ["ছবি", "ভিডিও", "আর্কাইভ"]
  }
];

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
    { label: "ফিচার", href: "/category/feature" },
    { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
    {
      label: "সব",
      href: "#",
      megaMenu: true,
      subItems: [
        { label: "অপরাধ", href: "/category/crime" },
        { label: "সমকাল অনুসন্ধান", href: "/category/investigation" },
        { label: "বিশেষ সমকাল", href: "/category/special-samakal" },
        { label: "মতামত", href: "/category/opinion" },
        {
          label: "শিল্পমঞ্চ",
          href: "/category/shilpomancha",
          subItems: [
            { label: "সাহিত্য", href: "/category/literature" },
            { label: "সংস্কৃতি", href: "/category/culture" },
            { label: "সাক্ষাৎকার", href: "/category/shilpomancha-interview" },
            { label: "অনুবাদ", href: "/category/translation" },
            { label: "ক্ল্যাসিক", href: "/category/classic" },
            { label: "বুক রিভিউ", href: "/category/book-review" },
            { label: "ভ্রমণ", href: "/category/shilpomancha-travel" },
          ]
        },
        { label: "জীবনধারা", href: "/category/lifestyle" },
        { label: "প্রযুক্তি", href: "/category/technology" },
        { label: "ভ্রমণ", href: "/category/travel" },
        { label: "অফবিট", href: "/category/offbeat" },
        { label: "প্রবাস", href: "/category/probash" },
        { label: "চাকরি", href: "/category/jobs" },
        { label: "জীবন সংগ্রাম", href: "/category/jibon-songram" },
        { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
        { label: "প্রতিষ্ঠাবার্ষিকী", href: "/category/anniversary" },
        { label: "গোলটেবিল", href: "/category/roundtable" },
        { label: "জাতীয় দিবস", href: "/category/national-day" },
        { label: "পহেলা বৈশাখ", href: "/category/pohela-boishakh" },
        { label: "কালের যাত্রা", href: "/category/kaler-jatra" },
        { label: "নারী দিবস", href: "/category/womens-day" },
        { label: "ঈদ আনন্দ", href: "/category/eid-ananda" },
        { label: "শারদীয় দুর্গোৎসব", href: "/category/durga-puja" },
        { label: "আর্কাইভ", href: "/archive" },
        { label: "ছবি", href: "/photo" },
        { label: "ভিডিও", href: "/video" },
      ],
    },
  ];

  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    if (session?.user) {
      setIsUserDropdownOpen(true);
    }
  };

  const handleUserMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 300);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setIsUserDropdownOpen(false);
  };

  const processedNavItems = navItems;

  const date = formatBanglaDate(new Date());

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
            <nav className="hidden md:flex gap-1 text-gray-800 dark:text-gray-200 font-medium h-full items-center">
              {processedNavItems.map((item: NavItem, idx: number) => {
                // Logic to highlight parent if on subcategory (e.g. Bangladesh highlighted when on Law & Courts)
                const itemSlug = item.href.split("/").pop() || "";
                const currentSlug = pathname?.split("/").pop() || "";

                const isActive = pathname === item.href || isDescendantOf(itemSlug, currentSlug);
                const hasSub = !!item.subItems;
                const isHamburger = item.label === "সব" || item.label === "আরও";

                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={clsx(
                        "h-full whitespace-nowrap transition-colors px-3 py-3 flex items-center gap-1 hover:text-brand-red",
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

                    {/* Enhanced Mega Menu Dropdown */}
                    {hasSub && (
                      <div
                        className={clsx(
                          "absolute top-full shadow-2xl hidden group-hover:block z-[100] animate-in fade-in slide-in-from-top-2 duration-300",
                          (item.megaMenu || isHamburger)
                            ? "fixed left-1/2 -translate-x-1/2 w-[820px] max-w-[95vw] bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 px-8 py-10 mt-[1px]" // mt-0.5 to stay close
                            : "bg-white dark:bg-gray-800 min-w-[220px] left-0 rounded-b-xl border-x border-b border-gray-100 dark:border-gray-700 p-4",
                          idx > processedNavItems.length - 2 && !item.megaMenu && !isHamburger && "right-0 left-auto",
                        )}
                      >
                        {/* Invisible bridge to maintain hover state if there's any gap */}
                        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />

                        {item.megaMenu || isHamburger ? (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {MEGA_MENU_GROUPS.map((group) => (
                              <div key={group.title} className="space-y-4">
                                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                                  {group.title}
                                </h3>
                                <div className="grid gap-1">
                                  {group.categories.map((catName) => {
                                    const subItem = item.subItems?.find(si => si.label === catName);
                                    const Icon = CATEGORY_ICONS[catName] || ChevronRight;

                                    return (
                                      <Link
                                        key={catName}
                                        href={subItem?.href || "#"}
                                        className="group/item flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-sm transition-all duration-200"
                                      >
                                        <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover/item:bg-red-50 dark:group-hover/item:bg-red-900/20 group-hover/item:text-brand-red transition-colors">
                                          <Icon size={16} />
                                        </div>
                                        <span className="text-[16px] text-gray-700 dark:text-gray-300 group-hover/item:text-brand-red font-medium">
                                          {catName}
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid gap-1">
                            {item.subItems?.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-red hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
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
              {/* Search Button - Direct Link */}
              <Link
                href="/search"
                className="p-2 hover:text-brand-red text-gray-600 dark:text-gray-300 transition"
                aria-label="Search"
              >
                <Search size={22} />
              </Link>

              {/* Theme Toggle */}
              {/* Theme Toggle Removed */}
              {/* <ThemeToggle /> */}

              {/* Notification Manager */}
              <NotificationManager />


              <div
                className="relative group/user"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  onClick={() => !session?.user && setIsAuthModalOpen(true)}
                  className={clsx(
                    "p-2 hover:text-brand-red transition-colors block rounded-full",
                    session?.user ? "text-brand-red" : "text-gray-600 dark:text-gray-300"
                  )}
                  aria-label={session?.user ? "User Menu" : "Login"}
                >
                  {(() => {
                    const avatarSrc = session?.user?.image || (session?.user as { avatar?: string })?.avatar;
                    if (avatarSrc) {
                      return (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                          <Image
                            src={avatarSrc}
                            alt={session?.user?.name || "User"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      );
                    }
                    return <UserIcon size={22} />;
                  })()}
                </button>

                {session?.user && isUserDropdownOpen && (
                  <div className="absolute top-full right-0 z-[110] mt-[-2px] pt-2">
                    <UserDropdown
                      user={session.user as unknown as User}
                      onLogout={handleLogout}
                      onClose={() => setIsUserDropdownOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
