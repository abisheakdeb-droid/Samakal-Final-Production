"use client";

import { useState } from "react";
import { Zap, AlertCircle, Loader2, Save } from "lucide-react";
import { SiteSettings, updateSettings } from "@/lib/actions-settings";
import { toast } from "sonner";
import { clsx } from "clsx";

interface QuickActionsProps {
  settings: SiteSettings;
}

export default function QuickActions({ settings }: QuickActionsProps) {
  const [isActive, setIsActive] = useState(settings.breaking_news_is_active || false);
  const [tickerText, setTickerText] = useState(settings.breaking_news_ticker || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        ...settings,
        breaking_news_is_active: isActive,
        breaking_news_ticker: tickerText,
      });
      toast.success("Breaking News updated successfully!");
    } catch (error) {
      toast.error("Failed to update breaking news.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Zap className="text-red-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Real-time Quick Actions</h3>
          <p className="text-sm text-gray-500">Atomic control over mission-critical site features.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Toggle Breaking News */}
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Breaking News Status</label>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={clsx(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border font-bold",
              isActive 
                ? "bg-red-50 border-red-200 text-red-700 shadow-sm shadow-red-100" 
                : "bg-gray-50 border-gray-200 text-gray-500"
            )}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{isActive ? "ACTIVE" : "INACTIVE"}</span>
            </div>
            <div className={clsx(
              "w-10 h-5 rounded-full relative transition-colors duration-300",
              isActive ? "bg-red-600" : "bg-gray-300"
            )}>
              <div className={clsx(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                isActive ? "right-1" : "left-1"
              )} />
            </div>
          </button>
        </div>

        {/* Ticker Text */}
        <div className="md:col-span-7">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Breaking News Ticker</label>
          <div className="relative">
            <input 
              type="text" 
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              placeholder="Enter breaking news headline..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-serif italic text-gray-800"
            />
            {isActive && tickerText && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="md:col-span-2">
          <button 
            onClick={handleUpdate}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} />
                <span>Sync Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50/50 p-2 rounded-lg border border-red-100/50">
          <div className="flex -space-x-1">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          </div>
          <span>LIVE PREVIEW: </span>
          <span className="font-serif italic truncate">{tickerText || "Waiting for headline..."}</span>
        </div>
      )}
    </div>
  );
}
