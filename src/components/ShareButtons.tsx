"use client";

import { Facebook, Twitter, Share2, Linkedin } from "lucide-react";
import { clsx } from "clsx";
import { useState, useRef } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  className?: string;
}

export default function ShareButtons({
  title,
  slug,
  className,
}: ShareButtonsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://samakal.com";
  const url = `${baseUrl}/article/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      name: "Messenger",
      isCustom: true,
      customIcon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
          className="text-[#0084FF]"
        >
          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z" />
        </svg>
      ),
      href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`,
      color: "hover:bg-blue-50",
    },
    {
      name: "WhatsApp",
      isCustom: true,
      customIcon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
          className="text-[#25D366]"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodedTitle} - ${encodedUrl}`,
      color: "hover:bg-green-50",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "text-[#0A66C2] hover:bg-[#0A66C2]/10",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
    },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <div
      className={clsx("flex items-center relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icons Container (Expands to Left) - Absolute positioning trick not needed if we use flex-row-reverse or similar, 
          BUT user wants it expanding FROM the button. 
          Let's try a flex container where the icons reveal.
      */}
      <div
        className={clsx(
          "flex items-center overflow-hidden transition-all duration-500 ease-out",
          isHovered ? "w-52 opacity-100 mr-2" : "w-0 opacity-0 mr-0",
        )}
      >
        <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200 shadow-sm gap-1">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "p-2 rounded-lg transition-all duration-300 hover:scale-125 active:scale-95",
                link.color,
                "hover:bg-white hover:shadow-sm",
              )}
              title={link.name}
            >
              {link.icon || link.customIcon}
            </a>
          ))}
        </div>
      </div>

      {/* Trigger Button */}
      <button
        className={clsx(
          "flex items-center justify-center p-2.5 rounded-lg transition-all duration-300 font-bold text-sm shadow-sm border border-gray-200 z-10 hover:scale-105 active:scale-95",
          isHovered
            ? "bg-gray-100 text-gray-900 border-brand-red/20"
            : "bg-brand-red text-white hover:bg-red-700 hover:shadow-md border-transparent",
        )}
        title="শেয়ার করুন"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
}
