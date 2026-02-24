"use client";

import { PenLine, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function QuickNote() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem("admin_quick_note");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedNote) setNote(savedNote);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNote(newVal);
    setSaved(false);

    // Auto save with debounce
    localStorage.setItem("admin_quick_note", newVal);
    setSaved(true);
  };

  return (
    <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-6 shadow-sm h-full flex flex-col relative group transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4 text-[#92400e]">
        <div className="flex items-center gap-2">
          <PenLine size={18} />
          <h3 className="font-bold text-lg">Quick Note</h3>
        </div>
        {saved && (
          <span className="text-xs font-medium flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full animate-in fade-in">
            <Check size={12} /> Saved
          </span>
        )}
      </div>

      <textarea
        className="flex-1 w-full bg-transparent border-none resize-none outline-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed"
        placeholder="Got a lead? Scribble it down..."
        value={note}
        onChange={handleChange}
      ></textarea>

      <div className="text-xs text-[#d97706] opacity-60 absolute bottom-4 right-6">
        Local Storage Only
      </div>
    </div>
  );
}
