"use client";

import { useState, useRef, Dispatch, SetStateAction } from "react";
import { Upload, X, Loader2, Grid } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";
import MediaGallery from "../media/MediaGallery";

export interface ArticleImage {
  id?: string;
  url: string;
  type: "featured" | "thumbnail" | "gallery";
  caption?: string;
  photographer?: string;
  file?: File;
  isUploading?: boolean;
}

interface ImageUploaderProps {
  images: ArticleImage[];
  onImagesChange: Dispatch<SetStateAction<ArticleImage[]>>;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (fileArray.length > remainingSlots) {
      alert(
        `Maximum ${maxImages} images allowed. You can only add ${remainingSlots} more.`,
      );
      return;
    }

    // Create temporary image objects with uploading state
    const newImages: ArticleImage[] = fileArray.map((file, index) => ({
      url: URL.createObjectURL(file),
      type: images.length === 0 && index === 0 ? "featured" : "gallery",
      file,
      isUploading: true,
    }));

    // Add to images list immediately for UI feedback
    onImagesChange([...images, ...newImages]);

    // Upload each image
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i].file!;
      const result = await uploadImage(file);

      if (result.error) {
        alert(`Failed to upload ${file.name}: ${result.error}`);
        // Remove failed upload
        onImagesChange((imgs: ArticleImage[]) =>
          imgs.filter((img) => img.file !== file),
        );
      } else {
        // Update with actual URL
        onImagesChange((imgs: ArticleImage[]) =>
          imgs.map((img) =>
            img.file === file
              ? { ...img, url: result.url, file: undefined, isUploading: false }
              : img,
          ),
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);

    // If removed image was featured, make first image featured
    if (images[index].type === "featured" && newImages.length > 0) {
      newImages[0].type = "featured";
    }

    onImagesChange(newImages);
  };

  const handleMakeFeatured = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      type:
        i === index
          ? ("featured" as const)
          : img.type === "featured"
            ? ("gallery" as const)
            : img.type,
    }));
    onImagesChange(newImages);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onImagesChange(newImages);
  };

  const handlePhotographerChange = (index: number, photographer: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], photographer };
    onImagesChange(newImages);
  };

  const handleLibrarySelect = (asset: { url: string; name: string }) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert("Maximum images reached");
      return;
    }

    const newImage: ArticleImage = {
      url: asset.url,
      type: images.length === 0 ? "featured" : "gallery",
      caption: asset.name.split(".")[0],
    };

    onImagesChange([...images, newImage]);
    setShowLibrary(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          ছবি ({images.length}/{maxImages})
        </h3>
        <button
          onClick={() => setShowLibrary(true)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
        >
          <Grid size={14} />
          লাইব্রেরি থেকে নিন
        </button>
      </div>

      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all mb-4 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-400 bg-white"
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`p-3 rounded-full mb-2 transition-colors ${
                isDragging ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Upload
                size={20}
                className={isDragging ? "text-blue-600" : "text-gray-500"}
              />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              নতুন ছবি আপলোড করুন
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP (Max 5MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                {image.isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}

                {/* Remove button */}
                {!image.isUploading && (
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Featured badge */}
                {image.type === "featured" && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded shadow-lg">
                    প্রধান
                  </div>
                )}
              </div>

              {/* Make Featured Button */}
              {!image.isUploading && image.type !== "featured" && (
                <button
                  onClick={() => handleMakeFeatured(index)}
                  className="w-full mb-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  প্রধান ছবি করুন
                </button>
              )}

              {/* Caption Input */}
              <input
                type="text"
                placeholder="ছবির ক্যাপশন..."
                value={image.caption || ""}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                disabled={image.isUploading}
                className="w-full p-2 text-sm border border-gray-200 rounded mb-2 outline-none focus:border-gray-400 disabled:bg-gray-50"
              />

              {/* Photographer Input */}
              <input
                type="text"
                placeholder="ফটোগ্রাফার..."
                value={image.photographer || ""}
                onChange={(e) =>
                  handlePhotographerChange(index, e.target.value)
                }
                disabled={image.isUploading}
                className="w-full p-2 text-sm border border-gray-200 rounded outline-none focus:border-gray-400 disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">
          কোন ছবি যুক্ত হয়নি
        </p>
      )}

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">মিডিয়া লাইব্রেরি</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaGallery onSelect={handleLibrarySelect} selectedId={null} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
