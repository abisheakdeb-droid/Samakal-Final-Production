"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PausePromptModalProps {
  onPause: () => void;
  onContinue: () => void;
  onNeverAsk: () => void; // "Don't ask anymore" -> sets preference to 'always-ask' or 'auto-pause' depending on implementation, but usually 'always-ask' means ask. 'Don't ask' usually means 'Continue' or 'Pause' as default?
  // User request: user-configurable preferences (always ask, auto-pause, never pause). 
  // "Never pause" = Continue playing. 
  // "Auto-pause" = Pause automatically.
  // This modal shows when preference is "always-ask" (default).
  // Options in modal: "Pause", "Continue", "Don't ask again (Auto-pause)", "Don't ask again (Never pause)"?
  // Let's stick to simple: "Pause", "Continue". The "Don't ask" could direct to settings or set a default.
  // Revised per plan: "Pause", "Continue", "Don't ask again"
}

export default function PausePromptModal({ onPause, onContinue, onNeverAsk }: PausePromptModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-brand-red pl-3">
             ভিডিও পজ করবেন?
          </h3>
          <button onClick={onContinue} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">
          আপনি একটি আর্টিকেল পড়ছেন। ভিডিওটি কি পজ করতে চান?
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onPause}
            className="w-full py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition"
          >
            হ্যাঁ, পজ করুন
          </button>
          
          <button 
            onClick={onContinue}
            className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            না, চালিয়ে যান
          </button>
          
          <button 
            onClick={onNeverAsk}
            className="text-xs text-gray-400 hover:text-gray-600 underline mt-2 text-center"
          >
            আর জিজ্ঞেস করবেন না (সেটিংস সেভ করুন)
          </button>
        </div>
      </div>
    </div>
  );
}
