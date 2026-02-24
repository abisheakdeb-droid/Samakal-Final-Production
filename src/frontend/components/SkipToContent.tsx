"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[9999] focus:bg-brand-red focus:text-white focus:px-6 focus:py-3 focus:font-bold focus:rounded-br-lg focus:shadow-lg"
    >
      মূল কন্টেন্টে যান (Skip to content)
    </a>
  );
}
