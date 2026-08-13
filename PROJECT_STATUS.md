# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Student PIN: `8081`; Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- Student actual learning mode alone writes progress, reviews, sessions and active time.
- PIN 2007 combined review remains read-only for learning records.

## Source-validation status — 2026-08-13
- U21 `어순 변화`: workbook p.60~61 + answer-book p.42 representative Q01~Q04 verified → `source_aligned_batch_qa`.
- U22 `문장 앞으로 이동`: workbook p.62~63 + representative Q05~Q07 verified → `source_aligned_batch_qa`.
- U23 `문장 뒤로 이동`: workbook p.64~65 + answer-book p.45 representative Q01~Q02 verified → `source_aligned_batch_qa`.
- U24 was already source-aligned, so Chapter 06 U21~U24 is source-aligned at representative QA-set level.
- U48 source freeze tightened: Q02-2 no longer uses a shortened/adapted sentence; it now uses the same exact SNS source sentence as Q02-1. U48-Q01-2 was changed from a very long span drag to a source-preserving choice judgment to reduce mobile interaction load.
- Remaining pure `source_concept_pfal_batch_qa` priorities: U25, U27, U31~32. Repeated targeted retrieval still has not exposed enough exact publisher sentence/answer evidence for safe promotion; statuses remain intentionally unchanged.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093u`.

## Verification still required
1. Re-search/source-align U25 → U27 → U31~32 only where exact publisher evidence is recovered.
2. Revisit mixed units after the pure-PFAL queue.
3. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
4. Cloud diagnostic all PASS, multi-device round-trip/active-time QA, then student-mode regression.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Safe changes go directly to main; Pages auto-deploys; bump SW cache after cached asset changes.
