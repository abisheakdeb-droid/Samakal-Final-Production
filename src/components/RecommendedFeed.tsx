import { fetchRecommendedArticles } from "@/lib/actions-recommendations";
import { NewsItem } from "@/types/news";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default async function RecommendedFeed() {
  const articles = await fetchRecommendedArticles(4);

  if (articles.length === 0) return null;

  return (
    <div className="w-full bg-linear-to-r from-red-50 to-white border-y border-red-100 py-6 mb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-2 mb-4 text-brand-red">
          <Sparkles size={20} className="animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900">
            আপনার জন্য নির্বাচিত
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article: NewsItem) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block bg-white border border-red-50 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-video">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-brand-red text-white text-[10px] px-2 py-0.5 rounded">
                  {article.category}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-red">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {article.author} • {article.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
