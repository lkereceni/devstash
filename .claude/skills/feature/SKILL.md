---
name: feature
description: Manage current feature workflow - load, start, review, test, explain or complete
argument-hint: load|start|review|test|explain|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge, following the workflow in `context/ai-interaction.md`.

## Working File

@context/current-feature.md

### File Structure

A template whose HTML comments mark each slot — keep them, write beneath them:

- `# Current Feature` — H1, always bare. The feature name goes on its own line under `<!-- Feature Name -->`, never in the heading.
- `## Status` — `Not Started` | `In Progress` | `Completed`
- `## Goals` — bullet points of what success looks like
- `## Notes` — spec path, constraints, decisions
- `## History` — completed features, append only, earliest to latest

## Task

Execute the requested action: $ARGUMENTS

| Action | Description |
|--------|-------------|
| `load` | Load a feature spec or inline description |
| `start` | Create the branch, implement the goals |
| `review` | Build, lint, architecture conformance, goals met |
| `test` | Unit tests — no runner configured yet, asks first |
| `explain` | Document what changed and why (before `complete`) |
| `complete` | Commit, merge, delete branch, reset |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
