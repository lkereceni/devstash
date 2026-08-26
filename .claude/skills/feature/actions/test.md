# Test Action

> **This project has no test runner.** No `test` script in `package.json`, no test files, no Vitest or Jest dependency. `CLAUDE.md` calls adding one "a green-field decision — don't assume Jest/Vitest conventions exist," so this action does not pick one for you.

## 1. Check what exists

```bash
grep -n '"test"' package.json
grep -nE 'vitest|jest' package.json
```

If no runner is configured, **stop and ask** whether to add one and which. Do not install a framework as a side effect of running this action.

## 2. Once a runner exists

1. Read `context/current-feature.md` to see what was implemented.
2. Identify what this branch added or changed in the feature `lib/` files and any Server Actions (`src/features/*/actions.ts`). No feature has an `actions.ts` yet — today the testable surface is the `lib/` data functions and anything in `src/lib/`.
3. Check which of them already have tests.
4. Write tests only where there is real logic to pin down — derivation, branching, error handling. Skip components; skip trivial pass-throughs. Do not write tests just to write them. Use your best judgement.
5. Cover the happy path and the error cases.
6. Run the suite and report what it covers for the new feature code.

Until step 1 is resolved, `npm run build` in `/feature review` is the verification gate.
