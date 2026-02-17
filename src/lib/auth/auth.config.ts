import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized() {
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;

// Safe runtime check (logs to Vercel dashboard)
if (typeof window === 'undefined') {
  console.log("[AUTH_INIT] GOOGLE_CLIENT_ID present:", !!process.env.GOOGLE_CLIENT_ID);
  console.log("[AUTH_INIT] GOOGLE_CLIENT_SECRET present:", !!process.env.GOOGLE_CLIENT_SECRET);
}
