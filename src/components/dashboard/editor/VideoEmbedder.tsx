"use client";

import { useState, useEffect } from "react";
import { Video, X, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getVideoThumbnail, isValidVideoUrl } from "@/lib/upload";

interface VideoEmbedderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function VideoEmbedder({ value, onChange }: VideoEmbedderProps) {
  const [url, setUrl] = useState(value);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value && value !== url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(value);
      const thumb = getVideoThumbnail(value);
      setThumbnail(thumb);
    }
  }, [value, url]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setError(null);
    setThumbnail(null);
  };

  const handleApply = () => {
    if (!url) {
      onChange("");
      setThumbnail(null);
      setError(null);
      return;
    }

    setIsValidating(true);

    // Validate URL
    if (!isValidVideoUrl(url)) {
      setError("শুধুমাত্র YouTube বা Facebook ভিডিও URL সমর্থিত");
      setIsValidating(false);
      return;
    }

    // Extract thumbnail
    const thumb = getVideoThumbnail(url);
    setThumbnail(thumb);
    onChange(url);
    setError(null);
    setIsValidating(false);
  };

  const handleClear = () => {
    setUrl("");
    setThumbnail(null);
    setError(null);
    onChange("");
  };

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        ভিডিও এম্বেড
      </h3>

      {/* URL Input */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleApply}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="YouTube বা Facebook ভিডিও URL..."
            className="flex-1 p-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {url && (
            <button
              onClick={handleClear}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            ⚠ {error}
          </p>
        )}

        <p className="text-xs text-gray-400">
          YouTube বা Facebook video link পেস্ট করুন
        </p>
      </div>

      {/* Video Preview */}
      {isValidating && (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      )}

      {!isValidating && value && !error && (
        <div className="space-y-2">
          {/* Thumbnail or Embed Preview */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
            {thumbnail ? (
              <>
                <Image
                  src={thumbnail}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Video className="text-gray-800" size={32} />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <Video size={48} className="mb-2 opacity-50" />
                <p className="text-sm opacity-75">Facebook Video</p>
                <p className="text-xs opacity-50 mt-1">Preview not available</p>
              </div>
            )}
          </div>

          {/* Open Link */}
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ExternalLink size={14} />
            ভিডিও দেখুন
          </a>
        </div>
      )}

      {!value && !error && (
        <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <Video size={32} className="mb-2" />
          <p className="text-sm">কোন ভিডিও যুক্ত হয়নি</p>
        </div>
      )}
    </div>
  );
}
