"use client";

import { Upload, Loader2 } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import { PutBlobResult } from '@vercel/blob';

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
        // Validate
        if (file.size > 5 * 1024 * 1024) {
            toast.error(`File too large: ${file.name} (Max 5MB)`);
            errorCount++;
            continue;
        }
        if (!file.type.startsWith('image/')) {
            toast.error(`Invalid file type: ${file.name}`);
            errorCount++;
            continue;
        }

        try {
            const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file,
            });

            if (!response.ok) throw new Error('Upload failed');

            const blob: PutBlobResult = await response.json();
            console.log('Uploaded:', blob);
            successCount++;
        } catch (error) {
            console.error('Upload Error:', error);
            errorCount++;
        }
    }

    setIsUploading(false);
    
    if (successCount > 0) {
        toast.success(`${successCount} images uploaded successfully!`);
    }
    if (errorCount > 0) {
        toast.error(`${errorCount} uploads failed.`);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        uploadFiles(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden
            ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
            }
            ${isUploading ? 'pointer-events-none opacity-80' : ''}
        `}
    >
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            multiple 
            accept="image/png, image/jpeg, image/webp"
        />

        {isUploading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                <Loader2 size={40} className="text-brand-red animate-spin mb-2" />
                <p className="font-bold text-gray-600">Uploading...</p>
            </div>
        ) : null}

        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
            <Upload size={32} className={isDragging ? 'text-blue-600' : 'text-gray-400'} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
            {isDragging ? 'Drop files to upload' : 'Click to Upload or Drag images'}
        </h3>
        <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
            JPG, PNG, WEBP up to 5MB
        </p>
    </div>
  );
}
