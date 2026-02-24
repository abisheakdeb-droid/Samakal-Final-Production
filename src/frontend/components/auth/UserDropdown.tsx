"use client";

import React from 'react';
import Link from 'next/link';
import {
    User as UserIcon,
    Bookmark,
    History,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { User } from '@/types/user';

import { useSession, signOut } from 'next-auth/react';
import { useUI } from '@/context/UIContext';

interface UserDropdownProps {
    user: User;
    onLogout: () => void;
    onClose: () => void;
}

export default function UserDropdown({ user, onClose }: UserDropdownProps) {
    const { data: session } = useSession();
    const { showBreadcrumb, toggleBreadcrumb } = useUI();

    const menuItems = [
        { label: 'আমার প্রোফাইল', icon: UserIcon, href: '/user/profile?tab=overview' },
        { label: 'সংরক্ষিত', icon: Bookmark, href: '/user/profile?tab=saved' },
        { label: 'পাঠের ইতিহাস', icon: History, href: '/user/profile?tab=history' },
        { label: 'পছন্দসমূহ', icon: Settings, href: '/user/profile?tab=settings' },
    ];

    return (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Section */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex flex-col items-center text-center">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{user.name}</h4>
                    <p className="text-[10px] text-brand-red font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full inline-block">
                        {user.badge || 'Member'}
                    </p>
                </div>
            </div>

            {/* Menu Options */}
            <div className="p-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg text-gray-400 group-hover:text-brand-red transition-colors">
                                <item.icon size={18} />
                            </div>
                            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-red opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                    </Link>
                ))}
                {/* Breadcrumb Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-gray-500">
                            <Settings size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            ব্রেডক্রাম্ব দেখান
                        </span>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={(e) => { e.stopPropagation(); if (!showBreadcrumb) toggleBreadcrumb(); }}
                            className={clsx(
                                "px-2 py-0.5 rounded-md text-[10px] font-bold transition-all",
                                showBreadcrumb
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            )}
                        >
                            দেখান
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (showBreadcrumb) toggleBreadcrumb(); }}
                            className={clsx(
                                "px-2 py-0.5 rounded-md text-[10px] font-bold transition-all",
                                !showBreadcrumb
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            )}
                        >
                            লুকান
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => {
                        signOut({ callbackUrl: '/' });
                        onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <LogOut size={16} />
                    </div>
                    <span className="text-sm font-bold">লগ আউট</span>
                </button>
            </div>
        </div>
    );
}

// Shorthand for clsx if needed in local scope, or use established import
import { clsx } from 'clsx';
