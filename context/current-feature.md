# Current Feature

<!-- Feature Name -->

Dashboard UI — Phase 3 (main area)

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
