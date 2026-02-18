import { PlayCircle, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchVideoArticles } from "@/lib/actions-media";
import { fetchYouTubeVideos } from "@/lib/youtube";
import { CATEGORY_MAP } from "@/config/categories";
import { NewsItem } from "@/types/news";

export default async function VideoPage() {
  // Obtener videos de ambas fuentes en paralelo
  const [allVideos, youtubeVideos] = await Promise.all([
    fetchVideoArticles(50),
    fetchYouTubeVideos(15),
  ]);

  // Agrupar artículos con video por categoría
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
      videos: videos.slice(0, 8),
    }),
  );

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

        {/* YouTube Channel Section — ফিচারড ভিডিও */}
        {youtubeVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <Youtube size={24} className="text-red-500" />
                <h2 className="text-2xl font-bold text-red-500 border-l-4 border-red-500 pl-3">
                  ইউটিউব থেকে সর্বশেষ
                </h2>
              </div>
              <a
                href="https://www.youtube.com/@SamakalNews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-gray-500 hover:text-white transition flex items-center gap-1"
              >
                চ্যানেলে যান
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
              </a>
            </div>

            {/* Bento Grid para los primeros 4 videos de YouTube */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Video Principal (grande) */}
              {youtubeVideos[0] && (
                <a
                  href={youtubeVideos[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group lg:col-span-2 lg:row-span-2 cursor-pointer rounded-xl overflow-hidden relative"
                >
                  <div className="aspect-video lg:aspect-auto lg:h-full relative">
                    <Image
                      src={youtubeVideos[0].thumbnail}
                      alt={youtubeVideos[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                        <PlayCircle size={32} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition line-clamp-3">
                        {youtubeVideos[0].title}
                      </h3>
                    </div>
                  </div>
                </a>
              )}

              {/* Videos Secundarios */}
              {youtubeVideos.slice(1, 5).map((video) => (
                <a
                  key={video.id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer rounded-xl overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <PlayCircle size={24} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-900/50">
                    <h3 className="text-sm font-bold text-gray-200 group-hover:text-red-400 transition line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>

            {/* Remaining YouTube Videos — lista horizontal */}
            {youtubeVideos.length > 5 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {youtubeVideos.slice(5).map((video) => (
                  <a
                    key={video.id}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="aspect-video bg-gray-900 rounded-lg mb-2 relative overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <PlayCircle size={20} className="text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-gray-300 group-hover:text-red-400 transition line-clamp-2">
                      {video.title}
                    </h3>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Categories Section — Artículos con ভিডিও del DB */}
        {videoCategories.length > 0 && (
          <section className="space-y-12">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white border-l-4 border-white/30 pl-3">
                ভিডিও সহ সংবাদ
              </h2>
            </div>

            {videoCategories.map((category) => (
              <div key={category.title}>
                <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                  <h3
                    className="text-xl font-bold text-red-500 border-l-4 border-red-500 pl-3"
                  >
                    {category.title}
                  </h3>
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
                      </div>
                      <h3
                        className="text-sm font-bold text-gray-200 group-hover:text-red-400 transition line-clamp-2"
                      >
                        {video.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Estado vacío */}
        {videoCategories.length === 0 && youtubeVideos.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
            <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl">কোন ভিডিও পাওয়া যায়নি</p>
          </div>
        )}
      </main>
    </div>
  );
}
