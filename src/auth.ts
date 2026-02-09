import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@/lib/db';
import type { User } from '@/lib/definitions';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user in auth.ts:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // Demo access bypass
          if (password === 'password') {
             const role = email.toLowerCase().includes('journalist') ? 'editor' : 'admin';
             
             // Try to fetch the real user to use their valid UUID
             const realUser = await getUser(email);

             return {
                id: realUser?.id || 'demo-user',
                name: realUser?.name || (role === 'admin' ? 'Master Admin' : 'Journalist'),
                email: email,
                role: realUser?.role || role,
             };
          }

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password as string);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub;
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.createdAt = user.createdAt;
      }
      return token;
    }
  },
});
