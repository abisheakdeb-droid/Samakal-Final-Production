"use client";

import Image from "next/image";

interface NativeAdProps {
  title: string;
  description: string;
  image: string;
  url: string;
  sponsor: string;
}

/**
 * Native ad component that blends with editorial content
 * Follows IAB native ad guidelines
 */
export default function NativeAd({
  title,
  description,
  image,
  url,
  sponsor,
}: NativeAdProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-300"
    >
      {/* Prominent "Sponsored" label for transparency */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 px-4 py-2">
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wide">
          প্রচারিত • Sponsored by {sponsor}
        </span>
      </div>

      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

/**
 * Compact native ad for sidebar
 */
export function NativeAdCompact({
  title,
  image,
  url,
  sponsor,
}: Omit<NativeAdProps, "description">) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all"
    >
      <div className="bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 border-b border-amber-100 dark:border-amber-900/30">
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-500">
          প্রচারিত
        </span>
      </div>
      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-3 group-hover:text-brand-red transition">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {sponsor}
          </p>
        </div>
      </div>
    </a>
  );
}
