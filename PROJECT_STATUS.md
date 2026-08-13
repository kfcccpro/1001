# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- PIN 2007 combined supervisor review targets `Unit 01~48` dynamically from `data/catalog.json`.
- Student actual learning mode alone writes progress, reviews, sessions and active time.

## Source-validation status — 2026-08-13
- Unit 41~44: representative workbook sentences and answer-book logic verified → `source_aligned_batch_qa`.
- Unit 45~48: representative Chapter 12 publisher sentences and answer logic verified → `source_aligned_batch_qa` at the representative QA-set level.
- Earlier PFAL/mixed units remain explicitly classified in the catalog; no automatic status promotion occurs.

## Full-workbook supervisor audit checkpoint — 2026-08-13
- PIN 2007 combined review now carries Unit/Chapter/status metadata into every combined item.
- Supervisor screen shows interaction type and SOURCE-ALIGNED / MIXED / PFAL classification without writing student records.
- Span/pairSpan items render the same token boundaries used by the student selector, allowing selectable-range inspection during the combined sweep.
- Added Unit-level jump plus item-level jump for the full Unit 01~48 review.
- Long/very-long source sentences receive supervisor-only compact typography to reduce vertical scrolling; student typography is unchanged.
- Static QA now also enforces catalog/meta chapter, title and status consistency; requires display/explanation fields; requires every item to be included in validationFlow; and logs long-sentence/prompt layout telemetry.
- PWA cache key: `chunilmun-pfal-t1-v093q`.

## Verification still required
1. Live PIN 2007 → `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; batch-fix any viewport-specific issues found there.
2. Revisit earlier PFAL-staged Units 07, 17~19, 21~25, 27, 31~32 for publisher-source validation where useful; keep mixed/PFAL statuses honest until verified.
3. Cloud diagnostic all PASS, then PC/mobile/tablet round-trip and active-time QA.
4. Student-mode multi-unit regression, especially due-review separation and cloud round-trip after Unit switching.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
