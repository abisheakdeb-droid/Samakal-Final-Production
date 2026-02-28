"use client";

import Image from "next/image";
import { Clock, Calendar } from "lucide-react";

interface ArticlePreviewProps {
    title: string;
    content: string; // HTML string from Tiptap
    category: string;
    image?: string; // URL or base64
    author?: string;
    date?: string;
}

export default function ArticlePreview({
    title,
    content,
    category,
    image,
    author = "Admin User",
    date = "Just now"
}: ArticlePreviewProps) {

    // Simple parser for HTML content to meaningful preview if needed, 
    // but dangerouslySetInnerHTML is fine for preview if we trust the editor input (which we do, it's the admin).

    // Fallback image
    const displayImage = image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2670&auto=format&fit=crop";

    return (
        <div className="bg-white text-foreground font-serif min-h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Simulation of Article Page specific content area */}
            <div className="p-8 max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6 flex gap-2 items-center">
                    <span>হোম</span>
                    <span>/</span>
                    <span className="text-brand-red font-semibold">
                        {category || "Uncategorized"}
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    {title || "Article Headline..."}
                </h1>

                {/* Author & Meta */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-b border-gray-100 py-4 mb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative border-2 border-brand-red/20 shadow-sm">
                            <Image
                                src={`https://randomuser.me/api/portraits/men/1.jpg`}
                                alt="Author"
                                sizes="100vw"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="font-bold text-gray-900 text-lg">{author}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> এইমাত্র</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-sm bg-gray-100">
                    <Image
                        src={displayImage}
                        alt={title}
                        sizes="100vw"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    {/* Render HTML content */}
                    {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <p className="text-gray-400 italic">Start writing to see preview...</p>
                    )}
                </article>

            </div>
        </div>
    );
}
