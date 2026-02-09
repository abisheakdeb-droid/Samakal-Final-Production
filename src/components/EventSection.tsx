import Link from "next/link";
import Image from "next/image";
import { fetchActiveEvent } from "@/lib/actions-event";
import { fetchArticlesByEvent } from "@/lib/actions-article";
import { ArrowRight, Calendar } from "lucide-react";

export default async function EventSection() {
  const activeEvent = await fetchActiveEvent();

  // If no active event, don't render anything
  if (!activeEvent) {
    return null;
  }

  const articles = await fetchArticlesByEvent(activeEvent.id, 5);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 border-b border-gray-100 dark:border-gray-800 mb-8 w-full max-w-[1280px]">
      {/* Event Header / Banner */}
      <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-serif">
                   {activeEvent.title}
               </h2>
           </div>
           <Link 
              href={`/events/${activeEvent.slug}`} 
              className="group flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
           >
              আরও দেখুন 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
      </div>

      {/* Banner + Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Primary Banner / Featured Item */}
           <div className="lg:col-span-1 relative group overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900">
               {activeEvent.banner_image ? (
                   <Link href={`/events/${activeEvent.slug}`} className="block h-full relative aspect-[4/5] lg:aspect-auto min-h-[300px]">
                       <Image 
                          src={activeEvent.banner_image} 
                          alt={activeEvent.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                       <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-20">
                           <span className="inline-block px-2 py-1 bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-sm mb-2">
                               Event
                           </span>
                           <h3 className="text-white font-bold text-xl leading-tight font-serif">
                               {activeEvent.description || activeEvent.title}
                           </h3>
                       </div>
                   </Link>
               ) : (
                   <div className="h-full flex items-center justify-center p-8 text-center bg-red-50/50">
                       <div>
                           <Calendar size={48} className="text-red-300 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-red-900 font-serif">{activeEvent.title}</h3>
                           <Link href={`/events/${activeEvent.slug}`} className="mt-4 inline-block text-sm font-bold text-red-600 underline">
                               বিস্তারিত জানুন
                           </Link>
                       </div>
                   </div>
               )}
           </div>

           {/* Articles Grid (4 Items) */}
           <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {articles.slice(0, 4).map((article) => (
                   <Link key={article.id} href={`/${article.category}/${article.slug}`} className="group space-y-3">
                       <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                           <Image
                               src={article.image || '/placeholder.svg'}
                               alt={article.title}
                               fill
                               className="object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                       </div>
                       <div>
                           <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors leading-snug font-serif line-clamp-3">
                               {article.title}
                           </h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                               {article.time}
                           </p>
                       </div>
                   </Link>
               ))}
           </div>
      </div>
    </section>
  );
}
