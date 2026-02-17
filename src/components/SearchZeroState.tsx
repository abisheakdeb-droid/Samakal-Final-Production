"use client";

import Link from "next/link";
import { TrendingUp, Clock, Grid, X, Briefcase, Globe, Monitor, Trophy, Building, Shield } from "lucide-react";
import { CATEGORY_MAP } from "@/config/categories";

export default function SearchZeroState() {
    // Trending Data (Should ideally come from API or based on real tags)
    const trendingTags: string[] = [];

    // Recent Searches (Ideally from localStorage)
    const recentSearches: string[] = [];

    const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
        "politics": Building,
        "bangladesh": Shield,
        "sports": Trophy,
        "entertainment": Monitor,
        "economics": Briefcase,
        "international": Globe,
        "technology": Monitor,
    };

    return (
        <div className="space-y-10 mt-8">

            {/* Trending Topics */}
            {trendingTags.length > 0 && (
                <section>
                    <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                        <TrendingUp size={18} className="text-brand-red" />
                        জনপ্রিয় টপিক
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {trendingTags.map(tag => (
                            <Link
                                key={tag}
                                href={`/search?q=${tag.replace("#", "")}`}
                                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-brand-red hover:text-white hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <section>
                    <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                        <Clock size={18} className="text-brand-red" />
                        সাম্প্রতিক অনুসন্ধান
                    </h3>
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        {recentSearches.map((term, idx) => (
                            <div key={idx} className="flex items-center justify-between px-5 py-3.5 border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                                <Link href={`/search?q=${term}`} className="flex-1 text-gray-700 dark:text-gray-300 font-medium text-sm flex items-center gap-3">
                                    <Clock size={14} className="text-gray-400" />
                                    {term}
                                </Link>
                                <button className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all">
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Categories */}
            <section>
                <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                    <Grid size={18} className="text-brand-red" />
                    পপুলার ক্যাটাগরি
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(CATEGORY_MAP).slice(0, 8).map(([key, label]) => {
                        const Icon = categoryIcons[key] || Grid;
                        return (
                            <Link
                                key={key}
                                href={`/search?category=${label}`}
                                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-brand-red/20 transform hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors text-gray-400">
                                    <Icon size={20} />
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-brand-red transition-colors">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </section>

        </div>
    );
}
