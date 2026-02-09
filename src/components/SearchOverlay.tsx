"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Calendar, User, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { suggestArticles } from "@/lib/actions-article";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      // Prevent body scroll (safe check)
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } else {
      setTimeout(() => setIsAnimating(false), 300);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  // Fetch Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await suggestArticles(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = () => {
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[100] transition-all duration-300 ease-in-out",
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none",
      )}
    >
      {/* Backdrop (Glassmorphism) */}
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-xl dark:bg-black/95"
        onClick={onClose}
      />

      <div className="relative z-10 w-full h-full flex flex-col max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-12">
        {/* Header: Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          >
            <X
              size={32}
              className="text-gray-500 group-hover:text-red-500 transition-colors"
            />
          </button>
        </div>

        {/* Search Input */}
        <div
          className={clsx(
            "transition-all duration-500 delay-100 ease-out transform",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
        >
          <div className="relative group">
            <Search
              className={clsx(
                "absolute left-0 top-1/2 -translate-y-1/2 transition-colors",
                isLoading
                  ? "text-brand-red animate-pulse"
                  : "text-gray-400 group-focus-within:text-brand-red",
              )}
              size={40}
              strokeWidth={1.5}
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="কী খুঁজতে চান? (লিখে Enter চাপুন...)"
              className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-6 pl-14 pr-12 text-3xl md:text-5xl font-light text-gray-900 dark:text-white placeholder:text-gray-300 focus:outline-none focus:border-brand-red transition-all"
            />

            {query && !isLoading && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-brand-red transition-colors"
                aria-label="Clear search"
              >
                <X size={24} />
              </button>
            )}

            {isLoading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-red">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-400 text-sm">
            গুগল স্টাইলে সার্চ করুন, অথবা শিরোনাম লিখুন
          </p>

          {/* Popular Searches & Categories */}
          {!query && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
              <div>
                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Search size={14} /> জনপ্রিয় অনুসন্ধান
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "ফ্যাসিবাদ",
                    "নির্বাচন",
                    "দ্রব্যমূল্য",
                    "ক্রিকেট",
                    "শেখ হাসিনা",
                    "বন্যা",
                    "রোহিঙ্গা",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-brand-red hover:text-white text-gray-600 dark:text-gray-300 text-sm rounded-full transition-all duration-300"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Search size={14} className="rotate-90" /> জনপ্রিয় বিভাগ
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "রাজনীতি", slug: "politics" },
                    { name: "বাংলাদেশ", slug: "bangladesh" },
                    { name: "আন্তর্জাতিক", slug: "international" },
                    { name: "খেলা", slug: "sports" },
                    { name: "বিনোদন", slug: "entertainment" },
                  ].map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg transition-all duration-300"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto mt-12 pb-20 scrollbar-hide">
          {query &&
          results.length === 0 &&
          !isLoading &&
          debouncedQuery.length >= 2 ? (
            <div className="text-center py-20 animate-fade-in-up">
              <p className="text-2xl text-gray-400">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-gray-500 mt-2">
                অন্য কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Suggested Results */}
              {results.map((item, idx) => (
                <Link
                  href={`/article/${item.id}`}
                  key={item.id}
                  onClick={onClose}
                  className={clsx(
                    "group bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-red/30 hover:shadow-lg transition-all duration-300 animate-fade-in-up",
                  )}
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-brand-red mb-1 block">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={10} /> {item.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
