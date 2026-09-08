# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
npm run dev      # dev server (Turbopack) on :3000
npm run build    # production build; also runs the TypeScript check
npm run start    # serve the production build
npm run lint     # bare `eslint` (not `next lint`)
npx tsc --noEmit # type check on its own
```

There is no test runner configured and no test files. Adding one is a green-field decision — don't assume Jest/Vitest conventions exist.

## Neon MCP

Every Neon MCP call targets the **`devstash`** project, **`development`** branch. Pass both IDs explicitly on every call:

- `projectId: "jolly-dew-18370578"` — the `devstash` project
- `branchId: "br-aged-river-ay5hzhqm"` — the `development` branch

**`branchId` is not optional.** Omitting it sends the query to the project's _default_ branch, which here is `production` (`br-hidden-truth-ayhwifv4`). A missing `branchId` is a production query, not a safe no-op.

Never touch `production` — read or write — unless I name it in that request. Naming it once does not carry to the next request. This covers every Neon MCP tool, not just `run_sql`: schema inspection, migrations (`prepare_database_migration` / `complete_database_migration`), branch creation and deletion, query tuning, logs.

Destructive SQL (`DROP`, `DELETE`, `TRUNCATE`, `UPDATE`/`ALTER` without a narrow `WHERE`) needs my explicit go-ahead first, on `development` too.

Migrations still run through Prisma per @context/coding-standards.md, not the Neon MCP migration tools. `.env` currently has no `DIRECT_URL` set, so `prisma.config.ts` falls back to `DATABASE_URL` (the pooled connection) for migrations too — works, but isn't the documented best practice of migrating over a direct connection. Set `DIRECT_URL` to the `development` branch's direct connection string to close that gap. A production deploy needs `DIRECT_URL=<prod url> npx prisma migrate deploy` set explicitly for that one command regardless.

## Stack

Next.js 16.3.1 (App Router, Turbopack), React 19.2, TypeScript strict, Tailwind CSS v4.

## Architecture notes

**Feature-driven layout.** Domain code lives under `src/features/[feature]/`, not in one flat components folder. Import alias `@/*` maps to `./src/*`.

```
src/
  app/                     routes only — layout.tsx, page.tsx, route segments
  components/
    layout/                app shell chrome (AppSidebar, SidebarBrand, TopBar)
    ui/                    shadcn primitives — do not hand-edit, re-add instead
  features/
    <feature>/
      components/          feature UI
      lib/                 feature data access and logic
      types.ts             feature domain types
      index.ts             public API — the only path outsiders import
  hooks/                   shared hooks
  lib/                     shared utils + prisma.ts (the client singleton)
```

Current features: `items`, `collections`, `dashboard`, `user`.

Rules that matter:

- **Import features through their barrel.** `import { ItemRow } from "@/features/items"` — never `@/features/items/components/ItemRow`. Inside a feature, import its own files by full path.
- **A feature owns its slice of the UI wherever it appears.** The sidebar's Types section is `features/items/ItemTypesNav`; the Collections section is `features/collections/CollectionsNav`. `components/layout/AppSidebar.tsx` only composes them.
- **Dependency direction is one-way.** Today: `dashboard` → `items`, `dashboard` → `collections`, `collections` → `items`, `user` → `items`, `user` → `collections` (the profile page's usage stats). Nothing imports `dashboard` or `user`. Don't add a reverse edge; if two features need each other, the shared part belongs in `src/lib/` or a new feature.
- **Only a feature's `lib/` touches Prisma.** Components go through the feature's `lib/` — `items/lib/items.ts`, `collections/lib/collections.ts` and `user/lib/user.ts` are the only modules that import `@/lib/prisma`. All three, and `src/lib/prisma.ts` itself, start with `import "server-only";` so a client component that reaches for them fails at build instead of dragging the Neon adapter into the browser bundle. Server Actions that mutate (`user/actions.ts`) stay thin — they check the session and validate input, then delegate the actual Prisma call to `lib/`.
- **Every query is scoped to the current user.** NextAuth has landed, but the dashboard data layer hasn't been migrated onto it yet — item and collection queries still scope by a hardcoded `DEMO_USER_EMAIL` constant (`src/features/items/lib/items.ts`, `src/features/collections/lib/collections.ts`) rather than the signed-in session's user. `Item.collectionId` has no composite foreign key tying it to `Item.userId`, so a collection's own scope does not vouch for the items inside it.

**Read `node_modules/next/dist/docs/` before writing Next.js code.** This is v16 and the conventions differ from older App Router material. Two that bite immediately:

- **Route props helpers.** `PageProps<'/route'>` and `LayoutProps<'/route'>` are _global_ types — no import. They're generated by `next dev`, `next build`, or `next typegen`, so a clean checkout won't typecheck until one of those has run.
- **`params`/`searchParams` are Promises** and must be awaited.

**Tailwind v4 has no `tailwind.config.js`.** It's wired through PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`) and configured _in CSS_ via `@theme` / `@theme inline` blocks in `src/app/globals.css`. Don't create a JS config file.

**Data-driven colours use a CSS variable, not a static class.** Item types and collections carry a hex colour in the data, so components set it through `style={{ "--type-color": ... }}` and apply it with `text-(--type-color)`. This is the one sanctioned exception to the "no inline styles" rule.

## Deliberate current state

- The dashboard UI is built out at `/dashboard`; `src/app/page.tsx` is still a bare placeholder.
- Items and collections render from Neon via Prisma (`src/features/*/lib/`). Auth is fully built — NextAuth v5 with GitHub OAuth and credentials (email/password), custom `/sign-in` and `/register` pages, email verification on registration via Resend (toggleable with `EMAIL_VERIFICATION_ENABLED`) — and the sidebar shows the real signed-in user; there is no mock user left. The dashboard's own data queries haven't caught up to this yet, though — see the `DEMO_USER_EMAIL` note above. `/profile` inherits the same gap: its own info (name, email, avatar, join date) comes from the real signed-in session, but its usage stats reuse `items`/`collections`' existing `DEMO_USER_EMAIL`-scoped functions, so they're only accurate when signed in as the seeded demo user.
- The sidebar and cards link to `/items/[type]`, `/items/[type]/[id]`, `/collections` and `/collections/[id]`. **None of those routes exist yet** — the links 404 on purpose.
- `src/app/favicon.ico` is still the stock Next.js logo.
- `public/` does not exist. Recreate the directory if static assets are needed; Next.js picks it up with no config.
