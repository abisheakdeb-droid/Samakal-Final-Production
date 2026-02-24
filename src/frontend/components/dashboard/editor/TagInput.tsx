"use client";

import { useState, useRef, KeyboardEvent } from 'react';
import { X, Hash } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  label?: string;
}

export default function TagInput({ 
  value, 
  onChange, 
  placeholder = 'ট্যাগ যুক্ত করুন...',
  suggestions = [],
  label = 'ট্যাগ'
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div>
      <label className="text-xs text-gray-500 mb-2 block font-medium">
        {label}
      </label>

      {/* Tags display */}
      <div className="w-full min-h-[42px] p-2 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-black/5 focus-within:border-gray-400 transition-all">
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium group hover:bg-gray-200 transition-colors"
            >
              <Hash size={10} className="text-gray-500" />
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="p-0.5 hover:bg-gray-300 rounded transition-colors"
              >
                <X size={10} className="text-gray-600" />
              </button>
            </div>
          ))}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Hash size={12} className="text-gray-400" />
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400 mt-1.5">
        Enter চাপুন ট্যাগ যুক্ত করতে • {value.length} টি ট্যাগ যুক্ত হয়েছে
      </p>
    </div>
  );
}
