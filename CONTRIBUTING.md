# Contributing

This repository follows a ticket-first git-flow branching model. No change is made without these five steps, in order.

## Workflow

1. **Open an issue first.** It's the ticket — every branch traces back to one. No issue, no branch.
2. **Branch from `develop`**, named `<type>/<issue-number>-<short-slug>` (e.g. `fix/42-broken-migration`, `feature/57-weekly-export`). Branch types: `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`.
3. **Open the PR against `develop`**, not `main`. Reference the issue in the description (`Closes #42`).
4. **CI has to pass before the PR merges.** The required checks run automatically; a red check blocks the merge button.
5. **`main` only advances when `develop` is green.** Once the work on `develop` is ready to ship, open a PR from `develop` into `main`. It merges only if every check passes. `main` is always releasable — it's what CI builds and, where configured, deploys from.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Always releasable. No direct pushes — it only moves via a green `develop` → `main` PR. |
| `develop` | Integration branch. Every ticket branch merges here first. |
| `<type>/<issue>-<slug>` | One branch per ticket. Delete it after merge. |
