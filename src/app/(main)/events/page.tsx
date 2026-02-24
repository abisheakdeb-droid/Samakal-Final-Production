import { fetchEvents } from "@/lib/actions-event";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

export const metadata = {
  title: 'All Events | Samakal',
  description: 'Special coverage and events from Samakal',
};

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main className="min-h-screen bg-slate-50 font-serif py-12">
       <div className="container mx-auto px-4 max-w-[1280px]">
           <div className="flex items-center gap-3 mb-12">
               <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
               <h1 className="text-3xl font-bold text-gray-900">All Events & Coverage</h1>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {events.map((event) => (
                   <Link key={event.id} href={`/events/${event.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all">
                       <div className="relative aspect-video bg-gray-100 overflow-hidden">
                           {event.banner_image ? (
                               <Image 
                                  src={event.banner_image} 
                                  alt={event.title}
                                  sizes="100vw"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                               />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">
                                   <Calendar size={48} />
                               </div>
                           )}
                           {event.is_active && (
                               <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
                                   Active
                               </div>
                           )}
                       </div>
                       <div className="p-6">
                           <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                               {event.title}
                           </h2>
                           <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                               {event.description || 'No description available'}
                           </p>
                           <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 font-medium font-sans uppercase tracking-wider">
                               <span>View Coverage</span>
                               <span>&rarr;</span>
                           </div>
                       </div>
                   </Link>
               ))}

               {events.length === 0 && (
                   <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-500 min-h-[40vh]">
                       <Calendar size={64} className="mb-6 opacity-30" />
                       <h2 className="text-2xl font-bold">কোন ইভেন্ট পাওয়া যাচ্ছে না</h2>
                       <p className="mt-2 text-gray-400">নতুন ইভেন্টের জন্য অপেক্ষা করুন</p>
                   </div>
               )}
           </div>
       </div>
    </main>
  );
}
