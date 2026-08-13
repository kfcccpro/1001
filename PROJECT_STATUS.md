# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Student PIN: `8081`; Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- Student actual learning mode alone writes progress, reviews, sessions and active time.
- PIN 2007 combined review remains read-only for learning records.

## Source-validation status — 2026-08-13
- U07 has been replaced from PFAL staging with a representative source-aligned set using verified Unit 07 answer-book Q07~Q08 sentence/structure logic.
- U17~U19 have been replaced from PFAL staging with representative source-aligned sets using workbook/answer-book Unit 17~19 source and answer logic.
- U20 and U26, U29~30, U37~48 remain source-aligned as previously recorded; mixed units remain explicitly mixed.
- U44 title was corrected to the workbook TOC wording `특정 전명구를 동반하는 동사`; item content/status is unchanged apart from metadata wording.
- Remaining `source_concept_pfal_batch_qa` priorities: U21~25, U27, U31~32.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use the actual student runtime token boundaries in supervisor preview.
- Unit-level jump + item-level jump are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required display/explanation fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093r`.

## Verification still required
1. Live PIN 2007 → `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; batch-fix any viewport-specific issues found there.
2. Continue publisher source validation: U21~25 → U27 → U31~32; keep mixed/PFAL statuses unchanged until exact source evidence is verified.
3. Revisit mixed units and U48 source/adaptation freeze after the pure-PFAL queue.
4. Cloud diagnostic all PASS, then PC/mobile/tablet round-trip and active-time QA.
5. Student-mode multi-unit regression, especially Unit switching, due-review separation and persisted selection.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
