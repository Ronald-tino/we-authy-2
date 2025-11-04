# Branching Guide: main, feature, and release

## TL;DR

- **main**: always stable; the code you can deploy now.
- **feature/\***: short-lived branches where you build one focused change.
- **release/\***: optional staging branches to prepare and polish a version before shipping.

```
main
 ├─ feature/firebase-auth          ← build safely here
 ├─ feature/new-navbar
 └─ release/v1.2.0                 ← optional: stabilize & test before shipping
```

## Analogy: Running a Restaurant

- **main = Today’s Menu**: The menu customers see right now. It should never be broken. If it’s printed and on tables, it must be trustworthy.
- **feature branch = Test Kitchen**: A chef experiments with a new dish in the back. If it fails, customers aren’t affected. When the dish tastes great, you propose adding it to the menu.
- **release branch = Pre‑Service Pass**: Right before dinner service, the head chef picks exactly what goes on tonight’s menu and makes final tweaks. After approval, the menu goes out to customers.

## How You’ll Work (Beginner‑Friendly)

1. Start from a clean `main`.
2. Create a **feature** branch for one change (e.g., Firebase auth).
3. Commit small, push often, open a Draft PR.
4. Keep your feature branch fresh by merging `origin/main` into it regularly.
5. When done and tested, merge the feature to `main` via PR (squash recommended).

If you’re batching multiple features into one version:

1. Create `release/x.y.z` from `main`.
2. Merge approved feature branches into the release branch.
3. Test end‑to‑end, fix bugs on the release branch.
4. Merge `release/x.y.z` → `main`, tag the version, then delete the release branch.

## Commands You’ll Use

### Start a new feature

```bash
git checkout main                                   # switch to the main branch
git pull --ff-only                                  # update local main (fast-forward only to avoid merge commits)
git checkout -b feature/firebase-auth               # create and switch to a new feature branch
git push -u origin feature/firebase-auth            # publish the branch and set upstream for easy push/pull
```

### Work and stay up‑to‑date

```bash
# stage all your current file changes (adds, mods, deletes)
git add -A                                           # or add files selectively instead of -A

# create a commit with a clear message about what changed
git commit -m "feat(auth): integrate Firebase init"   # use present tense; keep scope prefix if you like

# keep your feature in sync with main to reduce conflict surprises later
git fetch origin                                      # download latest refs from remote
git merge origin/main                                 # merge the latest main into your feature branch

# upload your work to the remote feature branch
git push                                              # uses the upstream set earlier
```

### Open a Pull Request (PR)

- From your remote (GitHub/GitLab), open a **Draft PR** from `feature/<name>` → `main` (or → `release/x.y.z` if using a release branch).
- Draft PRs are great for early feedback and CI checks while you continue working.

### Create a release branch (optional)

```bash
git checkout main                                     # start from the main branch
git pull --ff-only                                    # ensure local main is up-to-date
git checkout -b release/v1.2.0                        # create a release branch for version v1.2.0
git push -u origin release/v1.2.0                     # publish the release branch and set upstream
```

### Bring features into a release

```bash
git checkout release/v1.2.0                           # switch to the release branch
git merge origin/feature/firebase-auth                 # bring the finished feature into the release
git push                                               # push the updated release branch
```

### Ship the release

```bash
git checkout main                                      # switch back to main
git pull --ff-only                                     # ensure local main is current
git merge --no-ff origin/release/v1.2.0                # merge release into main, keep a merge commit for clear history
git tag v1.2.0                                         # create a lightweight tag for this release
git push && git push origin v1.2.0                     # push main and the release tag

# then delete the release branch (cleanup)
git branch -d release/v1.2.0                           # delete local release branch
git push origin --delete release/v1.2.0                # delete remote release branch
```

### Hotfix (urgent fix directly from main)

```bash
git checkout main                                      # start from stable main for urgent fixes
git pull --ff-only                                     # sync with remote main
git checkout -b hotfix/fix-login-crash                 # create a hotfix branch

# commit the fix
git add -A                                             # stage changes for the hotfix
git commit -m "fix(auth): prevent null user crash"     # write a clear fix message
git push -u origin hotfix/fix-login-crash              # publish hotfix branch

# open PR to main, merge when approved                  # (do this in your Git hosting UI)
```

## When to Use a Release Branch

- You’re shipping several features together and need a **stabilization window**.
- You want to freeze the upcoming version while other work continues on features.
- You plan to test, polish copy/UX, or prepare migration steps before release.

If you’re solo or deploying continuously, you can skip release branches and merge features straight to `main` (use feature flags to reduce risk).

## Naming Tips

- **Features**: `feature/<short-description>` → `feature/firebase-auth`
- **Release**: `release/<version>` → `release/v1.2.0`
- **Hotfix**: `hotfix/<short-description>` → `hotfix/fix-login-crash`

## Rollback Safety

If a merge to `main` causes trouble, revert the single merge commit:

```bash
git checkout main                                      # be on main to perform the revert
git pull --ff-only                                     # ensure you revert against the latest main
git log --oneline            # find the merge commit SHA
git revert <merge_sha> -m 1  # create a new commit that undoes the merge
git push                                               # publish the revert commit
```

## Practical Advice

- Keep feature branches **small and focused**.
- Commit often with **clear messages**.
- Prefer **Draft PRs** early; turn them “Ready” when stable.
- Regularly **merge `main` into your feature** to avoid big conflicts later.
- Protect `main` in repo settings (require PRs and checks).
- Use **feature flags** to hide risky work until it’s ready.

## For Your Firebase Auth Change (Example Plan)

1. Create `feature/firebase-auth` from `main`.
2. Add Firebase config and initialize; keep the old login in place.
3. Hide new login behind a flag (e.g., `VITE_USE_FIREBASE_AUTH=true` on your branch only).
4. Migrate flows incrementally (sign‑in, sign‑up, session, logout), testing each.
5. When stable, remove the old auth and turn on the flag in `main` during release.
6. If coordinating multiple changes, merge into `release/v1.x.y`, test end‑to‑end, then ship.
