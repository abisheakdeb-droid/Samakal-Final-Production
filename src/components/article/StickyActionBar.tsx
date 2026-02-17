"use client";

import React, { useState } from 'react';
import {
    ThumbsUp,
    Bookmark,
    Share2,
    MessageCircle,
    Link as LinkIcon,
    Facebook,
    Twitter,
    Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface StickyActionBarProps {
    articleId: string;
    onActionClick: () => void; // Trigger soft login if needed
}

export default function StickyActionBar({ articleId, onActionClick }: StickyActionBarProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [showReactions, setShowReactions] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

    const interactMutation = useMutation({
        mutationFn: async ({ action, type }: { action: string, type?: string }) => {
            const res = await axios.post('/api/user/interact', {
                newsId: articleId,
                action,
                type
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
    });

    const handleAction = (action: string, type?: string) => {
        if (!session) {
            onActionClick();
            return;
        }
        interactMutation.mutate({ action, type });
    };

    const reactions = [
        { label: 'Like', emoji: '👍' },
        { label: 'Love', emoji: '❤️' },
        { label: 'Wow', emoji: '😮' },
        { label: 'Angry', emoji: '😡' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">

                {/* Reactions Wrapper */}
                <div className="relative group">
                    <button
                        onClick={() => setShowReactions(!showReactions)}
                        className={clsx(
                            "flex items-center gap-2 text-sm font-bold transition-colors",
                            selectedReaction ? "text-orange-600" : "text-gray-600 dark:text-gray-400 hover:text-orange-600"
                        )}
                        aria-label="React"
                    >
                        {interactMutation.isPending && interactMutation.variables?.action === 'reaction' ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : selectedReaction ? (
                            <span className="text-xl">{selectedReaction}</span>
                        ) : (
                            <ThumbsUp size={20} />
                        )}
                        <span className="hidden sm:inline">React</span>
                    </button>

                    {/* Reaction Picker Overlay */}
                    <div className={clsx(
                        "absolute bottom-full left-0 mb-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full p-2 shadow-xl flex gap-2 transition-all duration-200 origin-bottom",
                        showReactions ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
                    )}>
                        {reactions.map((r) => (
                            <button
                                key={r.label}
                                onClick={() => {
                                    setSelectedReaction(r.emoji);
                                    setShowReactions(false);
                                    handleAction('reaction', r.label.toLowerCase());
                                }}
                                className="w-10 h-10 flex items-center justify-center text-xl hover:scale-125 transition-transform"
                                title={r.label}
                            >
                                {r.emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />

                {/* Comment Link */}
                <button
                    onClick={() => {
                        const el = document.getElementById('comments-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors text-sm font-bold"
                    aria-label="View Comments"
                >
                    <MessageCircle size={20} />
                    <span className="hidden sm:inline">12</span>
                </button>

                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />

                {/* Bookmark Toggle */}
                <button
                    onClick={() => handleAction('bookmark')}
                    className={clsx(
                        "flex items-center gap-2 transition-colors text-sm font-bold",
                        interactMutation.isPending && interactMutation.variables?.action === 'bookmark' ? "text-orange-400" : "text-gray-600 dark:text-gray-400 hover:text-orange-600"
                    )}
                    aria-label="Save Story"
                >
                    {interactMutation.isPending && interactMutation.variables?.action === 'bookmark' ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Bookmark size={20} />
                    )}
                    <span className="hidden sm:inline">Save</span>
                </button>

                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />

                {/* Share Button */}
                <div className="relative group/share">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm font-bold" aria-label="Share">
                        <Share2 size={20} />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* Share flyout */}
                    <div className="absolute bottom-full right-0 mb-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 shadow-xl hidden group-hover/share:flex flex-col gap-1 min-w-[140px] animate-in fade-in slide-in-from-bottom-2">
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-xs font-bold text-gray-600 dark:text-gray-400">
                            <Facebook size={16} className="text-blue-600" /> Facebook
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-xs font-bold text-gray-600 dark:text-gray-400">
                            <Twitter size={16} className="text-sky-500" /> Twitter
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors text-xs font-bold text-gray-600 dark:text-gray-400">
                            <LinkIcon size={16} /> Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
