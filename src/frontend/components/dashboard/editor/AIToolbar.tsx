"use client";

import { 
  Sparkles, 
  Wand2, 
  BookOpen, 
  ChevronDown,
  Loader2,
  Globe
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAI } from "@/hooks/use-ai";
import { Editor } from "@tiptap/react";
import { 
  completeText, 
  translateText,
  adjustTone,
  analyzeReadability
} from "@/lib/ai/writing-assistant";
import { toast } from "sonner";

interface AIToolbarProps {
  editor: Editor;
}

export function AIToolbar({ editor }: AIToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isGenerating, generate } = useAI();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompleteText = async () => {
    const { from } = editor.state.selection;
    
    // Get text before cursor (context)
    const context = editor.state.doc.textBetween(Math.max(0, from - 500), from, '\n');
    // Get current line/sentence
    const currentText = editor.state.doc.textBetween(Math.max(0, from - 50), from, ' ');

    if (!context && !currentText) {
      toast.error("Please write something first");
      return;
    }

    setIsOpen(false);
    
    await generate(
      "Continuing writing...",
      () => completeText(context, currentText),
      (completion) => {
        if (completion) {
          editor.chain().focus().insertContent(completion).run();
          toast.success("Text completed!");
        }
      }
    );
  };

  const handleToneAdjust = async (tone: 'formal' | 'conversational' | 'urgent') => {
    const { from, to, empty } = editor.state.selection;
    
    if (empty) {
      toast.error("Please select text to adjust tone");
      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to, '\n');
    setIsOpen(false);

    await generate(
      `Adjusting tone to ${tone}...`,
      () => adjustTone(selectedText, tone),
      (adjustedText) => {
        if (adjustedText) {
          editor.chain().focus().insertContent(adjustedText).run();
          toast.success("Tone adjusted!");
        }
      }
    );
  };

  const handleReadability = async () => {
    const text = editor.getText();
    if (text.length < 50) {
      toast.error("Article matches require more content for analysis");
      return;
    }

    setIsOpen(false);

    await generate(
      "Analyzing readability...",
      () => analyzeReadability(text),
      (result) => {
        if (result) {
          toast(
            <div className="space-y-2">
              <div className="font-bold flex items-center gap-2">
                <BookOpen size={16} />
                Score: {result.score}/100 ({result.grade})
              </div>
              <ul className="text-xs list-disc pl-4 space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>,
            { duration: 5000 }
          );
        }
      }
    );
  };

  const handleTranslate = async (targetLang: 'en' | 'bn') => {
    const { from, to, empty } = editor.state.selection;
    const selectedText = empty ? editor.getText() : editor.state.doc.textBetween(from, to, '\n');

    if (!selectedText || selectedText.length < 5) {
        toast.error("Please select text or write content to translate");
        return;
    }

    setIsOpen(false);

    await generate(
        `Translating to ${targetLang === 'en' ? 'English' : 'Bengali'}...`,
        () => translateText(selectedText, targetLang),
        (translatedBase) => {
            if (translatedBase) {
                // If text was selected, replace it. If not, append to bottom (or replace all? safer to replace/insert at cursor)
                // If empty selection, we decided to translate WHOLE doc above, but let's just append for safety or replace? 
                // Let's stick to: if selected, replace. If not, toast copy or append?
                // Better UX: Insert at cursor if empty, replace if selected.
                editor.chain().focus().insertContent(translatedBase).run();
                toast.success("Translation inserted!");
            }
        }
    );
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
          ${isGenerating 
            ? 'bg-blue-50 text-blue-400 cursor-not-allowed' 
            : isOpen 
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow'
          }
        `}
      >
        {isGenerating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} className={isOpen ? 'text-blue-600' : 'text-purple-600'} />
        )}
        <span>AI Assistant</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
          
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1.5 mb-1">
            Writing Tools
          </div>

          <button
            onClick={handleCompleteText}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2 group"
          >
            <Wand2 size={14} className="group-hover:text-blue-600" />
            Continue Writing
          </button>

          <button
            onClick={handleReadability}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2 group"
          >
            <BookOpen size={14} className="group-hover:text-blue-600" />
            Analyze Readability
          </button>

          <div className="h-px bg-gray-100 my-1.5 mx-1" />

          {/* Translation Section */}
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1.5 mb-1">
             Translation
          </div>
          <div className="grid grid-cols-2 gap-1 mb-1.5">
             <button
                onClick={() => handleTranslate('en')}
                className="px-2 py-1.5 rounded-md hover:bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex flex-col items-center gap-1"
             >
                <Globe size={12} />
                To English
             </button>
             <button
                onClick={() => handleTranslate('bn')}
                className="px-2 py-1.5 rounded-md hover:bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex flex-col items-center gap-1"
             >
                <Globe size={12} />
                To Bangla
             </button>
          </div>

           <div className="h-px bg-gray-100 my-1.5 mx-1" />

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1.5 mb-1">
            Tone Adjustment
          </div>

          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleToneAdjust('formal')}
              className="px-2 py-1.5 rounded-md hover:bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors text-center"
            >
              Formal
            </button>
            <button
              onClick={() => handleToneAdjust('conversational')}
              className="px-2 py-1.5 rounded-md hover:bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors text-center"
            >
              Casual
            </button>
            <button
              onClick={() => handleToneAdjust('urgent')}
              className="col-span-2 px-2 py-1.5 rounded-md hover:bg-red-50 border border-red-50 text-xs font-medium text-red-600 hover:text-red-700 transition-colors text-center"
            >
              Make Urgent / Breaking
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
