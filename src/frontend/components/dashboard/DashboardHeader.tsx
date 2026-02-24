"use client";

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AdminAuthContext';

export default function DashboardHeader() {
  const { user } = useAuth();
  const userName = user?.name || "Admin";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
         <h1 className="text-3xl font-bold text-gray-900 font-serif">
           Good Morning, {userName}! ☀️
         </h1>
         <p className="text-gray-500 mt-1">Real-time overview of your newsroom performance.</p>
      </div>
      <Link href="/admin/dashboard/articles/new" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform transform active:scale-95 shadow-lg">
         <Plus size={20} /> New Story
      </Link>
    </div>
  );
}
