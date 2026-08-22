# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions and simple mutations
- Use API routes when you need:
  - Webhooks (Stripe, GitHub, etc.)
  - File uploads with progress tracking
  - Long-running operations
  - Specific HTTP status codes or headers
  - Endpoints for future mobile/CLI clients
  - Third-party integrations
- Otherwise, fetch data directly in server components
- Dynamic routes for item/collection pages

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

Example v4 configuration:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

## File Organization

**We use a feature-driven architecture.** Domain code is grouped by feature, not by file kind.

```
src/
  app/[route]/page.tsx              routes only — compose features, no domain logic
  components/layout/                app shell chrome (sidebar, top bar)
  components/ui/                    shadcn primitives
  features/[feature]/
    components/ComponentName.tsx    feature UI
    lib/[utility].ts                feature data access and logic
    actions.ts                      feature Server Actions
    types.ts                        feature domain types
    index.ts                        public API
  hooks/                            shared hooks
  lib/[utility].ts                  shared utils
```

- A feature owns its UI wherever it renders — including its section of the sidebar.
- **Import features only through their barrel**: `@/features/items`, never `@/features/items/components/ItemRow`. Within a feature, import its own files by full path.
- Keep feature dependencies one-way. If two features need each other, extract the shared part to `src/lib/` or a new feature.
- Only a feature's `lib/` touches the data source. Components call the feature's `lib/`, never Prisma or mock data directly.
- Put something in `src/lib/` or `src/hooks/` only when more than one feature genuinely needs it.

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable
- No inline styles, with one exception: colours that come from data (item type
  and collection colours) are passed as a CSS custom property and applied with a
  Tailwind utility — `style={{ "--type-color": type.color }}` plus
  `className="text-(--type-color)"`. Never hardcode a colour in `style`.
- Dark mode first, light mode as option

## Database

- Use Prisma ORM for all database operations
- Always use `prisma migrate dev` for schema changes (not `db push`)
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production deployments must run `prisma migrate deploy` before the app starts

## Data Fetching

- Server components fetch through the feature's `lib/`, which is the only layer that talks to Prisma
- Client components use Server Actions from the feature's `actions.ts`
- Validate all inputs with Zod

## Error Handling

- Use try/catch in Server Actions
- Return `{ success, data, error }` pattern from actions
- Display user-friendly error messages via toast

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
