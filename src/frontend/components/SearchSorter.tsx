"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function SearchSorter() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentSort = searchParams.get("sort") || "newest";

    // Close sorting dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sortValue);
        router.push(`/search?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2" ref={dropdownRef}>
            <span className="text-sm text-gray-500 dark:text-gray-400">সাজান:</span>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    {currentSort === "newest" ? "সর্বশেষ" : "প্রাসঙ্গিকতা"}
                    <ChevronDown size={14} className={clsx("transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-lg overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                        <button
                            onClick={() => handleSort("newest")}
                            className={clsx(
                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between",
                                currentSort === "newest" ? "text-brand-red font-bold" : "text-gray-700 dark:text-gray-300"
                            )}
                        >
                            সর্বশেষ
                            {currentSort === "newest" && <Check size={14} />}
                        </button>
                        <button
                            onClick={() => handleSort("relevance")}
                            className={clsx(
                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between",
                                currentSort === "relevance" ? "text-brand-red font-bold" : "text-gray-700 dark:text-gray-300"
                            )}
                        >
                            প্রাসঙ্গিকতা
                            {currentSort === "relevance" && <Check size={14} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
