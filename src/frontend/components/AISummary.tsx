"use client";

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, X, BrainCircuit, Wand2 } from 'lucide-react';
import clsx from 'clsx';

export default function AISummary({ summary }: { summary: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'visible'>('idle');
  const [displayedText, setDisplayedText] = useState('');
  const [loadingText, setLoadingText] = useState('Analysis In Progress...');

  // --- STREAMING TEXT EFFECT ---
  useEffect(() => {
    if (status === 'visible') {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= summary.length) {
          setDisplayedText(summary.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 15); // Speed of typing (15ms per char)
      return () => clearInterval(interval);
    } else {
        setDisplayedText(''); // Reset on close
    }
  }, [status, summary]);

  // --- LOADING MESSAGE ROTATION ---
  useEffect(() => {
      if (status === 'loading') {
          const messages = [
              "Extracting Key Points...",
              "Analyzing Context...",
              "Synthesizing Summary..."
          ];
          let i = 0;
          const interval = setInterval(() => {
              i = (i + 1) % messages.length;
              setLoadingText(messages[i]);
          }, 600);
          return () => clearInterval(interval);
      }
  }, [status]);

  const handleGenerate = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('visible');
    }, 2000); // 2s thinking time
  };

  // --- IDLE STATE ---
  if (status === 'idle') {
    return (
      <div className="my-8">
        <button 
            onClick={handleGenerate}
            className="relative group overflow-hidden pl-1 pr-6 py-1.5 rounded-full border border-teal-200/50 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 w-fit"
        >
             <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles size={14} className="animate-pulse" />
                 </div>
                 <span className="font-semibold text-sm bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
                    AI সারাংশ পড়ুন
                 </span>
             </div>
        </button>
      </div>
    );
  }

  // --- LOADING STATE (Thinking) ---
  if (status === 'loading') {
    return (
      <div className="my-8">
         <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-4 w-full md:w-2/3">
             {/* Fluid Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-50 to-transparent animate-shimmer opacity-50" />
            
            <div className="relative flex items-center gap-4 z-10">
                 <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-teal-100">
                    <BrainCircuit size={20} className="text-teal-500 animate-spin-slow" /> 
                 </div>
                 <div className="flex flex-col gap-1">
                     <span className="text-sm font-bold text-gray-700">{loadingText}</span>
                     <div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
                         <div className="h-full bg-teal-500 rounded-full animate-progress-indeterminate" />
                     </div>
                 </div>
            </div>
         </div>
      </div>
    );
  }

  // --- RESULT STATE (Content) ---
  return (
    <div className="my-8 animate-fade-in-up">
        <div className={clsx(
            "relative bg-white/40 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-xl overflow-hidden transition-all duration-500",
            status === 'visible' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
             {/* Magic Gradient Border Top */}
            <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 animate-gradient-xy" />

            <div className="relative p-6 md:p-8">
               {/* Background Decoration */}
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                   <BrainCircuit size={120} />
               </div>

               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                                <Wand2 size={16} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">AI Summary</span>
                       </div>
                       <button 
                            onClick={() => setStatus('idle')} 
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                       >
                           <X size={16} />
                       </button>
                   </div>
                   
                   <p className="text-gray-800 text-lg leading-relaxed font-medium min-h-[60px]">
                       {displayedText}
                       <span className="inline-block w-1.5 h-5 ml-1 align-middle bg-teal-500 animate-pulse" />
                   </p>

                   <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                       <span>Models: GPT-4 + Claude 3.5</span>
                       <span>Confidence: 98%</span>
                   </div>
               </div>
            </div>
        </div>
    </div>
  );
}
