"use client";

import { X, Save } from "lucide-react";
import { useVideoPlayer, UserPreferences } from "@/contexts/VideoPlayerContext";
import { useState, useEffect } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { userPreferences, updatePreferences } = useVideoPlayer();
  const [localPrefs, setLocalPrefs] =
    useState<UserPreferences>(userPreferences);

  // Sync with context if it changes externaly (rare while open)
  useEffect(() => {
    setLocalPrefs(userPreferences);
  }, [userPreferences]);

  const handleSave = () => {
    updatePreferences(localPrefs);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-white text-gray-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-lg text-gray-900">সেটিংস</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section: Article Navigation */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            আর্টিকেল পড়ার সময়
          </h4>
          <div className="space-y-3">
            {[
              {
                id: "always-ask",
                label: "সর্বদা জিজ্ঞাসা করুন",
                desc: "প্রতিবার মনে করিয়ে দেবে",
              },
              {
                id: "auto-pause",
                label: "স্বয়ংক্রিয় পজ",
                desc: "ভিডিও থামিয়ে দেবে",
              },
              {
                id: "never-pause",
                label: "বন্ধ করবেন না",
                desc: "ভিডিও চলতে থাকবে",
              },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition relative"
              >
                <input
                  type="radio"
                  name="pauseBehavior"
                  value={option.id}
                  checked={localPrefs.pauseBehavior === option.id}
                  onChange={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      pauseBehavior: option.id as
                        | "always-ask"
                        | "auto-pause"
                        | "never-pause",
                    })
                  }
                  className="mt-1 w-4 h-4 text-brand-red focus:ring-brand-red"
                />
                <div>
                  <span className="block font-bold text-sm text-gray-800">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section: Default Size */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            ডিফল্ট প্লেয়ার সাইজ
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setLocalPrefs({ ...localPrefs, defaultSize: "mini" })
              }
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${localPrefs.defaultSize === "mini" ? "border-brand-red bg-red-50 text-brand-red" : "border-gray-100 hover:bg-gray-50 text-gray-600"}`}
            >
              <div className="w-12 h-8 bg-current opacity-20 rounded border-2 border-current"></div>
              <span className="text-xs font-bold">মিনি</span>
            </button>

            <button
              onClick={() =>
                setLocalPrefs({ ...localPrefs, defaultSize: "expanded" })
              }
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${localPrefs.defaultSize === "expanded" ? "border-brand-red bg-red-50 text-brand-red" : "border-gray-100 hover:bg-gray-50 text-gray-600"}`}
            >
              <div className="w-16 h-10 bg-current opacity-20 rounded border-2 border-current"></div>
              <span className="text-xs font-bold">বড়</span>
            </button>
          </div>
        </div>

        {/* Section: Autoplay */}
        <div>
          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
            <span className="font-bold text-sm text-gray-800">
              অটোপ্লে পরবর্তী ভিডিও
            </span>
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors ${localPrefs.autoPlayNext ? "bg-brand-red" : "bg-gray-300"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${localPrefs.autoPlayNext ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={localPrefs.autoPlayNext}
              onChange={(e) =>
                setLocalPrefs({ ...localPrefs, autoPlayNext: e.target.checked })
              }
            />
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <Save size={18} />
          সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
}
