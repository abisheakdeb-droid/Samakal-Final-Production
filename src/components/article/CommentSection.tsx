"use client";

import React, { useState, useEffect } from 'react';
import {
    Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

interface CommentSectionProps {
    articleId: string;
    onSoftLogin: () => void;
}

export default function CommentSection({ articleId, onSoftLogin }: CommentSectionProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');

    // Log reading history on mount
    useEffect(() => {
        if (session?.user) {
            axios.post('/api/user/history', { newsId: articleId }).catch(console.error);
        }
    }, [articleId, session?.user]);

    const postCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            // In a real app, this would call /api/user/comments
            // For now we simulate or use the profile api to track activity
            console.log("Posting comment:", content);
            return { success: true };
        },
        onSuccess: () => {
            setCommentText('');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
    });

    const handlePostComment = () => {
        if (!session) {
            onSoftLogin();
            return;
        }
        if (!commentText.trim()) return;
        postCommentMutation.mutate(commentText);
    };

    return (
        <section id="comments-section" className="max-w-3xl mx-auto py-12 px-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    মন্তব্যসমূহ <span className="text-sm font-sans font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">০৩</span>
                </h3>
                <select className="bg-transparent text-xs font-bold text-gray-400 uppercase tracking-widest outline-hidden">
                    <option>শীর্ষ মন্তব্য</option>
                    <option>সর্বশেষ</option>
                </select>
            </div>

            {/* Comment Input */}
            <div className="mb-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-red/10 transition-all">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="আপনার মন্তব্য লিখুন..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none h-24 placeholder:text-gray-400"
                    onClick={() => !session && onSoftLogin()}
                />
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {session?.user ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                    {session.user.image && <Image src={session.user.image} alt={session.user.name || ""} fill className="object-cover" />}
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{session.user.name} হিসেবে কমেন্ট করুন</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">মন্তব্য করতে লগইন করুন</span>
                        )}
                    </div>
                    <button
                        onClick={handlePostComment}
                        disabled={!commentText.trim() || postCommentMutation.isPending}
                        className="px-6 py-2 bg-brand-red text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {postCommentMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        পোস্ট করুন
                    </button>
                </div>
            </div>

            {/* Mock Comments for UI - In real app, fetch from news comments API */}
            <div className="space-y-8">
                <p className="text-center text-gray-400 text-sm">মন্তব্য লোড হচ্ছে...</p>
            </div>
        </section>
    );
}
