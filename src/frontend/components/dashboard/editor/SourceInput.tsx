"use client";

import { useState } from 'react';
import { Network, Link as LinkIcon, Check } from 'lucide-react';

interface SourceInputProps {
  source: string;
  sourceUrl: string;
  onSourceChange: (source: string) => void;
  onUrlChange: (url: string) => void;
}

const COMMON_SOURCES = [
  'নিজস্ব প্রতিবেদক',
  'বাসস',
  'রয়টার্স',
  'এএফপি',
  'ইউএনবি',
  'প্রেস রিলিজ',
  'অনলাইন ডেস্ক'
];

export default function SourceInput({ source, sourceUrl, onSourceChange, onUrlChange }: SourceInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        সংবাদের উৎস (Source)
      </h3>

      <div className="space-y-3">
        {/* Source Name */}
        <div className="relative">
          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <div className="px-3 py-2.5 bg-gray-50 border-r border-gray-200">
              <Network size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="উৎস (যেমন: বাসস, রয়টার্স)..."
              className="flex-1 px-3 py-2.5 text-sm outline-none"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
              {COMMON_SOURCES.filter(s => s.toLowerCase().includes(source.toLowerCase())).map((item) => (
                <div
                  key={item}
                  onClick={() => onSourceChange(item)}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                >
                  <span>{item}</span>
                  {source === item && <Check size={14} className="text-blue-600" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Source URL */}
        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
          <div className="px-3 py-2.5 bg-gray-50 border-r border-gray-200">
            <LinkIcon size={16} className="text-gray-400" />
          </div>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="মূল সংবাদের লিংক (যদি থাকে)..."
            className="flex-1 px-3 py-2.5 text-sm outline-none font-mono text-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
