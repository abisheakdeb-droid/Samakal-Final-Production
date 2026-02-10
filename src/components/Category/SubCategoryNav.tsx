"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORY_MAP } from "@/config/categories";

import { ChevronDown } from "lucide-react";
import { SUB_CATEGORIES } from "@/config/sub-categories";

interface SubCategoryNavProps {
  subCategories: string[];
}

export default function SubCategoryNav({ subCategories }: SubCategoryNavProps) {
  const pathname = usePathname();

  if (!subCategories || subCategories.length === 0) return null;

  return (
    <div className="w-full border-b border-gray-100 mb-8 bg-white/80 backdrop-blur-sm sticky top-28 md:top-30 z-40 transition-all">
      <div className="container mx-auto px-4 overflow-x-auto md:overflow-visible scrollbar-hide py-4">
        <div className="flex items-center gap-3 min-w-max md:flex-wrap md:justify-start md:min-w-0">
          {subCategories.map((slug) => {
            const isActive = pathname === `/category/${slug}`;
            const label = CATEGORY_MAP[slug] || slug;
            const nestedItems = SUB_CATEGORIES[slug];
            const hasNested = nestedItems && nestedItems.length > 0;

            return (
              <div key={slug} className="group relative">
                <Link
                  href={`/category/${slug}`}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1",
                    isActive
                      ? "bg-brand-red text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100",
                  )}
                >
                  {label}
                  {hasNested && (
                    <ChevronDown
                      size={14}
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </Link>

                {/* Nested Dropdown for Districts */}
                {hasNested && (
                  <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                      <ul className="flex flex-col">
                        {nestedItems.map((nestedSlug) => (
                          <li
                            key={nestedSlug}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <Link
                              href={`/category/${nestedSlug}`}
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-gray-50 transition-colors"
                            >
                              {CATEGORY_MAP[nestedSlug] || nestedSlug}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
