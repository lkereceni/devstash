# Current Feature

<!-- Feature Name -->

Dashboard collections from the database

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js 16 + Tailwind CSS v4 setup (App Router, TypeScript strict); committed and pushed to GitHub
- Mock data as the single source of truth for the dashboard UI (@src/lib/mock-data.ts); committed and pushed to GitHub
- Dashboard UI Phase 1 (layout shell): ShadCN init (radix base, nova preset), `/dashboard` route and layout, top bar with search and buttons, placeholder sidebar/main, dark mode by default, Geist wired to `--font-sans`
- Dashboard UI Phase 2 (sidebar): ShadCN sidebar/avatar/collapsible/separator, collapsible Types group linking to `/items/[type]`, Collections group with favorites and recent, brand header, user footer, top bar drawer trigger with cookie-persisted state, icon rail on desktop and Sheet drawer on mobile
- Dashboard UI Phase 3 (main area): ShadCN card/badge, 4 stats cards, collections grid with per-collection type icons, pinned items, 10 most recent items, shared section header, derived data helpers in @src/lib/dashboard.ts
- Feature-driven architecture: `src/features/[feature]/` (items, collections, dashboard, user) each owning components/lib/types behind an `index.ts` barrel, app shell chrome moved to @src/components/layout, `src/lib/dashboard.ts` split across the features, domain types moved out of @src/lib/mock-data.ts, architecture notes rewritten in @CLAUDE.md and file organization rules updated in @context/coding-standards.md
- Neon PostgreSQL + Prisma ORM setup: Prisma 7 (`prisma-client` generator into @src/generated/prisma, datasource URL in `prisma.config.ts`, Neon driver adapter), initial schema for `User`/`Item`/`ItemType`/`Collection`/`Tag`/`ItemTag` plus NextAuth `Account`/`Session`/`VerificationToken`, foreign-key and lookup indexes, cascade rules (user-owned cascades, `Item.collection` set null, `Item.type` restrict), client singleton in @src/lib/prisma.ts, `.env.example` documenting `DATABASE_URL`/`DIRECT_URL`, `init` migration created and applied to the Neon development branch
- Database seed script: `prisma/seed.ts` run through `migrations.seed` in @prisma.config.ts via tsx, demo user (bcryptjs, 12 rounds), 7 system item types, 5 collections and 18 items with 21 reused tags via `connectOrCreate`, idempotent by rebuilding only the demo user's rows; `StickyNote` added to `ITEM_TYPE_ICONS` and @src/lib/mock-data.ts icons/colours synced to the spec
- Plural snake_case database naming: `@@map`/`@map` across the schema (model names stay singular so the client is still `prisma.user`), applied by a hand-generated migration of 85 `ALTER ... RENAME` statements instead of the drop/create Prisma emits for `@@map` changes, so no rows were lost; verified with `prisma migrate diff` reporting no difference
- Dashboard collections from the database: @src/features/collections/lib/collections.ts swapped from mock data to Prisma (`getFavoriteCollections`, `getRecentCollections`, new `getCollectionStats`), every query scoped to the seeded demo user by email as a stand-in until NextAuth lands; card accent colour derived from the type a collection holds most of (the `collections.color` column stays unused), with the type icon row and item count coming from `_count.items` and one `item.groupBy` for the whole grid instead of a lookup per card; `CollectionsNav` split into an async server component that fetches and a client `CollectionsNavGroup`, keeping Prisma out of the client bundle; the two collection stats cards read from the database while item stats stay on mock data; unused `collections` array dropped from @src/lib/mock-data.ts. Data access lives in the feature's `lib/` rather than the `src/lib/db/collections.ts` named in @context/features/dashboard-collections-spec.md, to keep the one-data-layer-per-feature rule in @CLAUDE.md
