"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { toggleBookmark, checkIsBookmarked } from "@/lib/actions-bookmark";
import { clsx } from "clsx";

interface BookmarkButtonProps {
  articleId: string;
  initialIsBookmarked?: boolean; // Optional initial state
  className?: string;
  showText?: boolean;
}

export default function BookmarkButton({
  articleId,
  initialIsBookmarked = false,
  className,
  showText = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Client-side check on mount to ensure accuracy if not passed init
    // But to save bandwidth, we could rely on init.
    // Let's rely on init for now if provided, or could fetch.
    const sync = async () => {
      const status = await checkIsBookmarked(articleId);
      setIsBookmarked(status);
    };
    sync();
  }, [articleId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Optimistic Update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    try {
      const result = await toggleBookmark(articleId);

      if (!result.success && result.message === "Unauthorized") {
        toast.error("Please login to bookmark articles");
        setIsBookmarked(previousState); // Revert
        // Optional: router.push('/login');
        return;
      }

      if (result.success) {
        toast.success(result.message);
        setIsBookmarked(result.isBookmarked!);
      } else {
        setIsBookmarked(previousState);
        toast.error("Failed to update bookmark");
      }
    } catch {
      setIsBookmarked(previousState);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={clsx(
        "flex items-center gap-2 transition-all duration-200 group",
        isBookmarked ? "text-brand-red" : "text-gray-400 hover:text-brand-red",
        className,
      )}
      title={isBookmarked ? "Remove Bookmark" : "Save Article"}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkCheck
          className={clsx(
            "transition-transform duration-300",
            isLoading ? "scale-90 opacity-70" : "scale-100",
          )}
          size={20}
        />
      ) : (
        <Bookmark
          className={clsx(
            "transition-transform duration-300",
            isLoading ? "scale-90 opacity-70" : "scale-100",
          )}
          size={20}
        />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isBookmarked ? "সংরক্ষিত" : "সেভ করুন"}
        </span>
      )}
    </button>
  );
}
