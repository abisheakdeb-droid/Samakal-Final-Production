import Image from "next/image";
import Link from "next/link";
import { Clock, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import Header from "@/components/Header";
import NumberedList from "@/components/NumberedList";

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-serif">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* Main Article Content (Width 8) */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-brand-red">হোম</Link>
              <span>/</span>
              <Link href="#" className="hover:text-brand-red">জাতীয়</Link>
              <span>/</span>
              <span className="text-gray-800">রাজনীতি</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              রাষ্ট্র সংস্কারে অন্তর্বর্তী সরকারের রোডম্যাপ ঘোষণা: ৬ কমিশনের রূপরেখা চূড়ান্ত
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-bold text-gray-900">নিজস্ব প্রতিবেদক</p>
                    <p className="text-sm text-gray-500">ঢাকা</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1"><Clock size={16}/> ২ ঘণ্টা আগে</span>
               </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8">
               <Image 
                 src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2532&auto=format&fit=crop"
                 alt="Article Feature"
                 fill
                 className="object-cover"
               />
               <p className="absolute bottom-0 w-full bg-black/60 text-white text-xs p-2 text-center">
                 ফাইল ছবি
               </p>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-5px]">
                দীর্ঘ প্রতীক্ষার পর অবশেষে রাষ্ট্র সংস্কারের পূর্ণাঙ্গ রূপরেখা ঘোষণা করেছে অন্তর্বর্তী সরকার। আজ বিকেলে এক সংবাদ সম্মেলনে প্রধান উপদেষ্টা এ ঘোষণা দেন। তিনি জানান, আগামী তিন মাসের মধ্যে সংবিধান, বিচার বিভাগ ও পুলিশ প্রশাসনে আমূল পরিবর্তন আনা হবে।
              </p>
              <p>
                প্রধান উপদেষ্টা বলেন, "জনগণের ম্যান্ডেট নিয়ে আমরা এসেছি। আমাদের মূল লক্ষ্য একটি বৈষম্যহীন রাষ্ট্র গঠন করা।" তিনি আরও বলেন, বিগত দিনের জঞ্জাল পরিষ্কার করতে সময় প্রয়োজন হলেও সরকার দ্রুততম সময়ে দৃশ্যমান পরিবর্তন আনতে বদ্ধপরিকর।
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-8">কমিশনের কার্যপরিধি</h3>
              <p>
                নতুন গঠিত ৬টি কমিশন আগামী ১৹ অক্টোবর থেকে কাজ শুরু করবে। প্রতিটি কমিশনকে ৯০ দিনের মধ্যে প্রতিবেদন জমা দিতে বলা হয়েছে। এরপর রাজনৈতিক দলগুলোর সাথে সংলাপের মাধ্যমে চূড়ান্ত সিদ্ধান্ত নেওয়া হবে। কমিশনগুলোর নেতৃত্ব দেবেন দেশের বিশিষ্ট নাগরিকরা।
              </p>
              <div className="bg-gray-50 p-6 border-l-4 border-brand-red my-8 italic text-gray-700">
                "আমরা কোনো রাজনৈতিক দলের এজেন্ডা বাস্তবায়ন করতে আসিনি। আমাদের এজেন্ডা একটাই - বাংলাদেশ।" - প্রধান উপদেষ্টা
              </div>
              <p>
                এদিকে সরকারের এই ঘোষণাকে স্বাগত জানিয়েছে বিভিন্ন রাজনৈতিক দল ও সুশীল সমাজ। তারা বলছেন, এটি দেশের রাজনীতির ইতিহাসে একটি মাইলফলক হয়ে থাকবে।
              </p>
            </div>

            {/* Share Footer */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
               <span className="font-bold text-gray-900">শেয়ার করুন:</span>
               <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"><Facebook size={20}/></button>
               <button className="p-2 rounded-full bg-sky-100 text-sky-500 hover:bg-sky-200"><Twitter size={20}/></button>
               <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"><LinkIcon size={20}/></button>
            </div>

          </article>

          {/* Sidebar (Width 4) */}
          <aside className="lg:col-span-4 pl-0 lg:pl-8 space-y-8">
             <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <NumberedList />
             </div>
             
             {/* Ad Placeholder */}
             <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg border border-dashed border-gray-300">
                বিজ্ঞাপন
             </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
