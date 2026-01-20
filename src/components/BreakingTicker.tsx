export default function BreakingTicker() {
  return (
    <div className="bg-[#FEF2F2] border-b border-red-100">
      <div className="container mx-auto flex items-center">
        <div className="bg-brand-green text-white px-4 py-2 font-bold whitespace-nowrap text-sm relative z-10">
          ব্রেকিং নিউজ
        </div>
        <div className="overflow-hidden relative w-full py-2">
          <div className="whitespace-nowrap animate-marquee flex gap-12 px-4 text-gray-800 font-medium">
             <span>জরুরি সংস্কার শেষে দ্রুত নির্বাচন দেওয়া হবে: প্রধান উপদেষ্টা</span>
             <span>বিপিএলে ঢাকার দাপুটে জয়, তামিমের অর্ধশতক</span>
             <span>আগামীকাল থেকে সারা দেশে শৈত্যপ্রবাহের পূর্বাভাস</span>
          </div>
        </div>
      </div>
    </div>
  );
}
