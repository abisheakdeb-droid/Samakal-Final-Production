import { fetchArticlesBySearch } from '@/lib/actions-article';
import Link from 'next/link';
import Image from 'next/image';
import { localizeTime } from '@/utils/bn';
import { CATEGORY_MAP } from '@/config/categories';
import { ChevronDown } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; date?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const category = resolvedSearchParams.category || 'all';
  const dateRange = resolvedSearchParams.date || 'all';
  const sort = resolvedSearchParams.sort || 'newest';

  if (!query) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-bold text-gray-300 mb-4">অনুসন্ধান করুন</h1>
            <p className="text-gray-500">খবর খুঁজতে উপরের সার্চ বার ব্যবহার করুন</p>
        </div>
    );
  }

  const results = await fetchArticlesBySearch({
    query,
    category,
    dateRange,
    sort,
    limit: 50
  });

  // Helper to highlight text
  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
      if (!highlight.trim()) return <>{text}</>;
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return (
          <>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded-sm">{part}</mark>
                ) : (
                    part
                )
            )}
          </>
      );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Sidebar: Filters */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">
                <div className="sticky top-24">
                     <h3 className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">ফিল্টার</h3>
                     
                     {/* Date Filter */}
                     <div className="mb-6">
                         <h4 className="font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 text-xs tracking-wider">সময়</h4>
                         <div className="space-y-2">
                             {[
                                 { id: 'all', label: 'সব সময়' },
                                 { id: 'today', label: 'আজকের' },
                                 { id: 'week', label: 'গত ৭ দিন' },
                                 { id: 'month', label: 'গত ১ মাস' },
                             ].map(opt => (
                                 <Link 
                                    key={opt.id}
                                    href={`/search?q=${query}&category=${category}&date=${opt.id}&sort=${sort}`}
                                    className={`block text-sm transition-colors ${dateRange === opt.id ? 'text-brand-red font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red'}`}
                                 >
                                    {opt.label}
                                 </Link>
                             ))}
                         </div>
                     </div>

                     {/* Category Filter */}
                     <div>
                         <h4 className="font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 text-xs tracking-wider">বিভাগ</h4>
                         <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-gray-700">
                             <Link 
                                href={`/search?q=${query}&category=all&date=${dateRange}&sort=${sort}`}
                                className={`block text-sm transition-colors ${category === 'all' ? 'text-brand-red font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red'}`}
                             >
                                সব বিভাগ
                             </Link>
                             {['politics', 'bangladesh', 'sports', 'entertainment', 'economics', 'international', 'technology'].map(cat => (
                                 <Link 
                                    key={cat}
                                    href={`/search?q=${query}&category=${CATEGORY_MAP[cat] || cat}&date=${dateRange}&sort=${sort}`}
                                    className={`block text-sm transition-colors ${category === (CATEGORY_MAP[cat] || cat) ? 'text-brand-red font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red'}`}
                                 >
                                    {CATEGORY_MAP[cat]}
                                 </Link>
                             ))}
                         </div>
                     </div>
                </div>
            </aside>

            {/* Main Content: Results */}
            <main className="flex-1">
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            &quot;{query}&quot; - এর জন্য ফলাফল
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {results.length} টি সংবাদ পাওয়া গেছে
                        </p>
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">সাজান:</span>
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                {sort === 'newest' ? 'সর্বশেষ' : 'প্রাসঙ্গিকতা'}
                                <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20">
                                <Link 
                                    href={`/search?q=${query}&category=${category}&date=${dateRange}&sort=newest`}
                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sort === 'newest' ? 'text-brand-red font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                    সর্বশেষ
                                </Link>
                                <Link 
                                    href={`/search?q=${query}&category=${category}&date=${dateRange}&sort=relevance`}
                                    className={`block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${sort === 'relevance' ? 'text-brand-red font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                    প্রাসঙ্গিকতা
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {results.length > 0 ? (
                    <div className="space-y-8">
                        {results.map(article => (
                            <Link 
                                key={article.id}
                                href={`/article/${article.id}`}
                                className="group flex flex-col md:flex-row gap-4 md:gap-6"
                            >
                                <div className="w-full md:w-56 aspect-4/3 relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                                    <Image 
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-brand-red uppercase">
                                            {CATEGORY_MAP[article.category] || article.category}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {localizeTime(article.time)}
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white group-hover:text-brand-red leading-tight mb-2 transition-colors">
                                        <HighlightText text={article.title} highlight={query} />
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                                        <HighlightText text={article.summary || ''} highlight={query} />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-2 font-bold">দুঃখিত, কোনো খবর পাওয়া যায়নি</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">বানান সঠিক কিনা যাচাই করুন অথবা অন্য শব্দ দিয়ে খুঁজুন</p>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
}
