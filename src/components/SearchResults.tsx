"use client";

import Link from "next/link";
import Image from "next/image";
import { localizeTime } from "@/utils/bn";
import { CATEGORY_MAP } from "@/config/categories";

interface SearchResultsProps {
    results: any[];
    query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
    // Highlight Helper
    const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
        if (!highlight.trim()) return <>{text}</>;
        const parts = text.split(new RegExp(`(${highlight})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <mark key={i} className="bg-brand-red/10 text-brand-red font-medium px-0.5 rounded-sm">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    কোনো ফলাফল পাওয়া যায়নি
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    দুঃখিত, &quot;<span className="font-semibold text-gray-900 dark:text-white">{query}</span>&quot; এর জন্য আমরা কোনো খবর খুঁজে পাইনি।
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                    মোট <span className="font-bold text-brand-red">{results.length.toLocaleString('bn-BD')}</span> টি খবর পাওয়া গেছে
                </p>
                {/* Pagination info or simple text could go here */}
            </div>

            {results.map((article) => (
                <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="group flex flex-col md:flex-row gap-4 md:gap-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all items-center"
                >
                    {/* Thumbnail - Left Side on Desktop */}
                    <div className="w-full md:w-56 aspect-[16/10] relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {article.category && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-red text-white text-[10px] uppercase font-bold rounded-sm shadow-sm">
                                {CATEGORY_MAP[article.category] || article.category}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors mb-3 leading-snug">
                            <HighlightText text={article.title} highlight={query} />
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-3 leading-relaxed mb-3">
                            <HighlightText text={article.summary || ""} highlight={query} />
                        </p>

                        <div className="text-xs text-gray-400 flex items-center gap-3">
                            <span className="font-medium text-gray-500 dark:text-gray-300">
                                {article.reporter || "সমকাল প্রতিবেদক"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-gray-500">{localizeTime(article.time)}</span>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Load More / Pagination Placeholder */}
            <div className="pt-8 flex justify-center">
                <button className="px-6 py-2 border border-brand-red text-brand-red rounded-full hover:bg-brand-red hover:text-white transition-all text-sm font-bold">
                    আরও দেখুন
                </button>
            </div>
        </div>
    );
}
