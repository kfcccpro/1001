# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch4`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Chapter 01~06: Unit 01~24
- Chapter 07 `병렬구조를 파악하기 어려운 이유`: Unit 25~28
- Chapter 08 `비교구문에서 정확히 이해해야 할 것들`: Unit 29~32
- PIN 2007 combined supervisor review now targets `Unit 01~32` dynamically from `data/catalog.json`.
- Student actual learning mode alone writes progress, reviews, sessions and active time.

## Batch4 source status
- Chapter/Unit titles and page sequence were rechecked from the uploaded workbook contents: U25 병렬구조, U26 연결어구 후보가 두 개 이상인 문장, U27 등위접속사가 여러 개인 문장, U28 등위접속사 뒤 삽입어구, U29 비교구문, U30 as/than 이하 반복어구 생략, U31 비교 대상 생략, U32 유의해야 할 비교급 구문.
- Unit26 source-aligned: answer-book examples verify `believed ... and used`, `being against ... but rather being strong`, and parallel that-clauses.
- Unit28 source-aligned core: answer-book examples verify the inserted `even worse` and the `grew ... and, when ..., moved on` structure; one PFAL transfer item is added.
- Unit29 source-aligned from workbook examples.
- Unit30 source-aligned from answer-book examples for repeated material omitted after as/than.
- Unit25, Unit27, Unit31, Unit32 are explicitly PFAL-derived concept staging until exact source-item transcription is reviewed.

## Batch4 implementation checkpoint — 2026-08-12
- Added Unit 25~32 JSON and Chapter 07~08 catalog entries.
- Expansion version: `0.9.3-batch4`.
- PWA cache key: `chunilmun-pfal-t1-v093e`.
- Service worker precaches Unit 01~32 programmatically.
- Static QA now checks JavaScript syntax including `sw.js`, existence of Unit 01~32, JSON validity, catalog/metadata correspondence, global ID uniqueness, answer contracts and validation-flow references.

## Verification still required
1. PIN 2007 → `Unit 01~32 한꺼번에 검수`: order, text, prompt, answer/explanation, navigation.
2. Content review for newly staged Unit25~32, especially Unit26/28/29/30 source-aligned ranges and PFAL concept fit for Unit25/27/31/32.
3. Revisit earlier staged source validation before final content freeze.
4. Desktop/tablet/mobile compact-layout visual QA.
5. Cloud diagnostic all PASS, then cross-device/active-time QA.
6. After batch4 review, expand Chapter 09~10 / Unit 33~40.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
