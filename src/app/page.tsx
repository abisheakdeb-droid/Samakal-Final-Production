import Link from "next/link";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import NumberedList from "@/components/NumberedList";
import HeroCard from "@/components/HeroCard";

export default function Home() {
  return (
    <main className="min-h-screen pb-20 bg-background text-foreground font-serif">
      <Header />
      <BreakingTicker />

      {/* Main Grid: The heart of the layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-x-0 lg:divide-x divide-gray-100">
          
          {/* Column 1: Latest News (Width 3) - Order 2 on Mobile, Order 1 on Desktop */}
          <div className="lg:col-span-3 lg:pr-6 order-2 lg:order-1">
            <NumberedList />
          </div>

          {/* Column 2: Hero & Feature Stories (Width 6) - Order 1 on Mobile, Order 2 on Desktop */}
          <div className="lg:col-span-6 lg:px-6 order-1 lg:order-2">
            <HeroCard />
            
            {/* Sub-grid of smaller standard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-gray-100">
               {[1, 2].map((i) => (
                 <div key={i} className="group">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                       {/* Placeholder for standard card image */}
                       <div className="absolute inset-0 bg-gray-200 animate-pulse group-hover:bg-gray-300 transition-colors"></div>
                    </div>
                    <h3 className="text-xl font-bold leading-snug group-hover:text-brand-red transition-colors">
                      বিশ্ববাজারে তেলের দাম কমলেও দেশে প্রভাব নেই কেন?
                    </h3>
                    <span className="text-sm text-gray-500 mt-2 block">বাণিজ্য • ৩০ মিনিট আগে</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Column 3: Sidebar / Opinions (Width 3) - Order 3 on Mobile & Desktop */}
          <div className="lg:col-span-3 lg:pl-6 bg-gray-50/50 p-4 rounded-xl h-fit order-3">
            <div className="flex items-center gap-2 mb-4">
               <span className="w-1 h-6 bg-brand-orange rounded-full"></span>
               <h2 className="text-xl font-bold text-gray-800">মতামত</h2>
            </div>
            
            <div className="space-y-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
                       {/* Avatar Placeholder */}
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 leading-tight group-hover:text-brand-orange">
                         গণতন্ত্রের পুনরুদ্ধারে আমাদের করণীয়
                       </h4>
                       <p className="text-xs text-gray-500 font-medium mt-1">ড. আসিফ নজরুল</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
               <div className="flex items-center gap-2 mb-4">
                 <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                 <h2 className="text-xl font-bold text-red-600">সরাসরি</h2>
               </div>
               <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white relative overflow-hidden group cursor-pointer">
                  <span className="z-10 bg-white/20 backdrop-blur px-4 py-2 rounded-full font-bold flex items-center gap-2">
                     <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                     লাইভ দেখুন
                  </span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
