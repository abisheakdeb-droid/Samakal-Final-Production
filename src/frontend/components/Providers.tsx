"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { UIProvider } from "@/context/UIContext";
import type { Session } from "next-auth";

export default function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }));

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <UIProvider>
                    {children}
                </UIProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
