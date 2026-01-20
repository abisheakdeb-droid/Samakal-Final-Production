import Link from "next/link";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";

export default function CategoryPage() {
  const categoryName = "রাজনীতি"; // In real app, this comes from params

  return (
    <div className="min-h-screen bg-background text-foreground font-serif">
      <Header />
      <BreakingTicker />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
           <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
           <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
           <span className="text-gray-400 text-sm mt-2 ml-auto">মোট ২০টি সংবাদ</span>
        </div>

        {/* Featured Story for Category */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
           <div className="lg:col-span-8 group cursor-pointer">
              <div className="aspect-video bg-gray-100 rounded-xl relative overflow-hidden mb-4">
                 <div className="absolute inset-0 bg-gray-300"></div> {/* Image Placeholder */}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-brand-red mb-2">
                রাজনীতিতে নতুন মেরুকরণ: বড় দুই জোটের বৈঠক
              </h2>
              <p className="text-gray-600 line-clamp-2">
                নির্বাচন সামনে রেখে রাজনৈতিক অঙ্গন উত্তপ্ত হয়ে উঠেছে। গতকাল রাতে এক রুদ্ধদ্বার বৈঠকে দুই প্রধান জোটের নেতারা উপস্থিত ছিলেন...
              </p>
           </div>
           
           <div className="lg:col-span-4 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-4 last:border-0">
                   <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                   <div>
                      <h3 className="font-bold text-gray-800 leading-tight group-hover:text-brand-red">
                         তৃণমূল নেতাদের ক্ষোভ প্রশমনে কেন্দ্রের উদ্যোগ
                      </h3>
                      <span className="text-xs text-gray-500 mt-2 block">২ ঘণ্টা আগে</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                   <div className="w-full h-full bg-gray-200 hover:scale-105 transition-transform duration-500"></div>
                </div>
                <h3 className="text-lg font-bold leading-snug group-hover:text-brand-red">
                   সংসদ নির্বাচনের প্রস্তুতি নিয়ে ইসির বৈঠক আজ বিকেলে
                </h3>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                   <span>নিজস্ব প্রতিবেদক</span>
                   <span>৪ ঘণ্টা আগে</span>
                </div>
             </div>
           ))}
        </div>
        
        {/* Pagination/Load More */}
        <div className="mt-12 text-center">
           <button className="px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-brand-red hover:text-white transition">
             আরও সংবাদ দেখুন
           </button>
        </div>

      </main>
    </div>
  );
}
