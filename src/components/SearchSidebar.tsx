"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CATEGORY_MAP, PARENT_CATEGORIES } from "@/config/categories";
import clsx from "clsx";
import { Calendar } from "lucide-react";

export default function SearchSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all" || value === "") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const currentCategory = searchParams.get("category") || "all";
    const currentDate = searchParams.get("date") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    // Mock Media Types for now 
    const mediaTypes = [
        { id: "news", label: "সংবাদ" },
        { id: "image", label: "ছবি" },
        { id: "video", label: "ভিডিও" }
    ];

    return (
        <aside className="space-y-8 sticky top-24 bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 min-h-[80vh]">
            {/* Date Filter */}
            <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                    তারিখ
                </h3>
                <div className="space-y-3">
                    {[
                        { id: "all", label: "সব সময়" },
                        { id: "today", label: "আজকের খবর" },
                        { id: "week", label: "গত ৭ দিন" },
                        { id: "month", label: "এই মাস" },
                    ].map((opt) => (
                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="radio"
                                    name="date"
                                    checked={currentDate === opt.id}
                                    onChange={() => updateParam("date", opt.id)}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-brand-red checked:border-4 transition-colors"
                                />
                            </div>
                            <span className={clsx(
                                "text-sm transition-colors font-medium",
                                currentDate === opt.id ? "text-brand-red" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                            )}>
                                {opt.label}
                            </span>
                        </label>
                    ))}

                    {/* Custom Date Option */}
                    <label className="block">
                        <div className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="radio"
                                    name="date"
                                    checked={currentDate === "custom"}
                                    onChange={() => updateParam("date", "custom")}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-brand-red checked:border-4 transition-colors"
                                />
                            </div>
                            <span className={clsx(
                                "text-sm transition-colors font-medium flex items-center gap-2",
                                currentDate === "custom" ? "text-brand-red" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                            )}>
                                <Calendar size={16} /> নির্দিষ্ট তারিখ
                            </span>
                        </div>

                        {/* Custom Date Inputs - Expandable */}
                        <div className={clsx(
                            "grid grid-cols-2 gap-2 mt-3 pl-8 overflow-hidden transition-all duration-300 ease-in-out",
                            currentDate === "custom" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 font-semibold block mb-1">হতে</label>
                                <input
                                    type="date"
                                    value={searchParams.get("dateFrom") || ""}
                                    onChange={(e) => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("dateFrom", e.target.value);
                                        params.set("date", "custom"); // Ensure custom is selected
                                        router.push(`${pathname}?${params.toString()}`);
                                    }}
                                    className="w-full h-9 px-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:ring-1 focus:ring-brand-red focus:border-brand-red shadow-sm transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 font-semibold block mb-1">পর্যন্ত</label>
                                <input
                                    type="date"
                                    value={searchParams.get("dateTo") || ""}
                                    onChange={(e) => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set("dateTo", e.target.value);
                                        params.set("date", "custom"); // Ensure custom is selected
                                        router.push(`${pathname}?${params.toString()}`);
                                    }}
                                    className="w-full h-9 px-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:ring-1 focus:ring-brand-red focus:border-brand-red shadow-sm transition-all outline-none"
                                />
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                    ক্যাটাগরি
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className="relative flex items-center">
                            <input
                                type="radio"
                                name="category"
                                checked={currentCategory === "all"}
                                onChange={() => updateParam("category", "all")}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-brand-red checked:border-brand-red transition-all"
                            />
                            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className={clsx(
                            "text-sm transition-colors font-medium",
                            currentCategory === "all" ? "text-brand-red" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                        )}>
                            সব ক্যাটাগরি
                        </span>
                    </label>
                    {PARENT_CATEGORIES.map((catKey) => (
                        <label key={catKey} className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={currentCategory === (CATEGORY_MAP[catKey] || catKey)}
                                    onChange={() => updateParam("category", CATEGORY_MAP[catKey] || catKey)}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-brand-red checked:border-brand-red transition-all"
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className={clsx(
                                "text-sm transition-colors font-medium",
                                currentCategory === (CATEGORY_MAP[catKey] || catKey) ? "text-brand-red" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                            )}>
                                {CATEGORY_MAP[catKey] || catKey}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Media Type Filter */}
            <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                    মিডিয়া টাইপ
                </h3>
                <div className="space-y-3">
                    {mediaTypes.map((media) => (
                        <label key={media.id} className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    defaultChecked={media.id === "news"}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-brand-red checked:border-brand-red transition-all"
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                                {media.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sorting */}
            <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                    সাজানো
                </h3>
                <div className="space-y-3">
                    {[
                        { id: "newest", label: "সর্বশেষ সংবাদ" },
                        { id: "oldest", label: "পুরানো সংবাদ" },
                        { id: "popular", label: "জনপ্রিয়তা" },
                        { id: "relevance", label: "প্রাসঙ্গিকতা" },
                    ].map((opt) => (
                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    checked={currentSort === opt.id}
                                    onChange={() => updateParam("sort", opt.id)}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-brand-red checked:border-4 transition-colors"
                                />
                            </div>
                            <span className={clsx(
                                "text-sm transition-colors font-medium",
                                currentSort === opt.id ? "text-brand-red" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300"
                            )}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </aside>
    );
}
