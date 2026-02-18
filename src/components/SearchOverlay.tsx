import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProxiedImageUrl } from "@/utils/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { suggestArticles } from "@/lib/actions-article";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Use the useDebounce hook (500ms delay)
  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state on close
      setTimeout(() => {
        setQuery("");
        setResults([]);
        setHasSearched(false);
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 2. Trigger search automatically when debouncedQuery changes
  useEffect(() => {
    // If search box is empty, clear results
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const performLiveSearch = async () => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const data = await suggestArticles(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    performLiveSearch();
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFullSearch();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleFullSearch = () => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 pt-20 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[80vh] ring-1 ring-black/5 dark:ring-white/10"
            style={{ boxShadow: "0 0 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            {/* Dynamic Background Blobs (Inside Modal) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
              <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-brand-red/5 rounded-full blur-[80px]" />
              <div className="absolute bottom-[-50%] right-[-50%] w-full h-full bg-brand-orange/5 rounded-full blur-[80px]" />
            </div>

            {/* Header / Input Section */}
            <div className="relative z-10 p-4 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Search
                  className={clsx("w-5 h-5 cursor-pointer hover:text-brand-red transition-colors", isLoading ? "text-brand-red animate-pulse" : "text-gray-400")}
                  onClick={handleFullSearch}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="কী খুঁজছেন?"
                  className="flex-1 bg-transparent text-lg font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                        setHasSearched(false);
                        setResults([]);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section (Scrollable) */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 scrollbar-thin">
              {!query || !hasSearched ? (
                // Initial State
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                      জনপ্রিয় বিষয়
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "রাজনীতি", "নির্বাচন", "বন্যা", "ক্রিকেট", "দ্রব্যমূল্য", "ইসরায়েল", "ফিলিস্তিন"
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setQuery(tag);
                            // Auto trigger search for tags
                            setHasSearched(true);
                            setIsLoading(true);
                            suggestArticles(tag).then(res => {
                              setResults(res);
                              setIsLoading(false);
                            });
                          }}
                          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red text-gray-600 dark:text-gray-300 text-sm rounded-md transition-colors"
                        >
                          # {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                      দ্রুত যান
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { name: "বাংলাদেশ", slug: "bangladesh" },
                        { name: "রাজনীতি", slug: "politics" },
                        { name: "আন্তর্জাতিক", slug: "international" },
                        { name: "খেলা", slug: "sports" },
                        { name: "বিনোদন", slug: "entertainment" },
                        { name: "মতামত", slug: "opinion" },
                      ].map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={onClose}
                          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Search Results
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-brand-red" size={24} />
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      {results.map((item) => (
                        <Link
                          key={item.id}
                          href={`/article/${item.id}`}
                          onClick={onClose}
                          className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                          <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-200">
                            <Image
                              src={getProxiedImageUrl(item.image, 100)}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-brand-red uppercase tracking-wide">
                              {item.category}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={handleFullSearch}
                        className="w-full py-3 mt-2 text-sm font-medium text-brand-red bg-brand-red/5 hover:bg-brand-red/10 rounded-lg transition-colors border border-brand-red/20 dashed"
                      >
                        বাকি ফলাফল দেখুন...
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm">No results for &quot;<span className="font-semibold text-gray-900 dark:text-white">{query}</span>&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Tip */}
            {!query && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 text-center">
                Pro tip: Use arrows to navigate, Enter to select
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
