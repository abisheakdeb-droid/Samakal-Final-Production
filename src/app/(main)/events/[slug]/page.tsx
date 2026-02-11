import { fetchEventBySlug } from "@/lib/actions-event";
import { fetchArticlesByEvent } from "@/lib/actions-article";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com",
    ),
    title: `${event.title} | Samakal`,
    description:
      event.description || `Updates and news coverage for ${event.title}`,
    openGraph: {
      images: event.banner_image ? [event.banner_image] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const articles = await fetchArticlesByEvent(event.id, 50); // Fetch more for detail page

  return (
    <main className="min-h-screen bg-slate-50 font-serif">
      {/* Event Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-[1280px]">
          {/* Breadcrumb */}
          <div className="py-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-red-600 text-sm flex items-center gap-1 w-fit"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="pb-8 md:pb-12">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Special Coverage
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed md:w-3/4">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Image if exists */}
      {event.banner_image && (
        <div className="container mx-auto px-4 max-w-[1280px] -mt-8 mb-12">
          <div className="relative aspect-3/1 md:aspect-4/1 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src={event.banner_image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-8 mb-20 max-w-[1280px]">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Calendar className="text-red-600" /> Latest Updates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.category}/${article.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold text-gray-900 shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-2 line-clamp-3">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-50">
                  <span>{article.time}</span>
                  <span>{article.author}</span>
                </div>
              </div>
            </Link>
          ))}

          {articles.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-lg">No updates published yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
