# Test Action

Vitest is configured (`vitest.config.mts`, `npm run test` / `npm run test:watch`), scoped to server actions and utilities only — no components, no jsdom. `test.include` only matches `src/**/*.test.ts`. See `context/ai-interaction.md`'s Testing section for the full scope rule.

## 1. Identify the testable surface

1. Read `context/current-feature.md` to see what this branch implemented.
2. Identify what it added or changed in Server Actions (`src/features/*/actions.ts`) and `lib/` functions (feature `lib/` or `src/lib/`). Components are out of scope — skip them here regardless of how much UI the branch touched.
3. Check which of those already have a `*.test.ts` next to them.

## 2. Write tests where there's real logic

Write tests only where there is real logic to pin down — validation, branching, auth checks, error handling, non-obvious formatting/derivation. Skip trivial pass-throughs. Do not write tests just to write them; use your best judgement.

- A **Server Action** test mocks its dependencies (`@/auth`, the feature's `lib/`) with `vi.mock` + `vi.hoisted` rather than hitting Prisma or Neon — see `src/features/user/actions.test.ts` for the pattern. These are unit tests of the action's own logic (auth check, zod validation, delegation), not integration tests against a live database.
- A **utility** test (`src/lib/utils.test.ts`, `src/features/*/lib/format.test.ts` etc.) calls the real function directly — no mocking needed for a pure function.
- Cover the happy path and the error cases.

## 3. Run and report

```bash
npm run test
```

Report what the suite covers for the new feature code. `npm run build` in `/feature review` remains the separate type-check/build gate.
