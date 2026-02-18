"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatBanglaDate } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";
import { getProxiedImageUrl } from "@/utils/image";

interface Article {
  id: string;
  title: string;
  image: string;
  category: string;
  time: string;
  author: string;
}

export default function ArchiveClient({
  initialStartDate,
  initialEndDate,
  articles,
}: {
  initialStartDate: string;
  initialEndDate: string;
  articles: Article[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );

  const categories = [
    "all",
    "politics",
    "bangladesh",
    "saradesh",
    "capital",
    "crime",
    "world",
    "business",
    "economics",
    "opinion",
    "sports",
    "entertainment",
    "technology",
    "education",
    "lifestyle",
    "jobs",
    "probash",
  ];

  const categoryLabels: Record<string, string> = {
    all: "সব ক্যাটাগরি",
    politics: "রাজনীতি",
    bangladesh: "বাংলাদেশ",
    saradesh: "সারাদেশ",
    capital: "রাজধানী",
    crime: "অপরাধ",
    world: "বিশ্ব",
    business: "বাণিজ্য",
    economics: "অর্থনীতি",
    opinion: "মতামত",
    sports: "খেলা",
    entertainment: "বিনোদন",
    technology: "প্রযুক্তি",
    education: "শিক্ষা",
    lifestyle: "জীবন ধারা",
    jobs: "চাকরি",
    probash: "প্রবাস",
  };

  const handleFilterChange = (
    newStart: string,
    newEnd: string,
    newCat: string,
  ) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    setSelectedCategory(newCat);

    const params = new URLSearchParams();
    if (newStart) params.set("from", newStart);
    if (newEnd) params.set("to", newEnd);
    if (newCat && newCat !== "all") params.set("category", newCat);

    router.push(`/archive?${params.toString()}`);
  };

  const toBengaliNumber = (num: number | string) => {
    return num.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  const displayDateRange = () => {
    if (startDate === endDate) {
      return formatBanglaDate(startDate);
    }
    return `${formatBanglaDate(startDate)} থেকে ${formatBanglaDate(endDate)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Control Bar */}
      <ScrollReveal>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  আর্কাইভ
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  পুরানো খবর খুঁজুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date From */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  তারিখ হতে:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    handleFilterChange(
                      e.target.value,
                      endDate,
                      selectedCategory,
                    )
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none transition"
                />
              </div>

              {/* Date To */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  তারিখ পর্যন্ত:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    handleFilterChange(
                      startDate,
                      e.target.value,
                      selectedCategory,
                    )
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none transition"
                />
              </div>

              {/* Category Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  ক্যাটাগরি:
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      handleFilterChange(startDate, endDate, e.target.value)
                    }
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat] || cat}
                      </option>
                    ))}
                  </select>
                  <Filter
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Results Title */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl text-gray-700 dark:text-gray-300">
          <span className="font-bold text-brand-red underline decoration-brand-red/30 underline-offset-8">
            {displayDateRange()}
          </span>{" "}
          -এর সংবাদ
          {selectedCategory !== "all" && (
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              ({categoryLabels[selectedCategory]})
            </span>
          )}
        </h2>
        <div className="px-4 py-2 bg-brand-red/5 rounded-full border border-brand-red/10">
          <span className="font-bold text-brand-red text-xl">
            {toBengaliNumber(articles.length)}
          </span>{" "}
          <span className="text-gray-600 dark:text-gray-400">
            টি সংবাদ পাওয়া গেছে
          </span>
        </div>
      </div>

      {/* Content or Loader */}
      {articles.length === 0 ? (
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 min-h-[40vh] bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in-up">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-xl font-bold dark:text-gray-300">
              দুঃখিত, এই তারিখে বা ক্যাটাগরিতে কোনো খবর পাওয়া যায়নি।
            </h2>
            <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm">
              অনুগ্রহ করে অন্য তারিখ বা ক্যাটাগরি নির্বাচন করুন
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article, idx) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group block bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-brand-red/30 transition-all h-full animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getProxiedImageUrl(article.image, 400)}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-brand-red text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">
                    {article.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug group-hover:text-brand-red dark:group-hover:text-brand-red line-clamp-2 mb-2 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans">
                    <span>{article.time}</span>
                    <span className="opacity-30">•</span>
                    <span className="truncate">{article.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
