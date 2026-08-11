# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.3.0
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON
- Build step: none
- Student: 1
- Admin: 1
- Student PIN: 8081
- Admin PIN: 2007
- Deployment: GitHub Pages via GitHub Actions
- GitHub Pages source: GitHub Actions confirmed on 2026-08-11

## Current scope
- Unit 01 Q01~Q07 pilot flow
- One Screen / One Task / One Decision UI
- START CHECK → CORE → STRUCTURE → INTEGRATION → TRANSFER → FINAL CHALLENGE
- Q01 MOD span selection
- Q07 PAR pair-span selection
- Q07 CLAUSE selection
- Memory Lock + immediate recall
- Before → After challenge
- D+1 / D+3 / D+7 delayed recall scheduler foundation
- recent 7-day learning-day visualization

## Next work
1. Validate deployed v0.3 on PC / tablet viewport.
2. Fix any drag, tokenization, or pair-span interaction defects.
3. Convert app flow to load directly from verified `data/unit01.json` instead of duplicated in-code content.
4. Add stronger daily persistence and cross-device sync only if needed; keep architecture simple.
5. After Unit 01 stabilization, expand Chapter 1.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. Validate syntax and student flow.
4. Commit change.
5. Push/merge to `main`.
6. GitHub Pages deploys automatically.
7. User tests deployed URL and sends screenshot/feedback.
