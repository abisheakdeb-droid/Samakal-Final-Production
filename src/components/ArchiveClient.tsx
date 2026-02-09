"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from "clsx";

interface Article {
    id: string;
    title: string;
    image: string;
    category: string;
    time: string;
    author: string;
}

interface ArchiveClientProps {
    initialDate: string; // YYYY-MM-DD
    articles: Article[];
}

export default function ArchiveClient({ initialDate, articles }: ArchiveClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [date, setDate] = useState(initialDate);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.push(`/archive?date=${newDate}&category=${selectedCategory}`);
    };

    const handlePrevDay = () => {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        const newDate = d.toISOString().split('T')[0];
        setDate(newDate);
        router.push(`/archive?date=${newDate}&category=${selectedCategory}`);
    };

    const handleNextDay = () => {
        const d = new Date(date);
        if (new Date(d).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) return;
        
        d.setDate(d.getDate() + 1);
        const newDate = d.toISOString().split('T')[0];
        setDate(newDate);
        router.push(`/archive?date=${newDate}&category=${selectedCategory}`);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.push(`/archive?date=${date}&category=${category}`);
    };

    // Filter articles by selected category
    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'all') return articles;
        return articles.filter(article => article.category === selectedCategory);
    }, [articles, selectedCategory]);

    // Format Date for Display (Bengali)
    const displayDate = new Date(date).toLocaleDateString('bn-BD', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });

    const categories = ['all', 'politics', 'bangladesh', 'sports', 'entertainment', 'economics', 'international', 'technology'];
    const categoryLabels: Record<string, string> = {
        'all': 'সব',
        'politics': 'রাজনীতি',
        'bangladesh': 'বাংলাদেশ',
        'sports': 'খেলা',
        'entertainment': 'বিনোদন',
        'economics': 'অর্থনীতি',
        'international': 'আন্তর্জাতিক',
        'technology': 'প্রযুক্তি'
    };
 
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Control Bar */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-3">
                         <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                             <CalendarIcon size={24} />
                         </div>
                         <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">আর্কাইভ</h1>
                             <p className="text-gray-500 dark:text-gray-400 text-sm">পুরানো খবর খুঁজুন</p>
                         </div>
                     </div>

                     <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                         <button onClick={handlePrevDay} className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition text-gray-600 dark:text-gray-400">
                             <ChevronLeft size={20} />
                         </button>
                         <input 
                            type="date" 
                            value={date} 
                            onChange={handleDateChange}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-bold text-lg font-sans outline-none cursor-pointer"
                         />
                         <button 
                            onClick={handleNextDay} 
                            disabled={new Date(date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition text-gray-600 dark:text-gray-400 disabled:opacity-30"
                         >
                             <ChevronRight size={20} />
                         </button>
                     </div>
                 </div>

                 {/* Category Filter */}
                 <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-3 mb-4">
                         <Filter size={16} className="text-gray-400" />
                         <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">বিভাগ অনুযায়ী ফিল্টার করুন</h3>
                     </div>
                     <div className="flex flex-wrap gap-2">
                         {categories.map(cat => (
                             <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    selectedCategory === cat
                                        ? "bg-brand-red text-white shadow-md"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                )}
                             >
                                 {categoryLabels[cat]}
                             </button>
                         ))}
                     </div>
                 </div>
            </div>

            {/* Results Title */}
            <div className="mb-8 text-center animate-fade-in">
                 <h2 className="text-xl text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-brand-red underline decoration-brand-red/30 underline-offset-8">{displayDate}</span> এর সংবাদ
                    {selectedCategory !== 'all' && (
                        <span className="ml-2 text-gray-500 dark:text-gray-400">({categoryLabels[selectedCategory]})</span>
                    )}
                 </h2>
                 <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">{filteredArticles.length} টি সংবাদ পাওয়া গেছে</p>
            </div>
            
            {/* Content or Loader */}
            {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400 min-h-[40vh] bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in-up">
                    <CalendarIcon size={64} className="mb-6 opacity-20" />
                    <h2 className="text-2xl font-bold dark:text-gray-300">এই তারিখে কোন নিউজ পাওয়া যায়নি</h2>
                    <p className="mt-2 text-gray-400 dark:text-gray-500">
                        {selectedCategory !== 'all' ? `"${categoryLabels[selectedCategory]}" বিভাগে` : ''} অন্য তারিখ নির্বাচন করুন
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredArticles.map((article, idx) => (
                        <Link 
                            key={article.id} 
                            href={`/article/${article.id}`} 
                            className="group block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-brand-red/30 transition-all h-full animate-fade-in-up"
                            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                        >
                            <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <Image 
                                    src={article.image} 
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
            )}
        </div>
    );
}
