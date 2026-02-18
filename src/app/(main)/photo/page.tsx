import PhotoSlider from "@/components/PhotoSlider";
import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchPhotoAlbums } from "@/lib/actions-media";

export default async function PhotoPage() {
  const albums = await fetchPhotoAlbums(20);

  // Map real albums to slider format
  const sliderPhotos = albums.slice(0, 5).map((album) => ({
    id: album.id,
    slug: album.slug,
    url: album.cover_image,
    title: album.title,
    photographer:
      album.images[0]?.photographer || album.author_name || "সমকাল ডেস্ক",
    location: "বাংলাদেশ",
  }));

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Hero Slider */}
      <section className="mb-12">
        <PhotoSlider photos={sliderPhotos} />
      </section>

      <main className="container mx-auto px-4 pb-20">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <Camera size={32} className="text-red-500" />
          <h2 className="text-3xl font-bold text-white">সাম্প্রতিক অ্যালবাম</h2>
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/article/${album.id}`}
              className="group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all"
            >
              {/* Cover Container - Aspect Ratio 4:3 */}
              <div className="relative aspect-4/3 bg-gray-900 overflow-hidden rounded-xl mb-4">
                {/* Calcular imágenes únicas fuera del JSX para reutilizar */}
                {(() => {
                  const uniqueImages = album.images
                    .map(img => img.image_url)
                    .filter((url, index, self) => url && self.indexOf(url) === index && url !== album.cover_image);

                  const hasGrid = uniqueImages.length >= 1;

                  return (
                    <>
                      {/* 1. Main Cover Image — solo se desvanece si hay grid detrás */}
                      <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out z-10 ${hasGrid ? 'group-hover:opacity-0' : ''}`}>
                        <Image
                          src={album.cover_image || "/placeholder.svg"}
                          alt={album.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      {/* 2. Grid Animation (Hidden by default, reveals on hover) - 2x2 Grid */}
                      {hasGrid && (() => {
                        const displayImages = [album.cover_image, ...uniqueImages].slice(0, 4);
                        while (displayImages.length < 4) displayImages.push(album.cover_image);

                        return (
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 z-0">
                            {displayImages.map((url, subIdx) => (
                              <div
                                key={subIdx}
                                className="relative overflow-hidden border-[0.5px] border-black/10"
                              >
                                <Image
                                  src={url || "/placeholder.svg"}
                                  alt="Grid Thumb"
                                  fill
                                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </>
                  );
                })()}

                {/* Badge (Always on top) */}
                <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg">
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    {album.images.length > 0
                      ? `${album.images.length}টি ছবি`
                      : "গ্যালারি"}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-200 group-hover:text-red-500 transition-colors mb-2 line-clamp-2">
                {album.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Camera size={14} />
                <span>
                  {album.images[0]?.photographer ||
                    album.author_name ||
                    "সমকাল ডেস্ক"}
                </span>
              </div>
            </Link>
          ))}

          {albums.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-gray-800 rounded-2xl">
              <Camera size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">কোন অ্যালবাম পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </main >
    </div >
  );
}
