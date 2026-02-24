"use client";

import { useEffect, useRef } from "react";
import { recordView } from "@/lib/actions-history";

export default function HistoryTracker({ articleId }: { articleId: string }) {
    // Use a ref to ensure we only try to record once per mount/session
    // although useEffect with empty dep array does this, strict mode might fire twice in dev.
    const hasRecorded = useRef(false);

    useEffect(() => {
        if (hasRecorded.current) return;
        
        // Wait a few seconds to count as a "view" (e.g., 5 seconds)
        // This avoids counting immediate bounces.
        const timer = setTimeout(async () => {
            try {
                await recordView(articleId);
                hasRecorded.current = true;
            } catch (error) {
                console.error("Failed to record view", error);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [articleId]);

    return null; // Invisible component
}
