# GitHub Simple Webapp Operating Model

## Single source of truth
`GitHub remote main = canonical source`

No local PC is treated as the master copy.

## Normal workflow
User:
1. Request a change.
2. Test the deployed site.
3. Send screenshot / feedback.

ChatGPT / maintainer:
1. Read latest `main` from GitHub.
2. Inspect only the files relevant to the request.
3. Modify the minimum necessary code/content.
4. Run validation.
5. Commit changes.
6. Merge/push to `main`.
7. Verify deployment status.

## Emergency workflow
Use GitHub Desktop or the GitHub browser editor only if the ChatGPT GitHub connection is unavailable or blocked.

## Repository structure
```text
/
  index.html
  styles.css
  app.js
  sw.js
  manifest.webmanifest
  data/
  assets/
  docs/
  .github/workflows/pages.yml
  PROJECT_STATUS.md
  CHANGELOG.md
  VERSION
```

## Design constraints
- No framework unless a future requirement clearly demands one.
- No build process for ordinary changes.
- No package manager required for basic operation.
- Content lives outside UI code when practical.
- One student / one admin.
- PIN is convenience gating, not a security system.
- Keep the student UI visually minimal even if the internal learning logic is complex.

## Change discipline
- `main` is always runnable.
- Prefer small commits with one purpose.
- Never replace the whole project just to change one feature.
- Update `PROJECT_STATUS.md` when architecture or current phase changes.
- Update `VERSION` and `CHANGELOG.md` for meaningful releases.
