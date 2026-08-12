# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch3`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`
- Canonical handoff: `PROJECT_HANDOFF_LATEST.md`

## Current scope
- Chapter 01 `주어·동사 찾기`: Unit 01~04
- Chapter 02 `수식어구 뒤의 동사 찾기`: Unit 05~08
- Chapter 03 `명사 뒤 수식어구로 인한 문제들`: Unit 09~12
- Chapter 04 `문장 구조 파악을 어렵게 하는 것들`: Unit 13~16
- Chapter 05 `생략이 일어난 문장 구조 이해하기`: Unit 17~20
- Chapter 06 `어순에 주의해야 하는 구문`: Unit 21~24
- PIN 2007 supervisor mode supports current-unit review and combined `Unit 01~24 한꺼번에 검수`.
- The combined review range is generated from `data/catalog.json`; future chapter additions do not require hard-coded range labels.
- Student actual learning mode alone writes progress, review schedules, sessions and active time.
- Guided Repair v0.9.2 and Compact Layout v0.9.3 remain unchanged.

## Source / PFAL status
- Unit 01: source-aligned validated baseline.
- Unit 02~06: source-aligned/source-derived staged QA.
- Unit 07: PFAL-derived staged QA.
- Unit 08: source/PFAL mixed staged QA.
- Unit 09~16: source-aligned batch QA based on uploaded workbook/answer-book pages.
- Unit 17~19: source chapter/unit concept and page sequence confirmed; items are deliberately PFAL-derived until exact publisher-source transcription review.
- Unit 20: source-aligned batch QA using the uploaded problem/solution book's if-omission conditional examples and answers.
- Unit 21~24: source chapter/unit concept and page sequence confirmed; items are deliberately PFAL-derived until exact publisher-source transcription review.
- This distinction is intentional: do not silently promote PFAL-derived staged items to source-validated status.

## Batch3 implementation checkpoint — 2026-08-12
- Added Chapter 05~06 and Unit 17~24 to `data/catalog.json`.
- Chapter 05 source sequence confirmed: Unit17 생략·공동구문, Unit18 생략구문, Unit19 접속사·관계사의 생략, Unit20 if 또는 if절이 생략된 가정법.
- Chapter 06 source sequence confirmed: Unit21 어순 변화, Unit22 문장 앞으로 이동, Unit23 문장 뒤로 이동, Unit24 이미 아는 정보+새로운 정보.
- Added 8 unit datasets. Unit20 is source-aligned; the other seven are concept-aligned PFAL staging items to avoid inventing or over-republishing publisher text before exact source review.
- Supervisor batch range is dynamic and now targets Unit 01~24.
- Static QA validates JavaScript syntax, all Unit 01~24 JSON files, metadata/catalog correspondence, global item-ID uniqueness, interaction answer contracts, and validation-flow references.
- PWA cache key bumped to `chunilmun-pfal-t1-v093d` and Unit 17~24 assets added to the precache list.

## Cloud / learning record
- Firebase project: `moonma-f6dbe`
- Background Anonymous Auth
- Firestore namespaces: `chunilmun1001`, `chunilmun1001_sessions`
- User reported Firestore rules manually published on 2026-08-12.
- Actual active learning time remains the primary management metric; idle/background time must not count.

## Verification still required
1. PIN 2007 → `Unit 01~24 한꺼번에 검수`: chapter/unit order, sentence/prompt/answer/explanation correctness, Previous/Next/jump behavior.
2. Live content QA for Unit 17~24, especially source-aligned Unit20 transformation answers and the PFAL-derived concept fit of Unit17~19 / Unit21~24.
3. Revisit earlier staged Unit 02~16 source validation before final content freeze.
4. Desktop/tablet/mobile compact-layout visual QA while traversing the combined batch.
5. PIN 2007 → `클라우드 연결 진단`: SDK / anonymous auth / state read-write / session read-write all PASS.
6. PC → mobile/tablet → PC round-trip progress continuation across multiple units.
7. Active-time and real-data admin history QA.
8. After batch3 review, expand Chapter 07~08 (Unit 25~32) as the next content batch.

## Operating rules
1. Read latest `main`, handoff, status and VERSION before editing.
2. Keep publisher-source-aligned and PFAL-derived content explicitly distinguishable.
3. During development use PIN 2007 supervisor review; never write student progress/time from supervisor mode.
4. Small safe changes go directly to `main`; GitHub Pages deploys automatically.
5. After cached asset changes, bump the service-worker cache key.
6. User primarily supplies screenshots/short feedback; assistant handles code, QA, commit and deploy when connector access is available.
