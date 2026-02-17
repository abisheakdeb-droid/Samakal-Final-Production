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
      clientId: (() => {
        const id = process.env.GOOGLE_CLIENT_ID;
        console.log(`[AUTH_DEBUG] Initializing Google Provider with Client ID: ${id ? id.slice(0, 10) + "..." : "MISSING"}`);
        return id;
      })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
