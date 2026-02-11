"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;
      // Prevent the mini-infobar from appearing on mobile
      installEvent.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(installEvent);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">S.</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Install Samakal App
            </h3>
            <p className="text-xs text-gray-500">
              Faster load times & offline reading.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-brand-red text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition"
          >
            Install
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
