"use client";

import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewsActionButtonsProps {
  title: string;
  url: string;
  className?: string; // Allow external styling/positioning
}

export default function NewsActionButtons({
  title,
  url,
  className = "",
}: NewsActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: fullUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy if share API not supported
      handleCopy(e);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("লিংক কপি করা হয়েছে");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("লিংক কপি করা যায়নি");
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="p-1.5 rounded-full text-gray-400 hover:text-brand-red hover:bg-red-50 transition-colors"
        title="শেয়ার করুন"
        aria-label="Share"
      >
        <Share2 size={16} />
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-full text-gray-400 hover:text-brand-red hover:bg-red-50 transition-colors"
        title="লিংক কপি করুন"
        aria-label="Copy Link"
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      </button>
    </div>
  );
}
