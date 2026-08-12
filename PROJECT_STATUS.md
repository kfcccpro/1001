# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch2`
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
- PIN 2007 supervisor mode supports current-unit review and combined `Unit 01~16 한꺼번에 검수`.
- The combined range is generated from `data/catalog.json`; future chapter additions do not require hard-coded range labels.
- Unit 09~16 were staged from the user-provided workbook/answer-book pages and are marked `source_aligned_batch_qa` pending live combined review.
- Earlier staging labels remain: Unit 01 validated baseline; Unit 02~06 source-aligned batch QA; Unit 07 PFAL-derived; Unit 08 mixed source/PFAL.
- Student actual learning mode alone writes progress, review schedules, sessions and active time.
- Guided Repair v0.9.2 and Compact Layout v0.9.3 remain unchanged.

## Batch2 implementation checkpoint — 2026-08-12
- Added catalog entries and JSON datasets for Unit 09~16.
- Chapter 03 titles/source sequence: Unit09 명사 수식어 자리, Unit10 목적어 뒤의 목적격보어 찾기, Unit11 명사 뒤의 여러 수식어구, Unit12 수식어구의 범위.
- Chapter 04 titles/source sequence: Unit13 삽입절을 포함하는 관계사절, Unit14 착각하기 쉬운 단어의 역할, Unit15 부사의 자유로운 위치, Unit16 분사구문의 특이한 형태.
- Supervisor batch button and range header are now computed from the catalog and target Unit 01~16.
- Static QA validates JavaScript syntax, all Unit 01~16 JSON files, metadata/catalog correspondence, global item-ID uniqueness, interaction answer contracts, and validation-flow references.
- PWA cache key bumped to `chunilmun-pfal-t1-v093c` and Unit 09~16 assets added to the precache list.

## Cloud / learning record
- Firebase project: `moonma-f6dbe`
- Background Anonymous Auth
- Firestore namespaces: `chunilmun1001`, `chunilmun1001_sessions`
- User reported Firestore rules manually published on 2026-08-12.
- Actual active learning time remains the primary management metric; idle/background time must not count.

## Verification still required
1. PIN 2007 → `Unit 01~16 한꺼번에 검수`: chapter/unit order, sentence/prompt/answer/explanation correctness, Previous/Next/jump behavior.
2. Live content QA for newly staged Unit 09~16; correct any source transcription/range issue found during combined inspection.
3. Revisit staged Unit 02~08 source validation, especially PFAL-derived Unit 07 and mixed Unit 08, before final content freeze.
4. Desktop/tablet/mobile compact-layout visual QA while traversing the combined batch.
5. PIN 2007 → `클라우드 연결 진단`: SDK / anonymous auth / state read-write / session read-write all PASS.
6. PC → mobile/tablet → PC round-trip progress continuation across multiple units.
7. Active-time and real-data admin history QA.
8. After batch2 review, expand Chapter 05~06 (Unit 17~24) as the next content batch.

## Operating rules
1. Read latest `main`, handoff, status and VERSION before editing.
2. Keep publisher-source-aligned and PFAL-derived content explicitly distinguishable.
3. During development use PIN 2007 supervisor review; never write student progress/time from supervisor mode.
4. Small safe changes go directly to `main`; GitHub Pages deploys automatically.
5. After cached asset changes, bump the service-worker cache key.
6. User primarily supplies screenshots/short feedback; assistant handles code, QA, commit and deploy when connector access is available.
