"use client";

import ShareButtons from "@/components/ShareButtons";
import BookmarkButton from "@/components/BookmarkButton";
import CommentSection from "@/components/CommentSection";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  ImageIcon,
  Printer,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatBanglaTime } from "@/lib/utils";
import { generateBlurPlaceholder } from "@/utils/image";
import HistoryTracker from "@/components/HistoryTracker";
import ImageLightbox from "@/components/ImageLightbox";
import { toast } from "sonner";
import { NewsItem } from "@/types/news";
import ScrollReveal from "@/components/ScrollReveal";

interface ArticleComment {
  id: string;
  content: string;
  author: string;
  avatar?: string;
  created_at: string;
  timeAgo: string;
}

interface ArticleContentProps {
  article: NewsItem;
  authorNews: NewsItem[];
  relatedNews: NewsItem[];
  comments?: ArticleComment[];
  currentUser?: { id: string; name?: string | null; image?: string | null };
}

export default function ArticleContent({
  article,
  authorNews,
  relatedNews,
  comments,
  currentUser,
}: ArticleContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Collect all images for lightbox (featured + gallery)
  const allImages = [
    ...(article.image ? [article.image] : []),
    ...(article.images?.map((img) => img.url) || []),
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("dompurify").then((DOMPurify) => {
        const clean = DOMPurify.default.sanitize(article.content || "", {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
        });
        setSanitizedContent(clean);
      });
    }
  }, [article.content]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/article/${article.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("লিংক কপি করা হয়েছে");
  };

  return (
    <div className="bg-background text-foreground font-serif">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-brand-red transition">
          হোম
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/category/${article.category}`}
          className="hover:text-brand-red transition"
        >
          {article.category}
        </Link>
      </nav>

      {/* Article Title */}
      <ScrollReveal>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Sub-headline (if exists) */}
        {article.sub_headline && (
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {article.sub_headline}
          </p>
        )}
      </ScrollReveal>

      {/* Font Size Control */}
      {/* Font Size Control Removed */}
      {/* <div className="flex justify-end mb-6">
               <FontSizeToggle />
            </div> */}

      {/* Author & Meta */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-b border-gray-100 dark:border-gray-800 py-4 mb-8 gap-6">
        {/* Author Info */}
        <div className="flex items-center gap-4">
          {/* Author Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
            <Image
              src={`https://randomuser.me/api/portraits/men/${(article.title.length % 50) + 1}.jpg`}
              alt={article.author || "Reporter"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-gray-200">
              {article.author || "স্টাফ রিপোর্টার"}
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {article.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {article.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatBanglaTime(article.published_at || article.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Share Button Group (Top) */}
        <div className="flex items-center gap-3">
          <ShareButtons title={article.title} slug={article.slug} />

          <BookmarkButton
            articleId={article.id}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          />

          <button
            onClick={handlePrint}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="প্রিন্ট করুন"
          >
            <Printer size={20} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="লিংক কপি করুন"
          >
            <LinkIcon size={20} />
          </button>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <ScrollReveal>
          <div
            className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow duration-300"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              placeholder="blur"
              blurDataURL={generateBlurPlaceholder(16, 9)}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            {/* Click hint overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-white/90 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-bold text-gray-800">
                  ছবি বড় করে দেখুন
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Article Body */}
      <ScrollReveal>
        <article
          className="article-content prose prose-lg max-w-none w-full mb-6 text-justify prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </ScrollReveal>

      {/* Bottom Share Section */}
      <div className="w-full border-t border-gray-100 dark:border-gray-800 mt-4 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 rounded-xl">
          <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
            শেয়ার / সংরক্ষণ:
          </span>
          <div className="flex items-center gap-3">
            <ShareButtons title={article.title} slug={article.slug} />

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

            <BookmarkButton
              articleId={article.id}
              showText
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-red hover:bg-brand-red/5 text-gray-600 hover:text-brand-red transition-all font-medium text-sm"
            />

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-red hover:bg-brand-red/5 text-gray-600 dark:text-gray-400 hover:text-brand-red transition-all font-medium text-sm"
              title="প্রিন্ট করুন"
            >
              <Printer size={18} />
              <span>প্রিন্ট</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-red hover:bg-brand-red/5 text-gray-600 dark:text-gray-400 hover:text-brand-red transition-all font-medium text-sm"
              title="লিংক কপি করুন"
            >
              <LinkIcon size={18} />
              <span>কপি</span>
            </button>
          </div>
        </div>
      </div>

      {/* ... Rest of interactions */}

      {/* Comment Section */}
      <div className="w-full">
        <CommentSection
          articleId={article.id}
          initialComments={comments || []}
          currentUser={currentUser}
        />
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* --- GALLERY SECTION (NEW) --- */}
      {article.images && article.images.length > 0 && (
        <ScrollReveal>
          <div className="w-full my-12">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="text-brand-red" size={24} />
              ফটো গ্যালারি
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-4/3 rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => {
                    setLightboxIndex((article.image ? 1 : 0) + idx);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || "Gallery Image"}
                    fill
                    placeholder="blur"
                    blurDataURL={generateBlurPlaceholder(4, 3)}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs">
                      {img.caption}
                    </div>
                  )}
                  {/* Click hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ImageIcon
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={48}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* --- AUTHOR'S POPULAR NEWS SUB-SECTION --- */}
      {authorNews.length > 0 && (
        <ScrollReveal>
          <div className="mt-16 mb-12 w-full">
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
                  <Image
                    src={`https://randomuser.me/api/portraits/men/${(article.title.length % 50) + 1}.jpg`}
                    alt="Author"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    এই প্রতিবেদকের আরও খবর
                  </h3>
                  <div className="h-0.5 w-full bg-gray-200 mt-1 relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-brand-red"></div>
                  </div>
                </div>
              </div>

              {/* Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="relative group/slider">
              <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar scroll-smooth snap-x"
              >
                {authorNews.slice(0, 10).map((news) => (
                  <Link
                    key={news.id}
                    href={`/article/${news.id}`}
                    className="shrink-0 w-[85vw] sm:w-[320px] md:w-[280px] lg:w-[300px] snap-start flex items-start gap-4 p-3 rounded-lg border-r border-gray-100 last:border-0 hover:bg-white hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 relative overflow-hidden rounded-md shrink-0 bg-gray-100 mt-1">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-brand-red line-clamp-2 leading-snug transition-colors mb-1">
                        {news.title}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {formatBanglaTime(news.published_at || news.date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Tags (Dynamic) */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-brand-red transition cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* RELATED NEWS SECTION (8 Items) */}
      {relatedNews.length > 0 && (
        <ScrollReveal>
          <div className="mt-16 pt-12 border-t-4 border-gray-900">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-brand-red rounded"></span>
              আরও পড়ুন
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/article/${news.id}`}
                  className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      placeholder="blur"
                      blurDataURL={generateBlurPlaceholder(16, 9)}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-brand-red text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 text-lg leading-snug group-hover:text-brand-red line-clamp-2 mb-2">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <Clock size={12} />
                      <span>{news.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      <HistoryTracker articleId={article.id} />
    </div>
  );
}
