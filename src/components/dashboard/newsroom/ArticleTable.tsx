"use client";

import { Eye, Edit3, Trash2, Search, Filter } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import Image from "next/image";

import { toast } from "sonner";
import { deleteArticle } from "@/lib/actions-article";

interface Article {
  id: string;
  title: string;
  author: string;
  status: string;
  views: number;
  date: string;
  image: string | null;
  category: string;
  scheduled_at?: string;
}

interface ArticleTableProps {
  articles: Article[];
}

export default function ArticleTable({ articles }: ArticleTableProps) {
  const handleDelete = async (id: string) => {
      toast.promise(deleteArticle(id), {
        loading: 'Deleting article...',
        success: 'Article deleted successfully',
        error: 'Failed to delete article',
      });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col">
       {/* Toolbar */}
       <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
             />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Filter size={16} /> Filter
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Category
             </button>
          </div>
       </div>

       {/* Table */}
       <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                   <th className="p-4 font-semibold">Article</th>
                   <th className="p-4 font-semibold">Author</th>
                   <th className="p-4 font-semibold">Category</th>
                   <th className="p-4 font-semibold">Status</th>
                   <th className="p-4 font-semibold">Views</th>
                   <th className="p-4 font-semibold">Date</th>
                   <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {articles.map((article) => (
                   <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                            <div className="relative w-12 h-8 rounded overflow-hidden bg-gray-200 shrink-0">
                               <Image 
                                 src={article.image || '/placeholder.svg'} 
                                 alt={article.title} 
                                 fill 
                                 className="object-cover"
                               />
                            </div>
                            <span className="font-medium text-gray-900 line-clamp-1 max-w-[250px]">{article.title}</span>
                         </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{article.author}</td>
                      <td className="p-4 text-sm text-gray-600">
                         <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{article.category}</span>
                      </td>
                      <td className="p-4">
                         <StatusBadge status={article.status} />
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-medium">{article.views}</td>
                       <td className="p-4 text-sm text-gray-500">
                          {article.status === 'scheduled' && article.scheduled_at ? (
                             <div className="flex flex-col text-xs">
                                <span className="text-blue-600 font-bold uppercase tracking-tighter">Scheduled</span>
                                <span className="text-[10px] text-gray-400">{new Date(article.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                          ) : (
                             article.date
                          )}
                       </td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600" title="Preview">
                               <Eye size={16} />
                            </button>
                            <Link href={`/admin/dashboard/articles/${article.id}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-green-600" title="Edit">
                               <Edit3 size={16} />
                            </Link>
                             <button 
                                onClick={() => handleDelete(article.id)}
                                className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600" 
                                title="Delete"
                             >
                                <Trash2 size={16} />
                             </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
       
       {/* Pagination (Simple) */}
       <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Showing {articles.length > 0 ? `1-${Math.min(articles.length, 10)} of ${articles.length}` : '0'} results</span>
          <div className="flex gap-2">
             <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
       </div>
    </div>
  );
}
