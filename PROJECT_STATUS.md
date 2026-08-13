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
- U07 and U17~U19 were promoted from PFAL/source-concept staging to representative `source_aligned_batch_qa` after workbook/answer-book verification.
- U24 `이미 아는 정보+새로운 정보` is now `source_aligned_batch_qa` using workbook p.66 and answer-book p.47 representative Q01~Q03 logic: to-infinitive parallelism, fronted known information with inversion/object fronting, repeated-clause omission, and locative inversion.
- U44 title is corrected to the workbook TOC wording `특정 전명구를 동반하는 동사`.
- Remaining `source_concept_pfal_batch_qa` priorities: U21~23, U25, U27, U31~32. Mixed units remain explicitly mixed.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093s`.

## Verification still required
1. Live PIN 2007 → `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
2. Continue source validation: U21~23 → U25 → U27 → U31~32 where exact publisher source/answers are verified.
3. Revisit mixed units and U48 adaptation/source-freeze issue after the pure-PFAL queue.
4. Cloud diagnostic all PASS, multi-device round-trip/active-time QA, then student-mode regression.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Safe changes go directly to main; Pages auto-deploys; bump SW cache after cached asset changes.
