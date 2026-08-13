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
- U25 `병렬구조` → workbook p.70~71 / answer-book p.50 representative Q01~Q04 verified and converted to `source_aligned_batch_qa`.
- U27 `등위접속사가 여러 개인 문장` → workbook p.74~75 / answer-book p.54 representative Q01~Q03 verified and converted to `source_aligned_batch_qa`.
- U31 `비교 대상의 생략` → workbook p.84~85 / answer-book p.61 representative Q01~Q03 verified and converted to `source_aligned_batch_qa`.
- U32 `유의해야 할 비교급 구문` → workbook p.86~87 / answer-book p.62 representative Q01~Q03 verified and converted to `source_aligned_batch_qa`.
- There are now no `source_concept_pfal_batch_qa` or `pfal_derived_batch_qa` units in the catalog.
- Remaining mixed `source_aligned_plus_pfal_batch_qa` units: U08, U28, U33~36, U39.
- U48 source freeze has already been tightened to use the exact SNS source sentence for both Q02 items.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093v`.

## Verification still required
1. Audit the seven mixed units U08, U28, U33~36, U39 and replace PFAL-only items with publisher-source items where exact source/answer evidence is available.
2. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
3. Cloud diagnostic all PASS, multi-device round-trip/active-time QA, then student-mode regression.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Safe changes go directly to main; Pages auto-deploys; bump SW cache after cached asset changes.
