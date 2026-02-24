"use client";

import { Download, Trash2, Copy, X } from "lucide-react";
import Image from "next/image";
import type { MediaAsset } from "@/types/media";

interface MediaSidebarProps {
    asset: MediaAsset | null;
    onClose: () => void;
}

export default function MediaSidebar({ asset, onClose }: MediaSidebarProps) {
  if (!asset) return null;

  return (
    <aside className="w-80 border-l border-gray-100 bg-white p-6 h-[calc(100vh-64px)] overflow-y-auto fixed right-0 top-16 bottom-0 z-20 shadow-xl lg:shadow-none animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Asset Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
            <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Preview */}
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
            <Image src={asset.url} alt={asset.name} sizes="100vw" fill className="object-contain" />
        </div>

        {/* Info */}
        <div className="space-y-3">
             <div>
                <label className="text-xs text-gray-500 block mb-1">File Name</label>
                <p className="text-sm font-medium text-gray-900 break-all">{asset.name}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">Type</label>
                    <p className="text-sm font-medium text-gray-900">{asset.type}</p>
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">Size</label>
                    <p className="text-sm font-medium text-gray-900">{asset.size}</p>
                 </div>
             </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">
                 <Copy size={16} /> Copy URL
             </button>
             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">
                 <Download size={16} /> Download
             </button>
             <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-600 transition">
                 <Trash2 size={16} /> Delete Asset
             </button>
        </div>
      </div>
    </aside>
  );
}
