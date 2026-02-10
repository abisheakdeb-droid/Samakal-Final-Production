import PhotoSlider from "@/components/PhotoSlider";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function PhotoPage() {
  return (
    <div className="min-h-screen bg-black text-white font-serif">
      {/* Hero Slider */}
      <section className="mb-12">
        <PhotoSlider />
      </section>

      <main className="container mx-auto px-4 pb-20">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <Camera size={32} className="text-red-500" />
          <h2 className="text-3xl font-bold text-white">সাম্প্রতিক অ্যালবাম</h2>
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "বাংলাদেশের প্রাকৃতিক সৌন্দর্য",
              author: "আলোকচিত্রী দল",
              cover: "1518770660439-4636190af475",
              grid: [
                "1496181133206-80ce9b88a853",
                "1550751827-4bd374c3f58b",
                "1611162617474-5b21e879e113",
                "1557992260-ec58e38d363c",
              ],
            },
            {
              id: 2,
              title: "শহুরে জীবন ও ব্যস্ততা",
              author: "নাগরিক চোখ",
              cover: "1449824913935-59a10b8d2000",
              grid: [
                "1486312338219-ce68d2c6f44d",
                "1542744173-8e7e53415bb0",
                "1521791136064-7986c2920216",
                "1573496359142-b8d87734a5a2",
              ],
            },
            {
              id: 3,
              title: "গ্রাম বাংলার উৎসব ও ঐতিহ্য",
              author: "মেঠো পথ",
              cover: "1540189549336-e6e99c3679fe",
              grid: [
                "1507525428034-b723cf961d3e",
                "1525547719571-a2d4ac8945e2",
                "1476514525535-07fb3b4ae5f1",
                "1469854523086-cc02fe5d8800",
              ],
            },
            {
              id: 4,
              title: "ঐতিহাসিক স্থাপনা ও স্মৃতি",
              author: "ইতিহাসের সাক্ষী",
              cover: "1577962917302-cd874c4e31d2",
              grid: [
                "1494178270175-e96de2971df9",
                "1550751827-4bd374c3f58b",
                "1611162617474-5b21e879e113",
                "1518770660439-4636190af475",
              ],
            },
            {
              id: 5,
              title: "ঋতু বৈচিত্র্য ও প্রকৃতি",
              author: "প্রকৃতি প্রেমী",
              cover: "1470071459604-8b5aa3d62f31",
              grid: [
                "1441974231531-c6227db76b6e",
                "1500534314209-a25ddb2bd429",
                "1506792006437-256b665541e2",
                "1426604966848-d7adac402bff",
              ],
            },
            {
              id: 6,
              title: "বন্যপ্রাণী ও সংরক্ষণ",
              author: "ওয়াইল্ডলাইফ ওয়াচ",
              cover: "1474511320723-9a56873867b5",
              grid: [
                "1484406566174-9ca0a1594e1f",
                "1535083783855-76ae62b2914e",
                "1456926631375-92c8ce872def",
                "1504006833117-8886a355efbf",
              ],
            },
            {
              id: 7,
              title: "নদীমাতৃক বাংলাদেশ",
              author: "জলধারা",
              cover: "1506905925346-21bda4d32df4",
              grid: [
                "1441974231531-c6227db76b6e",
                "1506792006437-256b665541e2",
                "1500534314209-a25ddb2bd429",
                "1470071459604-8b5aa3d62f31",
              ],
            },
            {
              id: 8,
              title: "রাজধানী ঢাকা: এক নজরে",
              author: "সিটি ফটোগ্রাফার",
              cover: "1480714378408-67cf0d13bc1b",
              grid: [
                "1449824913935-59a10b8d2000",
                "1486312338219-ce68d2c6f44d",
                "1521791136064-7986c2920216",
                "1542744173-8e7e53415bb0",
              ],
            },
            {
              id: 9,
              title: "পাহাড় ও সমুদ্র",
              author: "পর্যটক দৃষ্টি",
              cover: "1506905925346-21bda4d32df4",
              grid: [
                "1441974231531-c6227db76b6e",
                "1506792006437-256b665541e2",
                "1426604966848-d7adac402bff",
                "1500534314209-a25ddb2bd429",
              ],
            },
            {
              id: 10,
              title: "কৃষি ও কৃষক জীবন",
              author: "গ্রামীণ আলো",
              cover: "1464226184884-fa280b87c399",
              grid: [
                "1500534314209-a25ddb2bd429",
                "1540189549336-e6e99c3679fe",
                "1507525428034-b723cf961d3e",
                "1525547719571-a2d4ac8945e2",
              ],
            },
            {
              id: 11,
              title: "স্থাপত্যের বৈচিত্র্য",
              author: "আর্কিটেক্ট আই",
              cover: "1577962917302-cd874c4e31d2",
              grid: [
                "1494178270175-e96de2971df9",
                "1518770660439-4636190af475",
                "1496181133206-80ce9b88a853",
                "1611162617474-5b21e879e113",
              ],
            },
            {
              id: 12,
              title: "সাংস্কৃতিক অনুষ্ঠান ও মেলা",
              author: "উৎসব দর্পণ",
              cover: "1492684223066-81342ee5ff30",
              grid: [
                "1511671782779-c97d3d27a1d4",
                "1485846234645-a62644f84728",
                "1470225620780-dba8ba36b745",
                "1496337589254-7e19d01cec44",
              ],
            },
          ].map((album) => (
            <div
              key={album.id}
              className="group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all"
            >
              {/* Cover Container - Aspect Ratio 4:3 */}
              <div className="relative aspect-4/3 bg-gray-900 overflow-hidden rounded-xl mb-4">
                {/* 1. Main Cover Image (Visible by default, fades out on hover) */}
                <div className="absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10">
                  <Image
                    src={`https://images.unsplash.com/photo-${album.cover}?w=800&auto=format&fit=crop`}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* 2. Grid Animation (Hidden by default, reveals on hover) - 2x2 Grid */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 z-0">
                  {album.grid.map((photoId, subIdx) => (
                    <div
                      key={subIdx}
                      className="relative overflow-hidden border-[0.5px] border-black/10"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${photoId}?w=400&auto=format&fit=crop`}
                        alt="Grid Thumb"
                        fill
                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      />
                    </div>
                  ))}
                </div>

                {/* Badge (Always on top) */}
                <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg">
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    ১২টি ছবি
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-200 group-hover:text-red-500 transition-colors mb-2">
                {album.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Camera size={14} />
                <span>{album.author}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
