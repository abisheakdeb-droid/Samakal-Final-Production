import { fetchAuthorProfile } from "@/lib/actions-user";
import { fetchArticlesByAuthor } from "@/lib/actions-article";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Mail,
  MapPin,
  User,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

export const metadata = {
  title: "Author Profile | Samakal",
  description: "Author details and articles.",
};

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const authorId = resolvedParams.id;

  const [author, articles] = await Promise.all([
    fetchAuthorProfile(authorId),
    fetchArticlesByAuthor(authorId),
  ]);

  if (!author) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-serif">
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Profile Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-gray-200 shrink-0">
            <Image
              src={
                author.avatar ||
                `https://randomuser.me/api/portraits/men/${(author.name.length % 50) + 1}.jpg`
              }
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {author.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 text-gray-500 mb-6 font-sans text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                {author.role === "admin" ? "সিনিয়র রিপোর্টার" : "কন্ট্রিবিউটর"}
              </span>
              {/* Fake location for demo if not in DB */}
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <MapPin size={14} /> ঢাকা, বাংলাদেশ
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <Calendar size={14} /> যোগ দিয়েছেন:{" "}
                {new Date().toLocaleDateString("bn-BD", { year: "numeric" })}
              </span>
            </div>

            <p className="text-gray-600 max-w-2xl leading-relaxed mb-6 font-sans">
              সমকাল পত্রিকার একজন নিবেদিত সাংবাদিক। রাজনীতি, অর্থনীতি এবং
              সমসাময়িক বিষয়ে নিয়মিত লেখালেখি করেন। সত্য ও ন্যায়ের পথে অবিচল থেকে
              সংবাদ পরিবেশনই মূল লক্ষ্য।
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 bg-brand-red text-white rounded">
            <Copy size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            প্রকাশিত সংবাদসমূহ{" "}
            <span className="text-gray-400 font-normal text-lg">
              ({articles.length})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group block bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-brand-red/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-bold">
                  {article.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-brand-red line-clamp-2 mb-3">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-4 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{article.time}</span>
                  </div>
                  <span className="text-brand-red font-medium group-hover:underline">
                    পড়ুন
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400">কোন নিউজ পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </main>
  );
}
