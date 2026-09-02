import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

// Edge-compatible: providers only, no Prisma adapter. Used directly by
// src/proxy.ts (which runs on the edge runtime) and spread into the full
// config in src/auth.ts. Credentials needs bcrypt + Prisma to actually
// validate, neither of which is edge-safe, so this is a placeholder —
// src/auth.ts replaces the whole providers array with the real one.
export const authConfig = {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
