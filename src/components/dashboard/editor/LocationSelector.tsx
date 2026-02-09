"use client";

import { useState } from "react";
import { MapPin, X, Search } from "lucide-react";
import { BANGLADESH_LOCATIONS } from "./types";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSelector({
  value,
  onChange,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter locations
  const filteredLocations = BANGLADESH_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <>
      <div>
        <label className="text-xs text-gray-500 mb-2 block font-medium">
          স্থান (Location)
        </label>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-300 transition-all"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span
              className={`truncate ${value ? "text-gray-900" : "text-gray-400"}`}
            >
              {value || "স্থান নির্বাচন করুন..."}
            </span>
          </div>
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
            >
              <X size={14} className="text-gray-500" />
            </button>
          )}
        </button>

        {value && (
          <p className="text-xs text-gray-400 mt-1.5">
            আঞ্চলিক খবরের স্থান নির্বাচন করা হয়েছে
          </p>
        )}
      </div>

      {/* Modal Overlay - OUTSIDE sidebar scroll */}
      {isOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm("");
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">
                  স্থান নির্বাচন করুন
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                />
              </div>
            </div>

            {/* Scrollable List - THIS WILL WORK! */}
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              {filteredLocations.length > 0 ? (
                <div className="p-2">
                  {filteredLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleSelect(location)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                        value === location
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  কোন ফলাফল পাওয়া যায়নি
                </div>
              )}

              {/* Custom location */}
              {searchTerm && !BANGLADESH_LOCATIONS.includes(searchTerm) && (
                <div className="p-2 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => handleSelect(searchTerm)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                  >
                    + &quot;{searchTerm}&quot; যুক্ত করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
