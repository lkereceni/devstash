# Load Action

Populate `context/current-feature.md` from a spec file or an inline description.

## 1. Resolve the argument

`$ARGUMENTS` (everything after `load`):

- **Empty** — error: `"load" requires a spec filename or a feature description`. List `context/features/` so the user can pick.
- **Single word** — treat as a spec name. Specs are named `{name}-spec.md`, so glob rather than assuming an exact filename:

  ```bash
  ls context/features/ | grep -i '^<name>'
  ```

  Match `context/features/{name}-spec.md` first, then `context/features/{name}.md`. If nothing matches, list the directory and stop — do not fall through to treating it as a description.
- **Multiple words** — treat as an inline feature description and derive the goals yourself.

## 2. Write current-feature.md

The file is a template whose HTML comments mark each slot. **Keep the comments, and keep the H1 as `# Current Feature`** — the feature name is not part of the heading.

| Slot | What goes there |
|------|-----------------|
| after `<!-- Feature Name -->` | the feature name, one line |
| after `<!-- Not Started\|In Progress\|Completed -->` | `Not Started` |
| after `<!-- Goals & requirements -->` | goals as `-` bullets |
| after `<!-- Any extra notes -->` | constraints, decisions, open questions |
| `## History` | untouched — append only, `complete` writes there |

When the feature came from a spec, record the path as the first line of Notes:

```
Spec: `context/features/stats-sidebar-spec.md`
```

`start` reads that line to derive the branch name, so don't omit it.

## 3. Confirm

Show the feature name, the resolved spec path (if any), and the goals list.
