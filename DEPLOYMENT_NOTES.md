# Deployment & Branch Publishing Notes

This repository lives inside the autonomous workspace, so commits stay local until you
push them to your own GitHub fork. Follow these steps to publish the latest work and
kick off a Vercel preview build:

1. Add your GitHub fork as a remote (replace `<user>` and `<repo>`):
   ```bash
   git remote add origin git@github.com:<user>/<repo>.git
   ```
   If a remote already exists, update it with `git remote set-url origin ...`.

2. Create (or update) the feature branch and push it:
   ```bash
   git checkout -B feature/pashto-refresh
   git push -u origin feature/pashto-refresh
   ```

3. In Vercel, import the GitHub repo (or hit "Redeploy" on the project) so Vercel can
   detect the new branch and generate a preview deployment.

4. Monitor the Vercel dashboard for the deployment status. Once it finishes, use the
   provided preview URL to review the UI in a live environment.

Because this environment does not have credentials for your GitHub account, the actual
`git push` step must be run locally after pulling these commits onto your machine.

---

## Current Status Snapshot

- The `feature/pashto-refresh` branch that restores the previous styling **is already
  live on GitHub** (confirmed from a clean clone where `git log` shows commit
  `091dceb7`).
- Vercel will automatically rebuild from that branch, so you can review the latest UI
  there without any extra steps inside this workspace.

If you are working from a different machine (e.g., your macOS dev box) and you see
errors like "packfile is corrupted," re-clone the repo with SSH to get a clean copy and
continue working.

---

## Options for Future Pushes

You now have a few ways to publish additional commits without reconfiguring this
workspace:

1. **Use GitHub CLI (already authenticated)**
   ```bash
   cd /Users/jeremysamuels/Documents/pashto-bible-search
   gh repo sync        # or use git commands with gh's credential helper
   ```
   This machine already has the `id_ed25519` SSH key registered, so pushes via `git`
   (or `gh`) will succeed immediately.

2. **Continue with the clean-clone method**
   ```bash
   cd /tmp/pashto-bible-search-clean
   git fetch origin
   git push origin feature/pashto-refresh
   ```
   This bypasses any local corruption entirely since it relies on a verified clean
   checkout.

3. **Fix the previously corrupted local clone**
   ```bash
   cd /Users/jeremysamuels/Documents/pashto-bible-search
   git fsck --full
   # If corruption remains:
   cd ..
   mv pashto-bible-search pashto-bible-search-backup
   git clone git@github.com:Chinadoc/Pashto-Bible-Search.git pashto-bible-search
   ```
   After recloning, reconnect to Vercel or any other tooling as needed.

All of these options assume you keep using SSH (`git@github.com:Chinadoc/...`) or the
GitHub CLI, both of which are already authenticated.

---

## Running `npm run lint` (locally or in CI)

The earlier lint failures were because the workspace didn't have the Next.js binary
installed. To ensure `npm run lint` works in Vercel, CI, or your laptop:

1. Install dependencies before linting:
   ```bash
   npm ci           # preferred for CI/Vercel to match package-lock.json
   # or
   npm install      # for local development
   ```

2. Run the lint script:
   ```bash
   npm run lint
   ```

3. In Vercel, the default build step already runs `npm install` (or `npm ci` when a
   lockfile is present). If you override the build command, include `npm ci` first so
   `next` is available for the lint step.
