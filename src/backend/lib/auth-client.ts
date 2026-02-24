import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [], // Configured in auth.ts (server-side only) but NextAuth v5 splits config
});
