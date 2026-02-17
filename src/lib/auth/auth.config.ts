import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/', // Use a modal instead of a dedicated page, or create a /login page later
  },
  callbacks: {
    authorized() {
      return true; // Allow all pages for now, individual components will handle gating
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
