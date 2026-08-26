# Explain Action

Run this **before `/feature complete`** — once the branch is merged and you are back on `main`, the diff is empty.

1. Read `context/current-feature.md` to understand what was implemented.
2. List the files this branch changed:

   ```bash
   git diff main...HEAD --name-only
   ```

   Use `main...HEAD` (three dots). Two dots compares `main` against your working tree and mixes in uncommitted edits.
3. For each file created or modified:
   - Show the file path
   - Give a 1-2 sentence explanation of what it does / what changed
   - Highlight any key functions, components, or patterns used
4. End with a brief summary of how the pieces fit together.

## Output Format

**Files Changed**

**path/to/file.ts** (new)
Brief explanation of what this file does and why it was added.

**path/to/other.ts** (modified)
What changed and why.

**How It All Connects**

Brief summary of the data/control flow between these files.
