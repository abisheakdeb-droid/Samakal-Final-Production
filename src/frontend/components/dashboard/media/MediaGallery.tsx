"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { getMediaLibrary } from "@/lib/actions-media";

interface MediaAsset {
    id: string;
    url: string;
    name: string;
    type: string;
    size: string;
}

interface MediaGalleryProps {
    onSelect: (asset: MediaAsset) => void;
    selectedId: string | null;
}

export default function MediaGallery({ onSelect, selectedId }: MediaGalleryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
        const media = await getMediaLibrary();
        setAssets(media);
        setLoading(false);
    };
    fetchMedia();
  }, []);

  if (loading) {
     return <div className="p-8 text-center text-gray-400">Loading media...</div>;
  }

  if (assets.length === 0) {
      return (
          <div className="p-8 text-center border-2 border-dashed rounded-xl">
              <p className="text-gray-500">No images found in library</p>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
      {assets.map((asset) => (
        <div 
            key={asset.id}
            onClick={() => onSelect(asset)}
            className={clsx(
                "relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all",
                selectedId === asset.id 
                    ? "border-blue-500 ring-2 ring-blue-500/20" 
                    : "border-transparent hover:border-gray-300"
            )}
        >
            <Image 
                src={asset.url} 
                alt={asset.name} 
                sizes="100vw"
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={clsx(
                "absolute inset-0 bg-black/50 flex items-end p-3 transition-opacity duration-300",
                selectedId === asset.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                <p className="text-white text-xs font-medium truncate w-full">{asset.name}</p>
            </div>
        </div>
      ))}
    </div>
  );
}
