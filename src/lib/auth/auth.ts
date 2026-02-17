import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any, // Cast to any due to subtle version mismatches in @auth/core types
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data;
          try {
            const user = await prisma.user.findUnique({
              where: { email }
            });

            console.log("[AUTH_DEBUG] User find result:", user ? "Found" : "Not Found", email);

            if (!user) return null;

            return user as any;
          } catch (error) {
            console.error("[AUTH_ERROR] prisma.user.findUnique failed:", error);
            return null;
          }
        }

        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "reader";
        (session.user as any).avatar = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.picture = (user as any).image;
      }

      // Handle manual updates to session
      if (trigger === "update" && session?.avatar) {
        token.picture = session.avatar;
      }

      return token;
    }
  },
});
