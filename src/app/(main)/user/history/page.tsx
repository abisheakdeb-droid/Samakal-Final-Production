import { fetchReadingHistory } from "@/lib/actions-history";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, History } from "lucide-react";

export const metadata = {
  title: "Reading History | Samakal",
  description: "Your recently viewed articles",
};

export default async function ReadingHistoryPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/user/history");
  }

  const articles = await fetchReadingHistory();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <History size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">পড়ার ইতিহাস</h1>
          <p className="text-gray-500 text-sm mt-1">
            আপনার সাম্প্রতিক পড়া খবরগুলো এখানে সংরক্ষিত আছে
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            কোনো ইতিহাস পাওয়া যায়নি
          </h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            আপনি এখনো কোনো খবর পড়েননি। খবর পড়া শুরু করলে এখানে তালিকা দেখা যাবে।
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-brand-red text-white font-bold rounded hover:bg-red-700 transition"
          >
            খবর পড়ুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-video">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock size={10} />
                  {/* Assuming checking history logic returns a viewedAt or we use basic date. 
                                   For now using basic article date but ideally we'd show "Viewed X mins ago" if mapper supports it. 
                                   Since mapper is generic NewsItem, we might just stick to article date or basic display. 
                               */}
                  {article.date}
                </div>
                <div className="absolute bottom-2 right-2 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {article.category}
                </div>
              </div>
              <div className="p-4 flex flex-col grow">
                <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-red leading-snug">
                  {article.title}
                </h2>
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                  <span>{article.author}</span>
                  <span className="flex items-center gap-1">
                    বিস্তারিত পড়ুন &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
