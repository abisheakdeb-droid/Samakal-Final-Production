import Link from "next/link";

const bengaliNumerals = ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "১০"];

const articles = [
  { id: 1, title: "জরুরি সংস্কার শেষে দ্রুত নির্বাচন দেওয়া হবে: প্রধান উপদেষ্টা" },
  { id: 2, title: "বিপিএলে ঢাকার দাপুটে জয়, তামিমের অর্ধশতক" },
  { id: 3, title: "আগামীকাল থেকে সারা দেশে শৈত্যপ্রবাহের পূর্বাভাস" },
  { id: 4, title: "মধ্যপ্রাচ্য সংকটে নতুন মোড়: সৌদির অবস্থান পরিষ্কার" },
  { id: 5, title: "শেয়ারবাজারে উল্লম্ফন, সূচক বাড়ল ১৫০ পয়েন্ট" },
  { id: 6, title: "শিক্ষা ব্যবস্থা সংস্কারে নতুন কমিশন গঠন" },
];

export default function NumberedList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-brand-red"></span>
        <h2 className="text-xl font-bold text-gray-800">সর্বশেষ</h2>
      </div>
      
      <div className="flex flex-col gap-0 divide-y divide-gray-100">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-4 py-4 items-start hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2">
            <span className="text-3xl font-bold text-gray-300 group-hover:text-brand-red transition-colors font-serif leading-none mt-1">
              {bengaliNumerals[index] || index + 1}
            </span>
            <div>
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-brand-red leading-snug">
                {article.title}
              </h3>
              <span className="text-xs text-gray-400 mt-1 block">১০ মিনিট আগে</span>
            </div>
          </Link>
        ))}
      </div>
      
      <button className="w-full py-2 bg-gray-100 text-gray-600 font-bold rounded hover:bg-gray-200 transition text-sm">
        সব খবর পড়ুন
      </button>
    </div>
  );
}
