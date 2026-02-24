"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_MAP } from "@/config/categories";

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm text-gray-500 mb-6 font-medium animate-in fade-in slide-in-from-left-2 duration-300",
        className,
      )}
    >
      <ol className="flex items-center flex-wrap gap-2">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-brand-red transition-colors"
            title="Home"
          >
            <Home size={16} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = CATEGORY_MAP[item.label] || item.label; // Try to translate slug if passed as label

          return (
            <li key={item.href} className="flex items-center">
              <ChevronRight size={14} className="mx-1 text-gray-400" />
              {isLast ? (
                <span
                  className="text-brand-red font-semibold"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand-red transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
