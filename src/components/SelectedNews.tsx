"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types/news";

interface SelectedNewsProps {
  news: NewsItem[];
}

export default function SelectedNews({ news }: SelectedNewsProps) {
  if (!news || news.length === 0) return null;

  // Split: First 5 for Left Bento, Next 5 for Right List
  const bentoNews = news.slice(0, 5);
  const listNews = news.slice(5, 10);

  // Bento Main Item (Index 0)
  const mainBento = bentoNews[0];
  // Bento Sub Items (Index 1-4)
  const subBento = bentoNews.slice(1, 5);

  return (
    <section className="bg-gray-50 py-12 border-y border-gray-200 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1.5 h-8 bg-brand-red rounded-full"></span>
          <h2 className="text-3xl font-bold text-gray-900">নির্বাচিত খবর</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: BENTO GRID (5 Items) - Span 7 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
              {/* Main Item - Takes 2 columns, 2 rows */}
              {mainBento && (
                <Link
                  href={`/article/${mainBento.id}`}
                  className="col-span-2 row-span-2 relative rounded-lg overflow-hidden group"
                >
                  <Image
                    src={mainBento.image}
                    alt={mainBento.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                    <span className="bg-brand-red text-white text-xs px-2 py-1 rounded w-fit mb-2">
                      {mainBento.category}
                    </span>
                    <h2 className="text-white text-lg md:text-xl font-bold leading-tight group-hover:text-red-200 transition-colors">
                      {mainBento.title}
                    </h2>
                  </div>
                </Link>
              )}

              {/* 4 Sub Items - Each takes 1 column, 1 row */}
              {subBento.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="relative rounded-lg overflow-hidden group bg-white border border-gray-100"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-2 md:p-3 flex flex-col justify-end">
                    <h3 className="text-white text-xs md:text-sm font-bold leading-snug line-clamp-2 md:line-clamp-3 group-hover:text-red-200">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: LIST (5 Items) - Span 5 */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {listNews.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="group flex gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all items-center"
              >
                <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-brand-red line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {item.time || item.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
