# Complete Action

## 1. Gate

1. Run `/feature review`. If it does not come back ready, stop and fix.
2. Run `npm run build`. It must pass — `context/ai-interaction.md`: *"Do NOT commit without permission and until the build passes. If build fails, fix the issues first."*
3. Confirm the change works in the browser.

## 2. Commit — ask first

Show the user what is staged and the proposed message, then **wait for approval**. Never auto-commit.

Conventional commit, scoped to the feature:

```
feat(sidebar): add view all collections link and dominant-type dots
```

`feat:` / `fix:` / `chore:` / `refactor:` / `docs:`, one feature per commit. **Never** include "Generated with Claude" or a Claude co-author trailer — `context/ai-interaction.md` forbids it.

```bash
git add -A
git commit -m "<message>"
git push -u origin <branch>
```

## 3. Merge

Merge *from* `main` — you have to be on the target branch to merge into it. The history uses merge commits (`Merge branch 'feature/stats-sidebar'`), so keep `--no-ff`:

```bash
git switch main
git merge --no-ff <branch>
git push
```

## 4. Delete the branch — ask first

`context/ai-interaction.md`: *"Ask to delete the branch once merged."* Once confirmed:

```bash
git branch -d <branch>
git push origin --delete <branch>
```

## 5. Reset current-feature.md

Restore the template, keeping every HTML comment in place:

- H1 stays `# Current Feature` — it was never changed
- clear the feature name line under `<!-- Feature Name -->`
- Status → `Not Started`
- clear Goals and Notes, leaving their comments
- **append** a summary of the feature to the end of `## History` — append only, earliest to latest
