"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getLastModifiedTimestamp } from "@/lib/actions-article";
import { toast } from "sonner";

export default function NewsUpdater() {
  const router = useRouter();
  const lastTimestampRef = useRef<number>(0);

  useEffect(() => {
    // Initial fetch to set baseline
    const init = async () => {
        const ts = await getLastModifiedTimestamp();
        lastTimestampRef.current = ts;
    };
    init();

    const interval = setInterval(async () => {
      const serverTs = await getLastModifiedTimestamp();
      
      // If server has newer content than our baseline
      if (serverTs > lastTimestampRef.current) {
        if (lastTimestampRef.current !== 0) { // Don't refresh on first load mismatch
            console.log("New content detected, refreshing...");
            router.refresh(); // Soft refresh
            toast("New articles published!", {
                description: "Page updated with latest news.",
                duration: 3000,
            });
        }
        lastTimestampRef.current = serverTs;
      }
    }, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [router]);

  return null; // Headless component
}
