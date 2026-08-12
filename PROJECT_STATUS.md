# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch5`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Chapter 01~08: Unit 01~32
- Chapter 09 `아는 것 같지만 한 번 더 생각해야 하는 구문`: Unit 33~36
- Chapter 10 `과감히 건너뛰고 적극적으로 예측하라`: Unit 37~40
- PIN 2007 combined supervisor review targets `Unit 01~40` dynamically from `data/catalog.json`.
- Student actual learning mode alone writes progress, reviews, sessions and active time.

## Batch5 source status
- Chapter/Unit sequence was rechecked from the uploaded workbook contents: U33 대명사 it/they/this/that, U34 숨어 있는 가정법, U35 부정구문, U36 인과/선후 수동태 표현, U37 부연 설명은 건너뛰어라, U38 예시·동격, U39 정보 추가 vs. 강조, U40 비교·대조 연결어.
- U33 uses source-aligned pronoun/reference examples plus one PFAL transfer item.
- U34 uses source-aligned otherwise/hidden-condition examples plus one PFAL transfer item.
- U35 uses source-aligned partial-negation examples plus one PFAL transfer item.
- U36 uses source-aligned followed by / preceded by sequence examples plus PFAL cause examples.
- U37, U38, U40 are source-aligned batch QA from workbook/answer-book examples.
- U39 uses source-aligned information-addition examples plus PFAL contrast between addition and emphasis.
- Source/PFAL distinction remains explicit; staged material is not final-validated until combined review.

## Batch5 implementation checkpoint — 2026-08-12
- Added Unit 33~40 JSON and Chapter 09~10 catalog entries.
- Expansion version: `0.9.3-batch5`.
- PWA cache key: `chunilmun-pfal-t1-v093f`.
- Service worker precaches Unit 01~40 programmatically.
- Static QA checks JS syntax, Unit 01~40 existence, JSON/catalog consistency, global IDs, answer contracts and validation flows.

## Verification still required
1. PIN 2007 → `Unit 01~40 한꺼번에 검수`: order, source text, prompt, answer/explanation and navigation.
2. Live content review for Unit33~40, especially pronoun referents, hidden conditional reconstructions, negative-scope meanings, sequence/cause relations and discourse connectors.
3. Revisit earlier staged source validation before final content freeze.
4. Desktop/tablet/mobile compact-layout visual QA.
5. Cloud diagnostic all PASS, then cross-device/active-time QA.
6. After batch5 review, expand Chapter 11~12 / Unit 41~48.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
