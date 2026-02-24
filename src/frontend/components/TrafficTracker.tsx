"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logVisitor } from "@/lib/actions-tracker";

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // We call the server action to log the visit
    // We pass the pathname so backend knows which page was visited
    logVisitor(undefined, pathname);
  }, [pathname]);

  return null; // This component handles logic only, no UI
}
