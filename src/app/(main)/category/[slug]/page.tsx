import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticlesByCategory } from "@/lib/actions-article";
import { formatBanglaDateTime } from "@/lib/utils";
import NewsActionButtons from "@/components/NewsActionButtons";

// টাইপ সেফটির জন্য হেল্পার ফাংশন (যাতে আর এরর না দেয়)
const getSafeDate = (news: any) => {
  return news.publishedAt || news.createdAt || new Date();
};

const getSafeAuthor = (news: any) => {
  return news.author || "সমকাল প্রতিবেদক";
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // মেটাডাটা লজিক (যা আপনার ছিল)
  return {
    title: `${decodeURIComponent(slug).toUpperCase()} | সমকাল`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // আপনার ডাটা ফেচিং ফাংশন (নাম ভিন্ন হলে ঠিক করে নেবেন)
  const categoryData = await fetchArticlesByCategory(slug);

  if (!categoryData || categoryData.length === 0) {
    return notFound();
  }

  // প্রথম নিউজ (বড় করে দেখানোর জন্য)
  const primeBig = categoryData[0];
  // বাকি নিউজ
  const otherNews = categoryData.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ব্রেডক্রাম্ব */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">হোম</Link>
        <span>/</span>
        <span className="text-red-600 font-medium capitalize">
          {decodeURIComponent(slug)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* বাম পাশ - মেইন কন্টেন্ট (৯ কলাম) */}
        <div className="lg:col-span-9">

          {/* ১. প্রধান খবর (Prime Big) */}
          {primeBig && (
            <div className="mb-10 group">
              <Link href={`/article/${primeBig.id}/${primeBig.slug || 'news'}`}>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={primeBig.image || "/placeholder.jpg"}
                    alt={primeBig.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h1 className="mt-4 text-3xl font-bold leading-tight group-hover:text-red-600 transition-colors">
                  {primeBig.title}
                </h1>
              </Link>

              <div className="flex items-center justify-between mt-4 border-b pb-4 border-gray-100">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  {getSafeAuthor(primeBig)} • {formatBanglaDateTime(getSafeDate(primeBig))}
                </span>
                <NewsActionButtons
                  title={primeBig.title}
                  url={`/article/${primeBig.id}/${primeBig.slug || 'news'}`}
                />
              </div>
            </div>
          )}

          {/* ২. বাকি খবরের তালিকা (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {otherNews.map((news: any) => (
              <Link
                key={news.id}
                href={`/article/${news.id}/${news.slug || 'news'}`}
                className="group flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={news.image || "/placeholder.jpg"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {news.summary || news.content?.substring(0, 100)}...
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span>{formatBanglaDateTime(getSafeDate(news))}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ডান পাশ - সাইডবার / বিজ্ঞাপন (৩ কলাম) */}
        <div className="lg:col-span-3 space-y-8">
          {/* এখানে আপনার সাইডবার কম্পোনেন্ট বসাতে পারেন */}
          <div className="bg-gray-50 p-4 rounded text-center text-gray-400 text-sm">
            বিজ্ঞাপন
          </div>
        </div>
      </div>
    </div>
  );
}
