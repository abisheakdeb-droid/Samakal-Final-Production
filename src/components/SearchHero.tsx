"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function SearchHero() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("q", query);
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearSearch = () => {
        setQuery("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative max-w-2xl mx-auto w-full group">
            <div className="relative flex items-center w-full h-14 rounded-full shadow-lg bg-white border border-gray-100 transition-shadow duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-red/20 focus-within:border-brand-red/50">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                    <Search size={20} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            handleSearch(e);
                        }
                    }}
                    placeholder="খবর খুঁজুন..."
                    className="peer h-full w-full outline-none focus:outline-none focus:ring-0 focus:border-none text-gray-700 pr-2 bg-transparent text-lg placeholder-gray-400"
                />

                <div className="flex items-center pr-2 gap-2">
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}

                    <button
                        onClick={handleSearch}
                        className="h-10 px-6 bg-brand-red hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        খুঁজুন
                    </button>
                </div>
            </div>
        </div>
    );
}
