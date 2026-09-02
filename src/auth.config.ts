import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-compatible: providers only, no Prisma adapter. Used directly by
// src/proxy.ts (which runs on the edge runtime) and spread into the full
// config in src/auth.ts.
export const authConfig = {
  providers: [GitHub],
} satisfies NextAuthConfig;
