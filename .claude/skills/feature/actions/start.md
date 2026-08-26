# Start Action

## 1. Preflight

1. Read `context/current-feature.md`. If Goals is empty, stop: `Run /feature load first`.
2. Check the working tree is clean (`git status --porcelain`) and you are on `main`. If not, stop and say why — don't stash or branch off unrelated work.

## 2. Branch

Name it `feature/<slug>` (or `fix/<slug>` for a fix):

- **From a spec** — the spec filename minus the `-spec` suffix. `context/features/stats-sidebar-spec.md` → `feature/stats-sidebar`. That is what the existing history uses; keep it consistent.
- **From an inline description** — kebab-case the feature name, two or three words.

```bash
git switch -c feature/<slug>
```

Then set Status to `In Progress`.

## 3. Implement

List the goals, then work them one at a time.

**Read `context/coding-standards.md` before writing code**, and follow the architecture in `CLAUDE.md`. The rules that get broken most often:

- Domain code lives in `src/features/<feature>/` — `components/`, `lib/`, `types.ts`, `index.ts`. Not a flat components folder.
- Import other features through their barrel only: `@/features/items`, never `@/features/items/components/ItemRow`. Within a feature, import its own files by full path.
- Dependencies are one-way (`collections` → `items` today). If two features need each other, the shared part moves to `src/lib/` or a new feature.
- Only a feature's `lib/` touches Prisma or `@/lib/mock-data`. Components go through the feature's `lib/`.
- A feature owns its UI wherever it renders, including its section of the sidebar.
- Server components by default. Where a server component fetches and a client component needs the result, split them (see `CollectionsNav` / `CollectionsNavGroup`) so Prisma stays out of the client bundle.
- This is Next.js 16 — check `node_modules/next/dist/docs/` before using App Router APIs. `params`/`searchParams` are Promises; `PageProps<'/route'>` is global and generated.
- Tailwind v4: theme config lives in `@theme` blocks in `src/app/globals.css`. Never create `tailwind.config.{js,ts}`.
- Colours from data go through `style={{ "--type-color": … }}` plus `text-(--type-color)`. That is the only sanctioned inline style.

## 4. Verify as you go

Run `npm run build` (it type-checks too) and check the change in the browser on `:3000`. Fix failures before moving to the next goal.

Then `/feature review` once the goals are done.
