---
name: list-components
description: List project components
allowed-tools: Bash(find:*)
---

## Files

!`find src/components src/features/*/components -name '*.tsx' -type f 2>/dev/null | sort`

## Task

List the component files above. If an argument was passed (it arrives as an
`ARGUMENTS:` line at the end of this prompt), keep only paths containing it.
Otherwise list all of them.

## Output Format

- Numbered list, paths relative to the repo root
- Grouped by area: `components/layout`, `components/ui` (shadcn primitives), then each feature
- One-line description per file, inferred from the filename
- Total count at the end

If nothing matches, say "No components found."
