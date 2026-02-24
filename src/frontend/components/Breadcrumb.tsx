"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_MAP } from "@/config/categories";
import { getParentCategory } from "@/config/sub-categories";
import { useUI } from "@/context/UIContext";

interface BreadcrumbProps {
    currentSlug: string;
    isArticle?: boolean;
    articleTitle?: string;
}

export default function Breadcrumb({ currentSlug, isArticle, articleTitle }: BreadcrumbProps) {
    const { showBreadcrumb } = useUI();

    // Don't render anything if disabled in settings
    if (!showBreadcrumb) return null;

    const getPath = (slug: string): string[] => {
        const path: string[] = [slug];
        const visited = new Set<string>([slug]);
        let parent = getParentCategory(slug);

        while (parent && !visited.has(parent)) {
            path.unshift(parent);
            visited.add(parent);
            parent = getParentCategory(parent);
        }
        return path;
    };

    const path = getPath(currentSlug);

    return (
        <div role="navigation" aria-label="breadcrumb" className="flex items-center space-x-2 text-[11px] mb-6 font-sans overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link
                href="/"
                className="flex items-center justify-center w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-brand-red hover:text-white transition-all shrink-0 no-underline hover:no-underline"
            >
                <Home size={14} />
            </Link>

            {path.map((slug, index) => {
                const label = CATEGORY_MAP[slug] || slug;
                const isLast = index === path.length - 1 && !isArticle;

                return (
                    <div key={slug} className="flex items-center shrink-0">
                        <Link
                            href={`/category/${slug}`}
                            className={cn(
                                "px-3 py-1.5 rounded-full font-medium transition-all no-underline hover:no-underline",
                                isLast
                                    ? "bg-brand-red text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {label}
                        </Link>
                    </div>
                );
            })}

            {isArticle && articleTitle && (
                <div className="flex items-center shrink-0">
                    <span className="px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-medium max-w-[150px] md:max-w-[300px] truncate">
                        {articleTitle}
                    </span>
                </div>
            )}
        </div>
    );
}
