import Link from "next/link";
import Image from "next/image";

import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { generateBlurPlaceholder } from "@/utils/image";

interface Article {
  id: string;
  title: string;
  summary?: string;
  image: string;
  date: string;
  author?: string | { name: string };
}

interface CategorySectionProps {
  label: string;
  slug: string;
  news: Article[];
}

export default function CategorySection({ label, slug, news }: CategorySectionProps) {
  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 6);

  // Helper for Bengali relative time
  const timeAgo = (dateStr: string) => {
    try {
        if (!dateStr) return "";
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: bn });
    } catch {
      return "";
    }
  };

  return (
    <section className="py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            <div className="flex items-center gap-3">
                <span className="w-2 h-6 bg-brand-red rounded-sm"></span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</h2>
            </div>
            <Link 
                href={`/category/${slug}`} 
                className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-red transition-colors"
            >
                সব দেখুন 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right dark:text-gray-400"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Featured Article (Left - 50%) */}
            <div className="group h-full">
                <Link href={`/article/${mainNews.id}`} className="group h-full flex flex-col">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 shrink-0">
                        <Image 
                            src={mainNews.image} 
                            alt={mainNews.title} 
                            fill 
                            placeholder="blur"
                            blurDataURL={generateBlurPlaceholder(16, 9)}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                         <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-3 flex flex-col grow">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-brand-red transition-colors">
                            {mainNews.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-lg leading-relaxed">
                            {mainNews.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500 mt-auto pt-2">
                             <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {typeof mainNews.author === 'string' ? mainNews.author : (mainNews.author as { name: string })?.name}
                             </span>
                             <span>{timeAgo(mainNews.date)}</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* 2x2 Grid (Right - 50%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-content-start">
                {sideNews.slice(0, 4).map((item) => (
                    <Link key={item.id} href={`/article/${item.id}`} className="group flex flex-col h-full">
                        <div className="aspect-video relative overflow-hidden rounded-lg mb-4 shrink-0">
                            <Image 
                                src={item.image} 
                                alt={item.title} 
                                fill 
                                placeholder="blur"
                                blurDataURL={generateBlurPlaceholder(16, 9)}
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col grow">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-normal group-hover:text-brand-red line-clamp-3 mb-2">
                                {item.title}
                            </h4>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-auto">{timeAgo(item.date)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
}
