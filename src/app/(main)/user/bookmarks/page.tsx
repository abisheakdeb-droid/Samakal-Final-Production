import { fetchBookmarkedArticles } from "@/lib/actions-bookmark";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Trash2 } from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

export const metadata = {
  title: "Saved Articles | Samakal",
};

export default async function BookmarksPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/admin/login"); // Redirect to login
  }

  const savedArticles = await fetchBookmarkedArticles();

  return (
    <main className="min-h-screen bg-background text-foreground font-serif">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <span className="w-2 h-8 bg-brand-red rounded"></span>
            সংরক্ষিত সংবাদ ({savedArticles.length})
          </h1>
        </div>

        {savedArticles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Trash2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              কোনো সংরক্ষিত সংবাদ নেই
            </h2>
            <p className="text-gray-400 mb-6 font-sans">
              আপনি কোনো সংবাদ সংরক্ষণ করেননি।
            </p>
            <Link
              href="/"
              className="px-6 py-2 bg-brand-red text-white rounded font-bold hover:bg-red-700 transition"
            >
              খবর পড়ুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <Link
                  href={`/article/${article.id}`}
                  className="block relative aspect-video overflow-hidden"
                >
                  <Image
                    src={article.image as string}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <BookmarkButton
                      articleId={article.id}
                      initialIsBookmarked={true}
                    />
                  </div>
                  <Link href={`/article/${article.id}`}>
                    <h3 className="font-bold text-gray-900 leading-snug hover:text-brand-red transition line-clamp-2 mb-3">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
                    <Calendar size={12} />
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
