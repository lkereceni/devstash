# Current Feature

<!-- Feature Name -->

Dashboard UI — Phase 1 (layout shell)

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Initialize ShadCN UI and install the components needed for the shell
- Dashboard route at `/dashboard`
- Main dashboard layout plus any global styles it needs
- Dark mode by default
- Top bar with search plus "New Collection" and "New Item" buttons (display only, no behaviour)
- Placeholder sidebar and main area — just an `h2` reading "Sidebar" and "Main" for now

## Notes

<!-- Any extra notes -->

- Phase 1 of 3. Full spec: @context/features/dashboard-phase-1-spec.md
- Layout reference: @context/screenshots/dashboard-ui-main.png
- Mock data to render against once phases 2/3 land: @src/lib/mock-data.ts
- Scope is the shell only — no item cards, collection cards or sidebar contents yet.

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js 16 + Tailwind CSS v4 setup (App Router, TypeScript strict); committed and pushed to GitHub
- Mock data as the single source of truth for the dashboard UI (@src/lib/mock-data.ts); committed and pushed to GitHub
- Dashboard UI Phase 1 (layout shell): ShadCN init (radix base, nova preset), `/dashboard` route and layout, top bar with search and buttons, placeholder sidebar/main, dark mode by default, Geist wired to `--font-sans`
