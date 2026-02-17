"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    LayoutDashboard,
    Bookmark,
    History,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    CheckCircle,
    TrendingUp,
    MessageCircle,
    X,
    Loader2,
    Home
} from 'lucide-react';
import { clsx } from 'clsx';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useUI } from '@/context/UIContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProfileDashboardProps {
}

export default function ProfileDashboard({ }: ProfileDashboardProps) {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'history' | 'activity' | 'settings'>('overview');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['overview', 'saved', 'history', 'activity', 'settings'].includes(tab)) {
            // Use requestAnimationFrame or setTimeout to move out of the synchronous render phase
            const frame = requestAnimationFrame(() => {
                setActiveTab(tab as 'overview' | 'saved' | 'history' | 'activity' | 'settings');
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [searchParams]);

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await axios.get('/api/user/profile');
            return res.data;
        },
        enabled: !!session?.user,
    });

    const navItems = [
        { id: 'overview', label: 'সারাংশ', icon: LayoutDashboard },
        { id: 'saved', label: 'সংরক্ষিত', icon: Bookmark },
        { id: 'history', label: 'পাঠের ইতিহাস', icon: History },
        { id: 'activity', label: 'আমার কর্মকাণ্ড', icon: MessageSquare },
        { id: 'settings', label: 'পছন্দসমূহ', icon: Settings },
    ];

    if (!session?.user) return null;

    const user = {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || (session.user as { avatar?: string }).avatar,
        memberSince: (session.user as { createdAt?: string }).createdAt ? new Date((session.user as { createdAt?: string }).createdAt!).getFullYear().toString() : "২০২৬"
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-[280px] space-y-6">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-brand-red hover:text-white transition-all font-bold text-sm group mb-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:translate-y-[-1px]"
                >
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-white/20 transition-colors shadow-inner">
                        <Home size={18} className="text-brand-red group-hover:text-white transition-colors" />
                    </div>
                    <span>মূল সাইটে ফিরুন</span>
                </Link>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center shadow-sm">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-orange-50 p-1 dark:border-gray-800">
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden relative">
                                {user.avatar ? (
                                    <Image src={user.avatar || ""} alt={user.name} fill className="object-cover" />
                                ) : (
                                    <span className="text-3xl font-serif text-gray-400 font-bold">{user.name.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 border border-gray-100 dark:border-gray-800">
                            <CheckCircle className="text-blue-500 fill-blue-50" size={20} />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-xs font-bold mb-4">
                        <CheckCircle size={12} />
                        Verified Reader
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Member since {user.memberSince}
                    </p>
                </div>

                {/* Navigation Menu */}
                <nav className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-3 shadow-sm">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id as 'overview' | 'saved' | 'history' | 'activity' | 'settings')}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                                        activeTab === item.id
                                            ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30"
                                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-sm"
                        >
                            <LogOut size={18} />
                            লগ আউট
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && <Overview user={user} data={profileData} />}
                        {activeTab === 'saved' && <SavedItems data={profileData?.bookmarks || []} />}
                        {activeTab === 'history' && <ReadingHistory data={profileData?.history || []} />}
                        {activeTab === 'activity' && <Activity user={user} data={profileData?.comments || []} />}
                        {activeTab === 'settings' && <SettingsTab user={user} />}
                    </>
                )}
            </main>
        </div>
    );
}

interface UserOverview {
    name: string;
    email?: string;
    avatar?: string | null;
    memberSince?: string;
}

interface ProfileStats {
    history: { id: string, viewedAt: string, news: { title: string } }[];
    comments: { id: string, content: string, createdAt: string, news: { title: string } }[];
    bookmarks: { id: string, createdAt: string, news: { title: string, thumbnail?: string } }[];
}

function Overview({ user, data }: { user: UserOverview, data: ProfileStats }) {
    const stats = [
        { label: "Articles Read", value: data?.history?.length || 0, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Comments", value: data?.comments?.length || 0, icon: MessageCircle, color: "text-green-500", bg: "bg-green-50" },
        { label: "Saved", value: data?.bookmarks?.length || 0, icon: Bookmark, color: "text-orange-500", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-12">
            <div className="relative py-8 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-transparent rounded-3xl px-8 border border-orange-100/50 dark:border-orange-900/20">
                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    শুভ সকাল, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    আপনার সকালের খবরের সারাংশ তৈরি।
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                        <div className={clsx("p-3 rounded-2xl", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">আপনার জন্য (Recommended)</h2>
                    <button className="text-orange-600 font-bold text-sm hover:underline">See All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Simplified for now, can fetch from real recommendations API later */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4 relative">
                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded uppercase">
                                    সারাদেশ
                                </div>
                            </div>
                            <h4 className="font-serif font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-snug">
                                বাংলাদেশ রেলওয়ের আয় বাড়লেও লোকসান কেন কমছে না?
                            </h4>
                            <p className="text-xs text-gray-400 font-medium">১৬ ফেব্রুয়ারি ২০২৬ • ৫ মিনিট পাঠ</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function SavedItems({ data }: { data: { id: string, createdAt: string, news: { title: string, thumbnail?: string } }[] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <Bookmark size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">সংরক্ষিত খবর</h2>
            </div>

            <div className="space-y-4">
                {data.length > 0 ? data.map((item) => (
                    <div key={item.id} className="flex gap-6 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-orange-200 transition-all group">
                        <div className="hidden sm:block w-32 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 relative">
                            {item.news?.thumbnail && <Image src={item.news.thumbnail} alt="" fill className="object-cover" />}
                        </div>
                        <div className="flex-1 py-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 leading-snug group-hover:text-orange-600 transition-colors">
                                    {item.news?.title || "Untitled Article"}
                                </h4>
                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <X size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString('bn-BD')}</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-400">আপনার কোনো সংরক্ষিত খবর নেই।</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ReadingHistory({ data }: { data: { id: string, viewedAt: string, news: { title: string } }[] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <History size={24} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">পাঠের ইতিহাস</h2>
                </div>
                <button className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    ইতিহাস মুছুন
                </button>
            </div>
            <div className="space-y-4">
                {data.length > 0 ? data.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm rounded-2xl transition-all border border-transparent hover:border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-red cursor-pointer leading-snug">
                                {item.news?.title || "Deleted Article"}
                            </h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                {new Date(item.viewedAt).toLocaleString('bn-BD')}
                            </p>
                        </div>
                        <button className="text-gray-300 hover:text-red-500 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-20 text-gray-400">ইতিহাস পাওয়া যায়নি।</div>
                )}
            </div>
        </div>
    );
}

function Activity({ user, data }: { user: UserOverview, data: { id: string, content: string, createdAt: string, news: { title: string } }[] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <MessageSquare size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">আমার কর্মকাণ্ড</h2>
            </div>

            <div className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/20 p-4 rounded-2xl flex items-center gap-3">
                    <div className="relative">
                        <Bell className="text-orange-600" size={20} />
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                        আপনার সর্বশেষ কর্মকাণ্ড এখানে দেখা যাবে।
                    </p>
                </div>

                <div className="space-y-4">
                    {data.length > 0 ? data.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                    {user.avatar && <Image src={user.avatar} alt={user.name} fill className="object-cover" />}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-900 dark:text-white mb-4 text-sm font-medium bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl italic border-l-2 border-brand-red">
                                &quot;{item.content}&quot;
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-brand-red font-bold hover:underline cursor-pointer">
                                    নিউজ: {item.news?.title || "Unknown News"}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-400">আপনি এখনো কোনো মন্তব্য করেননি।</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ user }: { user: UserOverview }) {
    const { showBreadcrumb, toggleBreadcrumb } = useUI();

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl">
                    <Settings size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">পছন্দসমূহ (Settings)</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Profile Info */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">ব্যক্তিগত তথ্য</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">নাম</label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-gray-600 dark:text-gray-400 font-medium border border-gray-100 dark:border-gray-800">
                                {user.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">ইমেইল</label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-gray-600 dark:text-gray-400 font-medium border border-gray-100 dark:border-gray-800">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">সাইট প্রেফারেন্স</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">ব্রেডক্রাম্ব দেখান (Show Breadcrumbs)</p>
                                <p className="text-xs text-gray-400">সাইটে নেভিগেশন ব্রেডক্রাম্ব চালু বা বন্ধ করুন।</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit border border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => !showBreadcrumb && toggleBreadcrumb()}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        showBreadcrumb
                                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    )}
                                >
                                    দেখান
                                </button>
                                <button
                                    onClick={() => showBreadcrumb && toggleBreadcrumb()}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        !showBreadcrumb
                                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    )}
                                >
                                    লুকান
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">ডার্ক মোড (Dark Mode)</p>
                                <p className="text-xs text-gray-400">সিস্টেম থিম অনুযায়ী অটোমেটিক কাজ করে।</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
