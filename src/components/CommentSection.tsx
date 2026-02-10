"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Send, User as UserIcon } from "lucide-react";
import { postComment } from "@/lib/actions-comment"; // Action we just made
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { clsx } from "clsx";

interface Comment {
  id: string;
  content: string;
  author: string;
  avatar?: string;
  timeAgo: string;
}

interface CommentSectionProps {
  articleId: string;
  initialComments: Comment[];
  currentUser?: any; // Simple user object if logged in
}

export default function CommentSection({
  articleId,
  initialComments,
  currentUser,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const formRef = useRef<HTMLFormElement>(null);

  async function handlePost(formData: FormData) {
    const content = formData.get("content") as string;
    if (!content) return;

    // Optimistic Update
    const tempId = Math.random().toString();
    const newComment: Comment = {
      id: tempId,
      content: content,
      author: currentUser?.name || "আপনি",
      avatar: currentUser?.image,
      timeAgo: "এইমাত্র",
    };

    setComments([newComment, ...comments]);
    formRef.current?.reset();

    const result = await postComment(articleId, content);

    if (!result.success) {
      // Revert if failed
      setComments((current) => current.filter((c) => c.id !== tempId));
      toast.error(result.message);
    } else {
      toast.success(result.message);
      // In a real app we might re-fetch from server to get correct ID and timestamp,
      // but revalidatePath on server + strict mode usually handles this on next navigation.
      // For now optimistic instant feedback is great.
    }
  }

  return (
    <div
      className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 md:p-8 mt-12 border border-gray-100 dark:border-gray-800"
      id="comments"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="p-2 bg-brand-red/10 text-brand-red rounded-lg">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          মন্তব্য ({comments.length})
        </h3>
      </div>

      {/* Post Comment Form */}
      <div className="mb-8">
        {currentUser ? (
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative border border-gray-300 dark:border-gray-700 shrink-0">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <UserIcon size={20} />
                </div>
              )}
            </div>
            <form ref={formRef} action={handlePost} className="flex-1 relative">
              <textarea
                name="content"
                placeholder="আপনার মতামত লিখুন..."
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none min-h-[100px] resize-none text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                required
              ></textarea>
              <SubmitButton />
            </form>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              মন্তব্য করতে দয়া করে লগইন করুন
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-2 bg-brand-red text-white font-bold rounded-full hover:bg-red-700 transition"
            >
              <UserIcon size={18} />
              লগইন করুন
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 group animate-in slide-in-from-bottom-2 fade-in duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
                {comment.avatar ? (
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800">
                    <span className="font-bold text-lg uppercase">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 relative">
                {/* Arrow */}
                <div className="absolute top-4 -left-2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>

                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">
                    {comment.author}
                  </h4>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-sans bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                    {comment.timeAgo}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            এখনো কোনো মন্তব্য নেই। আপনিই প্রথম মন্তব্য করুন!
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute bottom-3 right-3 p-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        <>
          <Send size={16} />
          <span>Post</span>
        </>
      )}
    </button>
  );
}
