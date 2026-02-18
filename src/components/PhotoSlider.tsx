"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { clsx } from "clsx";

interface PhotoSlide {
  id: string | number;
  slug?: string;
  url: string;
  title: string;
  photographer?: string;
  location?: string;
}

interface PhotoSliderProps {
  photos?: PhotoSlide[];
}

export default function PhotoSlider({ photos = [] }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-play
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, nextSlide, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="w-full h-[60vh] md:h-[80vh] bg-black flex items-center justify-center">
        <div className="text-gray-500 flex flex-col items-center gap-4">
          <Camera size={48} />
          <p className="text-xl font-bold">কোন অ্যালবাম পাওয়া যায়নি</p>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden group">
      {/* Background Image (Blurred for ambiance) */}
      <div
        className="absolute inset-0 opacity-50 blur-xl scale-110 transition-all duration-1000 ease-linear"
        style={{
          backgroundImage: `url(${currentPhoto.url})`,
          backgroundSize: "cover",
        }}
      />

      {/* Main Slide Image */}
      <Link href={`/article/${currentPhoto.id}`} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full md:w-[90%] md:h-[90%] overflow-hidden shadow-2xl transition-all duration-700 ease-out">
          <Image
            src={currentPhoto.url}
            alt={currentPhoto.title}
            fill
            className="object-cover md:object-contain transition-transform duration-[10s] hover:scale-105"
            priority
          />
        </div>
      </Link>

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-6 md:p-12 text-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-2 animate-fade-in-up">
            <Camera size={16} className="text-red-500" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-red-400">
              চিত্রগল্প
            </span>
          </div>
          <h1 className="text-2xl md:text-5xl font-bold leading-tight mb-2 animate-fade-in-up delay-100">
            {currentPhoto.title}
          </h1>
          <p className="text-gray-300 text-sm animate-fade-in-up delay-200">
            ছবি: {currentPhoto.photographer} | স্থান: {currentPhoto.location}
          </p>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center text-white transition opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 flex items-center justify-center text-white transition opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute top-4 right-4 flex gap-2">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300",
              idx === currentIndex
                ? "bg-red-500 w-6"
                : "bg-white/50 hover:bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}
