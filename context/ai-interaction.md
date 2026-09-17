# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the project spec
- Never delete files without clarification

## Workflow

This is the common workflow that we will use for every single feature/fix:

1. **Document** - Document the feature in @context/current-feature.md.
2. **Branch** - Create new branch for feature, fix, etc
3. **Implement** - Implement the feature/fix that I create in @context/current-feature.md
4. **Test** - Verify it works in the browser. Run `npm run test` for unit tests (see Testing below for scope) and `npm run build` to check for errors
5. **Iterate** - Iterate and change things if needed
6. **Commit** - Only after build passes and everything works
7. **Merge** - Merge to main
8. **Delete Branch** - Delete branch after merge
9. **Review** - Review AI-generated code periodically and on demand.
10. Mark as completed in @context/current-feature.md and add to history

Do NOT commit without permission and until the build and tests pass. If build or tests fail, fix the issues first.

## Testing

Vitest is configured (`vitest.config.mts`, `npm run test` / `npm run test:watch`), scoped to server actions and utilities only:

- **In scope**: Server Action files (`"use server"`, e.g. `src/features/user/actions.ts`) and pure/DB-backed helper functions in a feature's `lib/`.
- **Out of scope**: components. No jsdom/happy-dom, no React Testing Library, no rendering — `test.include` only matches `src/**/*.test.ts`, so a `.test.tsx` file is silently ignored rather than run.
- A Server Action test mocks its dependencies (`@/auth`, the feature's `lib/`) with `vi.mock`/`vi.hoisted` instead of hitting Prisma or Neon — these are unit tests, not integration tests against a live database.
- Not every function needs a test written proactively — add one when it's genuinely load-bearing (validation logic, auth checks, non-obvious formatting) or when fixing a bug there, not as a blanket rule for every new `lib/` function.

## Branching

We will create a new branch for every feature/fix. Name branch **feature/[feature]** or **fix[fix]**, etc. Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (feat:, fix:, chore:, etc.)
- Keep commits focused (one feature/fix per commit)
- Never put "Generated With Claude" in the commit messages

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase

## Code Review

Review AI-generated code periodically, especially for:

- Security (auth checks, input validation)
- Performance (unnecessary re-renders, N+1 queries)
- Logic errors (edge cases)
- Patterns (matches existing codebase?)
