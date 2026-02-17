"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavItem = {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "সর্বশেষ", href: "/category/latest" },
  { label: "রাজনীতি", href: "/category/politics" },
  { label: "বাংলাদেশ", href: "/category/bangladesh" },
  { label: "সারাদেশ", href: "/category/saradesh" },
  { label: "রাজধানী", href: "/category/capital" },
  { label: "বিশ্ব", href: "/category/world" },
  { label: "অর্থনীতি", href: "/category/economics" },
  { label: "খেলা", href: "/category/sports" },

  // সেকশন: বিশেষ সেকশন (Treat as main in mobile drawer)
  { label: "অপরাধ", href: "/category/crime" },
  { label: "বিনোদন", href: "/category/entertainment" },
  { label: "মতামত", href: "/category/opinion" },
  { label: "প্রযুক্তি", href: "/category/technology" },
  { label: "ফিচার", href: "/category/feature" },
  { label: "প্রবাস", href: "/category/probash" },
  { label: "চাকরি", href: "/category/jobs" },
  { label: "ভিডিও", href: "/video" },
  { label: "ছবি", href: "/photo" },

  {
    label: "অন্যান্য",
    href: "#",
    subItems: [
      { label: "জীবন সংগ্রাম", href: "/category/jibon-songram" },
      { label: "ভ্রমণ", href: "/category/travel" },
      { label: "সমকাল অনুসন্ধান", href: "/category/investigation" },
      { label: "শিল্পমঞ্চ", href: "/category/shilpomancha" },
      { label: "সাক্ষাৎকার", href: "/category/interview" },
      { label: "অফবিট", href: "/category/offbeat" },
      { label: "বিশেষ আয়োজন", href: "/category/special-arrangement" },
      { label: "বিশেষ সমকাল", href: "/category/special-samakal" },
      { label: "আর্কাইভ", href: "/archive" },
    ]
  },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Close menu on route change
  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-100 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-101 shadow-2xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">মেনু</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Login Link (Mobile) */}
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">অ্যাকাউন্ট</span>
          <Link href="/admin/login" className="text-sm font-bold text-brand-red hover:underline flex items-center gap-1">
            লগইন
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="overflow-y-auto h-[calc(100%-72px)] p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const isExpanded = expandedItem === item.label;
              const hasSub = !!item.subItems;

              return (
                <li key={item.label}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex-1 px-4 py-3 rounded-lg transition-colors font-medium",
                        isActive
                          ? "bg-brand-red text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.label}
                    </Link>

                    {hasSub && (
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                        className="p-3 hover:bg-gray-100 rounded-lg ml-1"
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={isExpanded}
                      >
                        <ChevronRight
                          size={18}
                          className={clsx(
                            "transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Sub-items */}
                  {hasSub && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.subItems?.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-red hover:bg-gray-50 rounded-lg transition"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
