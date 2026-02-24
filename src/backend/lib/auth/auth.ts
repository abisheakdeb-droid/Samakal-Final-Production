import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
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

            if (!user) return null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return user as any;
          } catch (error) {
            console.error("[AUTH_ERROR] prisma.user.findUnique failed:", error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "reader";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).avatar = token.picture;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.picture = (user as any).image;
      }

      if (trigger === "update" && session?.avatar) {
        token.picture = session.avatar;
      }

      return token;
    }
  },
});
