import VideoBentoGrid from "@/components/VideoBentoGrid";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchVideoArticles } from "@/lib/actions-media";
import { CATEGORY_MAP } from "@/config/categories";
import { NewsItem } from "@/types/news";

export default async function VideoPage() {
  const allVideos = await fetchVideoArticles(50);

  // Group videos by category
  const categoriesMap: Record<string, NewsItem[]> = {};
  allVideos.forEach((video) => {
    const cat = video.category || "অন্যান্য";
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(video);
  });

  const videoCategories = Object.entries(categoriesMap).map(
    ([cat, videos]) => ({
      title: CATEGORY_MAP[cat] || cat,
      slug: cat,
      color: "red",
      videos: videos.slice(0, 8),
    }),
  );

  // Map to bento format (first 4)
  const bentoVideos = allVideos.slice(0, 4).map((v, i) => ({
    id: v.id,
    title: v.title,
    image: v.image,
    category: CATEGORY_MAP[v.category] || v.category,
    duration: "০২:৩০",
    size: (i === 0 ? "large" : i === 3 ? "wide" : "medium") as
      | "large"
      | "medium"
      | "wide",
  }));
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-serif">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
            <PlayCircle size={24} className="text-white fill-white ml-1" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              সমকাল ভিডিও
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              সর্বশেষ সংবাদ, বিশ্লেষণ এবং বিনোদন
            </p>
          </div>
        </div>

        {/* Featured Bento Grid */}
        <section className="mb-16">
          <VideoBentoGrid videos={bentoVideos} />
        </section>

        {/* Categories Section */}
        <section className="space-y-12">
          {videoCategories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                <h2
                  className={`text-2xl font-bold text-red-500 border-l-4 border-red-500 pl-3`}
                >
                  {category.title}
                </h2>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-bold text-gray-500 hover:text-white transition"
                >
                  সব দেখুন
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {category.videos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/article/${video.id}`}
                    className="group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all text-left"
                  >
                    <div className="aspect-video bg-gray-900 rounded-lg mb-3 relative overflow-hidden">
                      <Image
                        src={video.image || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <PlayCircle
                            size={24}
                            className="text-white fill-white ml-0.5"
                          />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded font-bold">
                        ০২:৩০
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-bold text-gray-200 group-hover:text-red-400 transition line-clamp-2`}
                    >
                      {video.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {videoCategories.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
              <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">কোন ভিডিও পাওয়া যায়নি</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
