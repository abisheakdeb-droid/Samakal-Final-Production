"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";
import { useSwipe } from "@/hooks/useSwipe";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoaded, setIsLoaded] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsLoaded(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsLoaded(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  // Touch swipe gestures
  useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
  });

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const lightboxContent = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Close"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      )}

      {/* Main Image */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={clsx(
          "relative max-w-7xl max-h-full",
          "transition-all duration-500 ease-out",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onLoad={() => setIsLoaded(true)}
            priority
          />
        </div>
      </div>

      {/* Keyboard Hints (Desktop Only) */}
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        <span className="inline-flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
          <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
          Navigate
          <span className="mx-2">•</span>
          <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
          Close
        </span>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
