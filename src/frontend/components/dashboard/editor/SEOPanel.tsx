"use client";

import { useState, useEffect } from 'react';
import { Search, Globe, AlertCircle, Sparkles } from 'lucide-react';

interface SEOPanelProps {
  title: string;
  description: string;
  slug: string;
  canonicalUrl: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
  onGenerateSEO?: () => void;
  isGenerating?: boolean;
}

export default function SEOPanel({ 
  title, 
  description, 
  slug, 
  canonicalUrl,
  onTitleChange, 
  onDescriptionChange,
  onCanonicalUrlChange,
  onGenerateSEO,
  isGenerating = false
}: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('edit');

  // Character limits
  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 160;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Search size={18} className="text-blue-600" />
          এসইও এবং মেটাডেটা
        </h3>
        
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'edit' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            এডিট
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'preview' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            প্রিভিউ Look
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'edit' ? (
          <div className="space-y-4">
            {/* SEO Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">মেটা শিরোনাম (SEO Title)</label>
                <span className={`text-xs ${displayCountColor(title?.length || 0, TITLE_LIMIT)}`}>
                  {title?.length || 0}/{TITLE_LIMIT}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="গুগল সার্চে দেখানোর জন্য শিরোনাম..."
                className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ৬০ ক্যারেক্টারের মধ্যে রাখা ভালো। এটি ব্রাউজার ট্যাব এবং সার্চ রেজাল্টে দেখাবে।
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">মেটা বর্ণনা (Meta Description)</label>
                <span className={`text-xs ${displayCountColor(description?.length || 0, DESC_LIMIT)}`}>
                  {description?.length || 0}/{DESC_LIMIT}
                </span>
              </div>
              
              {onGenerateSEO && (
                 <button
                    onClick={onGenerateSEO}
                    disabled={isGenerating}
                    className="mb-2 text-xs flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-800 transition-colors bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <Sparkles size={12} className={isGenerating ? "animate-spin" : ""} />
                    {isGenerating ? "Generating..." : "Auto Generate with AI"}
                 </button>
              )}

              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="খবরের সংক্ষিপ্ত সারমর্ম..."
                rows={3}
                className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">ক্যানোনিক্যাল লিংক (Canonical URL)</label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-400" />
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => onCanonicalUrlChange(e.target.value)}
                  placeholder="https://samakal.com/..."
                  className="flex-1 p-2 text-sm border-b border-gray-200 outline-none focus:border-blue-500 transition-colors font-mono text-gray-600"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Google Search Preview */
          <div className="bg-white p-4 rounded border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Google Search Preview</p>
            
            <div className="flex flex-col gap-1 max-w-[600px] font-sans">
              {/* URL Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#202124]">
                <div className="bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center">
                  <span className="font-bold text-gray-600 text-xs">S</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium">Samakal</span>
                  <span className="text-[10px] text-gray-500">https://samakal.com › news › {slug || '...'}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[#1a0dab] text-xl font-medium HOVER:underline cursor-pointer truncate">
                {title || 'এখানে আপনার এসইও শিরোনাম দেখাবে | সমকাল'}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                <span className="text-gray-400 text-xs mr-2">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
                </span>
                {description || 'এখানে আপনার মেটা বর্ণনা দেখাবে। এটি সার্চ রেজাল্টে ব্যবহারকারীদের আকৃষ্ট করতে সাহায্য করে...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function displayCountColor(current: number, max: number) {
  if (current > max) return 'text-red-500 font-bold';
  if (current > max * 0.8) return 'text-orange-500';
  return 'text-gray-400';
}
