import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations and introspection need a direct connection — Neon's pooled
    // endpoint (the one in DATABASE_URL) cannot run them. Falls back to
    // DATABASE_URL for setups using an unpooled connection string throughout.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    // Optional. Neon can usually create a shadow database on the fly; set this
    // if your role lacks CREATE DATABASE and `migrate dev` complains.
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
