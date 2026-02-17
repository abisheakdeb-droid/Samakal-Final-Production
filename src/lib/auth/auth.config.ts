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
} satisfies NextAuthConfig;

// CRITICAL: Verification log for Vercel
if (typeof window === 'undefined') {
  const cid = process.env.GOOGLE_CLIENT_ID || "";
  const maskedCid = cid ? `${cid.slice(0, 10)}...${cid.slice(-10)}` : "MISSING";
  console.log(`[AUTH_VERIFY] Current Client ID in use: ${maskedCid}`);
  console.log(`[AUTH_VERIFY] Current Client Secret present: ${!!process.env.GOOGLE_CLIENT_SECRET}`);
}
