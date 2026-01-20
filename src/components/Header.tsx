import { Search, Menu, User, Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const date = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex flex-col border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Top Bar: Logo & Date */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-4xl font-bold text-brand-red">
          সমকাল
        </Link>
        <div className="hidden md:flex gap-4 items-center text-sm text-gray-500">
          <span className="flex items-center gap-2">
             ঢাকা <span className="text-gray-300">|</span> {date}
          </span>
          <button className="bg-brand-red text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition">
            ই-পেপার
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-bg-subtle border-t border-gray-100">
        <div className="container mx-auto px-4 flex justify-between items-center h-12">
          {/* Main Nav Links */}
          <nav className="hidden md:flex gap-6 text-gray-800 font-medium overflow-x-auto">
            {[
              { label: "সর্বশেষ", href: "/category/latest" },
              { label: "রাজনীতি", href: "/category/politics" },
              { label: "বাংলাদেশ", href: "/category/bangladesh" },
              { label: "বিশ্ব", href: "/category/world" },
              { label: "বাণিজ্য", href: "/category/business" },
              { label: "মতামত", href: "/category/opinion" },
              { label: "খেলা", href: "/category/sports" },
              { label: "বিনোদন", href: "/category/entertainment" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-brand-red whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2">
            <Menu size={24} />
          </button>

          {/* Utility Icons */}
          <div className="flex items-center gap-4 text-gray-600">
            <button className="hover:text-brand-red"><Search size={20} /></button>
            <button className="hover:text-brand-red"><Bell size={20} /></button>
            <button className="hover:text-brand-red"><User size={20} /></button>
          </div>
        </div>
      </div>
    </header>
  );
}
