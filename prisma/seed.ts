import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const DEMO_EMAIL = "demo@devstash.io";
const PASSWORD_ROUNDS = 12;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

/**
 * System item types are global (userId null) and shared by every user.
 * Postgres treats NULLs as distinct, so @@unique([userId, name]) does not
 * actually constrain them — look them up by name instead of upserting.
 */
const SYSTEM_ITEM_TYPES = [
  { name: "Snippets", icon: "Code", color: "#3b82f6" },
  { name: "Prompts", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Commands", icon: "Terminal", color: "#f97316" },
  { name: "Notes", icon: "StickyNote", color: "#fde047" },
  { name: "Files", icon: "File", color: "#6b7280" },
  { name: "Images", icon: "Image", color: "#ec4899" },
  { name: "Links", icon: "Link", color: "#10b981" },
] as const;

type TypeName = (typeof SYSTEM_ITEM_TYPES)[number]["name"];

interface SeedItem {
  title: string;
  description: string;
  type: TypeName;
  content?: string;
  url?: string;
  language?: string;
  tags: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
}

interface SeedCollection {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        title: "useDebounce",
        description: "Delays a rapidly changing value until it settles",
        type: "Snippets",
        language: "typescript",
        tags: ["react", "hooks", "typescript"],
        isPinned: true,
        isFavorite: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        title: "useLocalStorage",
        description: "State that persists to localStorage and survives reloads",
        type: "Snippets",
        language: "typescript",
        tags: ["react", "hooks", "typescript"],
        isFavorite: true,
        content: `import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Private mode and quota errors are not worth crashing over.
      }
    },
    [key]
  );

  return [value, update] as const;
}`,
      },
      {
        title: "Theme Context Provider",
        description: "Context provider with a hook that fails loudly outside it",
        type: "Snippets",
        language: "typescript",
        tags: ["react", "context", "typescript"],
        content: `"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        title: "Focused Code Review",
        description: "Asks for a review with findings, not a rewrite",
        type: "Prompts",
        tags: ["ai", "review", "prompt"],
        isPinned: true,
        isFavorite: true,
        content: `Review the diff below. Focus on correctness, edge cases and security.

Do not rewrite the code. List each finding as:
- file and line
- what is wrong
- the smallest fix that addresses it

If you find nothing worth changing, say so instead of inventing suggestions.`,
      },
      {
        title: "Generate Function Docs",
        description: "Writes doc comments from the implementation only",
        type: "Prompts",
        tags: ["ai", "docs", "prompt"],
        content: `Write a doc comment for each exported function below.

Rules:
- Describe what it does and what it returns, not how it is implemented.
- Document every parameter, including units and accepted ranges.
- Note anything that throws.
- Do not restate the function name as prose.
- Infer only from the code shown. If behaviour is ambiguous, say so.`,
      },
      {
        title: "Refactoring Assistant",
        description: "Proposes behaviour-preserving refactors, ranked by payoff",
        type: "Prompts",
        tags: ["ai", "refactor", "prompt"],
        content: `Suggest refactors for the code below that preserve behaviour exactly.

For each suggestion give:
1. the smell (duplication, long function, unclear naming, deep nesting)
2. the change, as a diff
3. what could break, and how to verify it did not

Rank by payoff over risk. Skip cosmetic changes.`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Multi-stage Node Dockerfile",
        description: "Builds in one stage, ships a slim runtime image",
        type: "Snippets",
        language: "dockerfile",
        tags: ["docker", "ci-cd"],
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy with Migrations",
        description: "Applies pending migrations before starting the new build",
        type: "Commands",
        language: "bash",
        tags: ["deployment", "ci-cd"],
        content: `npx prisma migrate deploy && npm run build && npm run start`,
      },
      {
        title: "Docker Build Best Practices",
        description: "Official guidance on layer caching and image size",
        type: "Links",
        url: "https://docs.docker.com/build/building/best-practices/",
        tags: ["docker", "docs"],
      },
      {
        title: "GitHub Actions Documentation",
        description: "Workflow syntax, runners and reusable actions",
        type: "Links",
        url: "https://docs.github.com/en/actions",
        tags: ["ci-cd", "docs"],
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
    items: [
      {
        title: "Undo Last Commit, Keep Changes",
        description: "Moves HEAD back one commit and leaves the work staged",
        type: "Commands",
        language: "bash",
        tags: ["git", "shell"],
        isPinned: true,
        content: `git reset --soft HEAD~1`,
      },
      {
        title: "Prune Docker Disk Usage",
        description: "Removes stopped containers, unused images and build cache",
        type: "Commands",
        language: "bash",
        tags: ["docker", "shell"],
        isFavorite: true,
        content: `docker system prune -a --volumes`,
      },
      {
        title: "Kill Whatever Owns a Port",
        description: "Finds the process holding a port and stops it",
        type: "Commands",
        language: "bash",
        tags: ["process", "shell"],
        content: `lsof -ti :3000 | xargs kill -9`,
      },
      {
        title: "Find Heaviest Dependencies",
        description: "Lists installed packages by size, largest first",
        type: "Commands",
        language: "bash",
        tags: ["npm", "shell"],
        content: `du -sh node_modules/* | sort -rh | head -20`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Documentation",
        description: "Utility reference and the v4 CSS-first theme config",
        type: "Links",
        url: "https://tailwindcss.com/docs",
        tags: ["css", "tailwind", "docs"],
        isFavorite: true,
      },
      {
        title: "shadcn/ui",
        description: "Copy-in components built on Radix primitives",
        type: "Links",
        url: "https://ui.shadcn.com",
        tags: ["ui", "docs"],
      },
      {
        title: "Material Design 3",
        description: "Design system covering tokens, layout and motion",
        type: "Links",
        url: "https://m3.material.io",
        tags: ["design", "ui"],
      },
      {
        title: "Lucide Icons",
        description: "The open-source icon set this project renders",
        type: "Links",
        url: "https://lucide.dev",
        tags: ["icons", "design"],
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("12345678", PASSWORD_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`  user           ${user.email}`);

  // System types are shared, and items reference them with ON DELETE RESTRICT,
  // so they are created once and updated in place rather than replaced.
  const typeIds = new Map<TypeName, string>();
  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null, isSystem: true },
    });

    const saved = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color },
        })
      : await prisma.itemType.create({
          data: { ...type, isSystem: true },
        });

    typeIds.set(type.name, saved.id);
  }
  console.log(`  item types     ${typeIds.size}`);

  // Everything below is owned by the demo user, so it can be rebuilt from
  // scratch on every run without touching anyone else's rows. Deleting items
  // cascades their ItemTag joins away.
  await prisma.item.deleteMany({ where: { userId: user.id } });
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.tag.deleteMany({ where: { userId: user.id } });

  let itemCount = 0;

  for (const collection of COLLECTIONS) {
    const saved = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        userId: user.id,
      },
    });

    for (const item of collection.items) {
      const typeId = typeIds.get(item.type);
      if (!typeId) {
        throw new Error(`Unknown item type "${item.type}" on "${item.title}"`);
      }

      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          contentType: "text",
          content: item.content ?? null,
          url: item.url ?? null,
          language: item.language ?? null,
          isPinned: item.isPinned ?? false,
          isFavorite: item.isFavorite ?? false,
          userId: user.id,
          typeId,
          collectionId: saved.id,
          tags: {
            create: item.tags.map((name) => ({
              tag: {
                // Tags are unique per user, so this reuses them across items.
                connectOrCreate: {
                  where: { userId_name: { userId: user.id, name } },
                  create: { name, userId: user.id },
                },
              },
            })),
          },
        },
      });
      itemCount += 1;
    }

    console.log(`  collection     ${collection.name} (${collection.items.length} items)`);
  }

  const tagCount = await prisma.tag.count({ where: { userId: user.id } });
  console.log(`\nSeeded ${itemCount} items and ${tagCount} tags for ${user.email}.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
