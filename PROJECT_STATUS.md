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
- U21 `어순 변화`: workbook p.60~61 + answer-book p.42 representative Q01~Q04 verified → `source_aligned_batch_qa` (so/neither/nor/there inversion and agreement).
- U22 `문장 앞으로 이동`: workbook p.62~63 + answer-book representative Q05~Q07 verified → `source_aligned_batch_qa` (fronted complement/locative phrase, inversion, omitted relative pronoun).
- U23 `문장 뒤로 이동`: workbook p.64~65 + answer-book p.45 representative Q01~Q02 verified → `source_aligned_batch_qa` (heavy object shift, parenthetical clause, to-infinitive modifier).
- U24 remains `source_aligned_batch_qa`; therefore Chapter 06 U21~U24 is source-aligned at representative QA-set level.
- U44 exact publisher TOC wording remains `특정 전명구를 동반하는 동사`.
- Remaining pure `source_concept_pfal_batch_qa` priorities: U25, U27, U31~32. Mixed units remain explicitly mixed.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093t`.

## Verification still required
1. Continue source validation: U25 → U27 → U31~32. Exact publisher sentence/answer retrieval is required before promotion; current searches have not yet provided enough evidence for those units.
2. Revisit mixed units and U48 adaptation/source-freeze issue after the pure-PFAL queue.
3. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
4. Cloud diagnostic all PASS, multi-device round-trip/active-time QA, then student-mode regression.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Safe changes go directly to main; Pages auto-deploys; bump SW cache after cached asset changes.
