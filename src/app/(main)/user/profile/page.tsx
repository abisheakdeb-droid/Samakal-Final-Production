import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserStats } from "@/lib/actions-user";
import Link from "next/link";
import {
  Bookmark,
  History,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatBanglaDate } from "@/lib/utils";

export const metadata = {
  title: "Profile | Samakal",
  description: "Your profile and reading statistics",
};

export default async function UserProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login?callbackUrl=/user/profile");
  }

  const stats = await getUserStats();

  const statCards = [
    {
      icon: Bookmark,
      label: "সংরক্ষিত সংবাদ",
      count: stats?.bookmarksCount || 0,
      link: "/user/bookmarks",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: History,
      label: "পড়ার ইতিহাস",
      count: stats?.historyCount || 0,
      link: "/user/history",
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: FileText,
      label: "প্রকাশিত সংবাদ",
      count: stats?.articlesCount || 0,
      link: "#",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-brand-red to-red-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp size={32} />
          <div>
            <h2 className="text-3xl font-bold">স্বাগতম!</h2>
            <p className="text-red-100 mt-1">
              আপনার প্রোফাইল এবং কার্যক্রম দেখুন
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-red-400/30">
          <div>
            <p className="text-red-100 text-sm">সদস্য থেকে</p>
            <p className="text-xl font-bold mt-1">
              {session.user.createdAt
                ? formatBanglaDate(session.user.createdAt)
                : "অজানা"}
            </p>
          </div>
          <div>
            <p className="text-red-100 text-sm">ভূমিকা</p>
            <p className="text-xl font-bold mt-1 capitalize">
              {session.user.role || "Reader"}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">পরিসংখ্যান</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.link}
                className="group bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={28} />
                </div>
                <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-900">
                  {stat.count.toLocaleString("bn-BD")}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-brand-red" />
          দ্রুত লিংক
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/user/bookmarks"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Bookmark size={18} />
              </div>
              <span className="font-medium text-gray-700">
                সংরক্ষিত সংবাদ দেখুন
              </span>
            </div>
            <span className="text-gray-400 group-hover:text-brand-red transition">
              →
            </span>
          </Link>
          <Link
            href="/user/history"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <History size={18} />
              </div>
              <span className="font-medium text-gray-700">
                পড়ার ইতিহাস দেখুন
              </span>
            </div>
            <span className="text-gray-400 group-hover:text-brand-red transition">
              →
            </span>
          </Link>
          <Link
            href="/archive"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <span className="font-medium text-gray-700">
                আর্কাইভ ব্রাউজ করুন
              </span>
            </div>
            <span className="text-gray-400 group-hover:text-brand-red transition">
              →
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-brand-red rounded-lg flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <span className="font-medium text-gray-700">
                সর্বশেষ খবর পড়ুন
              </span>
            </div>
            <span className="text-gray-400 group-hover:text-brand-red transition">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
