"use client";

// SessionProvider and useSession are the only needed imports from next-auth
// We use server-side authentication via Server Actions mostly,
// but useSession hook is needed for getting user state in client components.
// Since we are moving to next-auth v5 which recommends server-side auth mostly,
// this context acts as a client-side bridge/state holder.

import { SessionProvider, useSession } from "next-auth/react";
import { handleSignOut } from '@/lib/actions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// Helper hook to access user easily
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  
  // No longer using tab-specific session guard as it conflicts with NextAuth state
  
  return {
    user: session?.user ? {
        id: (session.user as { id?: string }).id || 'unknown',
        name: session.user.name || 'Admin',
        role: (session.user as { role?: string }).role || 'editor',
        email: session.user.email,
        image: session.user.image
    } : null,
    isLoading,
    login: () => {}, 
    logout: async () => {
        await handleSignOut();
    } 
  };
}
