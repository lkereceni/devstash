# Review Action

The gate before `complete`. Read `context/current-feature.md` for the goals, then check the branch against them.

## 1. Get the diff

```bash
git diff main...HEAD --stat
git diff main...HEAD
```

## 2. Run the checks

```bash
npm run build      # production build, type-checks too
npm run lint
```

Both must pass. A failure here is a blocker, not a note.

## 3. Architecture conformance

Mechanical — run them, don't eyeball:

```bash
# deep imports past a feature barrel (expect empty)
grep -rn '@/features/[a-z-]*/' src --include='*.ts' --include='*.tsx' | grep -v '^src/lib/mock-data.ts'

# components reaching the data layer directly (expect empty)
grep -rn 'mock-data\|@/lib/prisma' src/features/*/components/

# reverse dependency — items must not import collections (expect empty)
grep -rn '@/features/collections' src/features/items/

# Tailwind v3 config sneaking in (expect no such file)
ls tailwind.config.* 2>/dev/null
```

Then read for: `'use client'` on a component that doesn't need it, a component bypassing its feature's `lib/`, new code in `src/lib/` that only one feature uses.

## 4. Report

- ✅ Goals met
- ❌ Goals missing or incomplete
- ⚠️ Code quality issues or bugs
- 🏗️ Architecture violations (step 3)
- 🚫 Scope creep — code beyond the goals

Verdict: **ready to complete**, or the specific list of changes needed.

`/code-review` complements this on the same diff — it hunts correctness bugs, this checks goals and conventions.
