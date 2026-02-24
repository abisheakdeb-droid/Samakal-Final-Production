"use client";

import { NewsType, NEWS_TYPE_OPTIONS } from './types';

interface NewsTypeSelectorProps {
  value: NewsType;
  onChange: (value: NewsType) => void;
}

export default function NewsTypeSelector({ value, onChange }: NewsTypeSelectorProps) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-2 block font-medium">
        খবরের ধরন
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as NewsType)}
        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all"
      >
        {NEWS_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Optional description */}
      <p className="text-xs text-gray-400 mt-1.5">
        {NEWS_TYPE_OPTIONS.find(opt => opt.value === value)?.description}
      </p>
    </div>
  );
}
