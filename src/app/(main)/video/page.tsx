import VideoBentoGrid from "@/components/VideoBentoGrid";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

// Mock Video Data
const VIDEO_CATEGORIES = [
  {
    title: "জাতীয় ও রাজনীতি",
    color: "red",
    videos: [
      {
        id: "pol-1",
        title: "প্রধানমন্ত্রীর সংবাদ সম্মেলন: বিস্তারিত আলোচনা",
        duration: "১২:৩৫",
        thumb: "1517048430219-bd3cbda4784b",
      },
      {
        id: "pol-2",
        title: "সংসদে বাজেট উপস্থাপন ২০২৬",
        duration: "০৮:২০",
        thumb: "1577962917302-cd874c4e31d2",
      },
      {
        id: "pol-3",
        title: "নির্বাচন কমিশনের নতুন ঘোষণা",
        duration: "০৫:৪৫",
        thumb: "1518770660439-4636190af475",
      },
      {
        id: "pol-4",
        title: "রাজনৈতিক সংলাপ: সর্বশেষ আপডেট",
        duration: "০৯:১০",
        thumb: "1496181133206-80ce9b88a853",
      },
      {
        id: "pol-5",
        title: "মন্ত্রিসভার বৈঠকে গুরুত্বপূর্ণ সিদ্ধান্ত",
        duration: "০৭:৫৫",
        thumb: "1494178270175-e96de2971df9",
      },
      {
        id: "pol-6",
        title: "সংসদীয় কমিটির শুনানি",
        duration: "১১:২০",
        thumb: "1550751827-4bd374c3f58b",
      },
      {
        id: "pol-7",
        title: "রাজনৈতিক দলের সমাবেশ",
        duration: "০৬:৩০",
        thumb: "1611162617474-5b21e879e113",
      },
      {
        id: "pol-8",
        title: "স্থানীয় সরকার নির্বাচন প্রস্তুতি",
        duration: "০৮:৪৫",
        thumb: "1557992260-ec58e38d363c",
      },
    ],
  },
  {
    title: "বিনোদন ও শোবিজ",
    color: "purple",
    videos: [
      {
        id: "ent-1",
        title: "নতুন সিনেমার গানে ঢাকার দর্শকরা মাতোয়ারা",
        duration: "০৪:৩০",
        thumb: "1492684223066-81342ee5ff30",
      },
      {
        id: "ent-2",
        title: "পুরস্কার প্রদান অনুষ্ঠান ২০২৬ হাইলাইটস",
        duration: "১০:২৫",
        thumb: "1511671782779-c97d3d27a1d4",
      },
      {
        id: "ent-3",
        title: "বলিউডের সঙ্গে ঢালিউডের নতুন সহযোগিতা",
        duration: "০৬:৫০",
        thumb: "1485846234645-a62644f84728",
      },
      {
        id: "ent-4",
        title: "সঙ্গীত উৎসব: লাইভ পারফরম্যান্স",
        duration: "০৮:৪০",
        thumb: "1470225620780-dba8ba36b745",
      },
      {
        id: "ent-5",
        title: "নাটকের শুটিং এ তারকাদের আড্ডা",
        duration: "০৫:১৫",
        thumb: "1496337589254-7e19d01cec44",
      },
      {
        id: "ent-6",
        title: "ফ্যাশন শো: নতুন ট্রেন্ড",
        duration: "০৭:২৫",
        thumb: "1492841461420-d3302f38ff4d",
      },
      {
        id: "ent-7",
        title: "সেলিব্রিটি সাক্ষাৎকার: একান্ত আলাপ",
        duration: "১২:১০",
        thumb: "1511671782779-c97d3d27a1d4",
      },
      {
        id: "ent-8",
        title: "কনসার্টের মঞ্চ পেছনের গল্প",
        duration: "০৬:০০",
        thumb: "1485846234645-a62644f84728",
      },
    ],
  },
  {
    title: "খেলাধুলা",
    color: "green",
    videos: [
      {
        id: "spt-1",
        title: "বিশ্বকাপ ক্রিকেট: বাংলাদেশের নাটকীয় জয়",
        duration: "০৭:২০",
        thumb: "1531415074968-036ba1b575da",
      },
      {
        id: "spt-2",
        title: "ফুটবল লীগ: রোমাঞ্চকর ফাইনাল ম্যাচ",
        duration: "১১:৫৫",
        thumb: "1517649763962-0c623066013b",
      },
      {
        id: "spt-3",
        title: "অলিম্পিক প্রস্তুতি: ক্রীড়াবিদদের সাক্ষাৎকার",
        duration: "০৬:১৫",
        thumb: "1461896836934-ee0b8f2f137a",
      },
      {
        id: "spt-4",
        title: "হকি চ্যাম্পিয়নশিপ হাইলাইটস",
        duration: "০৫:৩০",
        thumb: "1579952363873-c0b60e013196",
      },
      {
        id: "spt-5",
        title: "টেনিস টুর্নামেন্ট: সেমিফাইনাল",
        duration: "০৯:৪৫",
        thumb: "1554068865-4d376e5e1a1f",
      },
      {
        id: "spt-6",
        title: "ব্যাডমিন্টন: জাতীয় চ্যাম্পিয়নশিপ",
        duration: "০৭:৫৫",
        thumb: "1517649763962-0c623066013b",
      },
      {
        id: "spt-7",
        title: "দৌড় প্রতিযোগিতা: নতুন রেকর্ড",
        duration: "০৪:২০",
        thumb: "1461896836934-ee0b8f2f137a",
      },
      {
        id: "spt-8",
        title: "সাঁতার চ্যাম্পিয়নশিপ ফাইনাল",
        duration: "০৮:১০",
        thumb: "1531415074968-036ba1b575da",
      },
    ],
  },
  {
    title: "প্রযুক্তি",
    color: "blue",
    videos: [
      {
        id: "tech-1",
        title: "স্মার্ট বাংলাদেশ: ডিজিটাল রূপান্তর",
        duration: "০৯:৪৫",
        thumb: "1519389950473-47ba0277781c",
      },
      {
        id: "tech-2",
        title: "কৃত্রিম বুদ্ধিমত্তা: ভবিষ্যতের সম্ভাবনা",
        duration: "১২:১০",
        thumb: "1488590528505-98d2b5aba04b",
      },
      {
        id: "tech-3",
        title: "সাইবার নিরাপত্তা: সচেতনতা জরুরি",
        duration: "০৭:৩৫",
        thumb: "1461749280684-dccba630e2f6",
      },
      {
        id: "tech-4",
        title: "নতুন স্মার্টফোন রিভিউ ২০২৬",
        duration: "০৮:২০",
        thumb: "1550751827-4bd374c3f58b",
      },
      {
        id: "tech-5",
        title: "৫জি প্রযুক্তি: বাংলাদেশে আগমন",
        duration: "০৬:৫০",
        thumb: "1519389950473-47ba0277781c",
      },
      {
        id: "tech-6",
        title: "রোবটিক্স: শিল্পে বিপ্লব",
        duration: "১০:৩৫",
        thumb: "1488590528505-98d2b5aba04b",
      },
      {
        id: "tech-7",
        title: "কোয়ান্টাম কম্পিউটিং এর ভবিষ্যৎ",
        duration: "০৯:১৫",
        thumb: "1461749280684-dccba630e2f6",
      },
      {
        id: "tech-8",
        title: "ভার্চুয়াল রিয়েলিটি: নতুন অভিজ্ঞতা",
        duration: "০৭:০০",
        thumb: "1550751827-4bd374c3f58b",
      },
    ],
  },
  {
    title: "ব্যবসা-বাণিজ্য",
    color: "orange",
    videos: [
      {
        id: "biz-1",
        title: "শেয়ারবাজার সপ্তাহের রিপোর্ট",
        duration: "০৬:৫০",
        thumb: "1460925895917-afdab827c52f",
      },
      {
        id: "biz-2",
        title: "নতুন ব্যবসায়িক নীতিমালা ২০২৬",
        duration: "১০:১৫",
        thumb: "1554469384-e58fac16e23a",
      },
      {
        id: "biz-3",
        title: "স্টার্টআপ সাফল্যের গল্প",
        duration: "০৮:৩০",
        thumb: "1454165804606-c3d57bc86b40",
      },
      {
        id: "biz-4",
        title: "রপ্তানি আমদানি: সাম্প্রতিক প্রবণতা",
        duration: "০৭:২৫",
        thumb: "1486312338219-ce68d2c6f44d",
      },
      {
        id: "biz-5",
        title: "ই-কমার্স: প্রবৃদ্ধির ধারা",
        duration: "০৯:০০",
        thumb: "1460925895917-afdab827c52f",
      },
      {
        id: "biz-6",
        title: "ব্যাংকিং খাতে নতুন উদ্যোগ",
        duration: "০৭:৪৫",
        thumb: "1554469384-e58fac16e23a",
      },
      {
        id: "biz-7",
        title: "শিল্পে বিনিয়োগ: সুযোগ ও সম্ভাবনা",
        duration: "১০:৫৫",
        thumb: "1454165804606-c3d57bc86b40",
      },
      {
        id: "biz-8",
        title: "কর্পোরেট সামাজিক দায়বদ্ধতা",
        duration: "০৬:২০",
        thumb: "1486312338219-ce68d2c6f44d",
      },
    ],
  },
  {
    title: "স্বাস্থ্য ও জীবনযাপন",
    color: "teal",
    videos: [
      {
        id: "life-1",
        title: "সুস্থ জীবনযাপনের টিপস",
        duration: "০৫:৪০",
        thumb: "1540189549336-e6e99c3679fe",
      },
      {
        id: "life-2",
        title: "মানসিক স্বাস্থ্য: সচেতনতা বাড়াতে হবে",
        duration: "০৯:২০",
        thumb: "1507525428034-b723cf961d3e",
      },
      {
        id: "life-3",
        title: "যোগব্যায়াম: দৈনন্দিন রুটিন",
        duration: "০৬:৫৫",
        thumb: "1476514525535-07fb3b4ae5f1",
      },
      {
        id: "life-4",
        title: "পুষ্টি পরামর্শ: খাদ্য তালিকা",
        duration: "০৭:১০",
        thumb: "1469854523086-cc02fe5d8800",
      },
      {
        id: "life-5",
        title: "ফিটনেস চ্যালেঞ্জ: ৩০ দিনের প্ল্যান",
        duration: "০৮:৩৫",
        thumb: "1540189549336-e6e99c3679fe",
      },
      {
        id: "life-6",
        title: "ডায়াবেটিস প্রতিরোধে যা করণীয়",
        duration: "০৯:৫০",
        thumb: "1507525428034-b723cf961d3e",
      },
      {
        id: "life-7",
        title: "ঘুমের গুরুত্ব এবং টিপস",
        duration: "০৬:১৫",
        thumb: "1476514525535-07fb3b4ae5f1",
      },
      {
        id: "life-8",
        title: "হার্টের সুস্থতা: জীবনযাপন পরিবর্তন",
        duration: "১০:০৫",
        thumb: "1469854523086-cc02fe5d8800",
      },
    ],
  },
];

export default function VideoPage() {
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
          <VideoBentoGrid />
        </section>

        {/* Categories Section */}
        <section className="space-y-12">
          {VIDEO_CATEGORIES.map((category) => (
            <div key={category.title}>
              <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                <h2
                  className={`text-2xl font-bold text-${category.color}-500 border-l-4 border-${category.color}-500 pl-3`}
                >
                  {category.title}
                </h2>
                <button className="text-sm font-bold text-gray-500 hover:text-white transition">
                  সব দেখুন
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {category.videos.map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="aspect-video bg-gray-900 rounded-lg mb-3 relative overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-${video.thumb}?w=600&auto=format&fit=crop`}
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
                        {video.duration}
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-bold text-gray-200 group-hover:text-${category.color}-400 transition line-clamp-2`}
                    >
                      {video.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
