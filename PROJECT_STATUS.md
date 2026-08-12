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
- Chapter 01~10: Unit 01~40
- Chapter 11 `구문의 짝을 찾아라`: Unit 41~44
- Chapter 12 `길고 복잡한 문장의 해결`: Unit 45~48
- Current workbook scope is now catalogued through Unit 48.
- PIN 2007 combined supervisor review targets `Unit 01~48` dynamically from `data/catalog.json`.
- Student actual learning mode alone writes progress, reviews, sessions and active time.

## Batch6 source status
- Workbook contents confirm Chapter 11/12 titles, Unit 41~48 titles, and pages 110/112/114/116 and 120/122/124/126.
- U41~47 are deliberately `source_concept_pfal_batch_qa`: the exact publisher examples were not sufficiently retrieved for reliable transcription, so the app uses original PFAL practice sentences aligned to each Unit concept.
- U48 is `source_aligned_batch_qa`; answer-book source verifies the long appetite/motivation sentence and the SNS media-literacy sentence, including the internal verb/parallel structures used in the tasks.
- This distinction is intentional and must remain visible until final source validation.

## Batch6 implementation checkpoint — 2026-08-12
- Added Unit 41~48 JSON and Chapter 11~12 catalog entries.
- Expansion version: `0.9.3-batch6` while core `VERSION` remains `0.9.3`.
- PWA cache key: `chunilmun-pfal-t1-v093g`.
- Service worker precaches Unit 01~48 programmatically.
- Static QA checks JS syntax, Unit 01~48 existence, JSON/catalog consistency, global IDs, answer contracts and validation flows.

## Verification still required
1. PIN 2007 → `Unit 01~48 한꺼번에 검수`: full-workbook order, text, prompts, answers/explanations and navigation.
2. Source-validation pass for all PFAL-staged units before content freeze, with special attention to Unit 41~47.
3. Desktop/tablet/mobile compact-layout visual QA across the full combined review.
4. Cloud diagnostic all PASS, then PC/mobile/tablet round-trip and active-time QA.
5. After full-workbook QA, prioritize source correction/freeze and student multi-device regression rather than further Unit expansion.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
