# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core version: `0.9.3`; expansion layer: `0.9.3-batch6`
- Static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore
- Student PIN `8081`; Admin/Supervisor PIN `2007`

## 2. Invariants
- Only actual student mode writes progress/review/session/active time.
- Supervisor mode supports Previous/Next/jump and optional answer/explanation without saving.
- Student UI: One Screen · One Task · One Decision; large English/Korean; minimize vertical scroll.
- ADHD-friendly; no large countdown or excessive failure emphasis.
- Learning loop: Cold Attempt → structure judgment → minimal Guided Repair → retry → transfer → D+1/D+3/D+7.
- Publisher source-aligned content and PFAL-derived content must remain explicitly distinct.

## 3. Current workbook scope
`data/catalog.json` is canonical.
- Ch01~10 Unit01~40
- Ch11 `구문의 짝을 찾아라` — Unit41~44
  - U41 `it ~ to-V[that]`
  - U42 `짝을 이루는 접속사`
  - U43 `짝을 이루는 대명사·부사`
  - U44 `특정 전치사구를 동반하는 동사`
- Ch12 `길고 복잡한 문장의 해결` — Unit45~48
  - U45 `관계사절이 여러 개 들어간 복잡한 문장`
  - U46 `비교구문과 결합한 복잡한 절`
  - U47 `특수구문과 결합한 복잡한 절`
  - U48 `50단어 내외의 긴 기출 문장`

Batch6 source distinction:
- U41~47: source concept/page sequence confirmed, PFAL-derived staging sentences.
- U48: source-aligned batch QA from uploaded answer book.
- Do not call U41~47 publisher-source validated until exact item transcription is checked.

## 4. Supervisor
PIN 2007:
- current Unit review
- `Unit 01~48 한꺼번에 검수`
- range label is computed from catalog
- no learning records written

## 5. Main files
- Core/UI: index.html, app.js, styles.css, learning.css, compact-v093.css
- Supervisor: supervisor-v082.js/css
- Guided Repair: repair-guides-v092.js, guided-repair-v092.js/css
- Multi-unit: multiunit-v093b.js/css
- Catalog/data: data/catalog.json, data/unit01.json ... data/unit48.json
- Cloud: cloud-v09.js/css, cloud-diagnostic-v091.js/css
- PWA: sw.js, manifest.webmanifest
- QA: .github/workflows/qa.yml
- State: VERSION, PROJECT_STATUS.md, PROJECT_HANDOFF_LATEST.md

## 6. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- actual active time is primary metric; visible + recent interaction only
- Firestore rules reported published; PIN 2007 diagnostic PASS screenshot still pending

## 7. Next priority after batch6 deployment
The current workbook Unit scope is complete through Unit48. Next work is no longer automatic Unit expansion:
1. PIN 2007 `Unit 01~48 한꺼번에 검수` full content/layout sweep.
2. Batch-fix sentence/prompt/answer/range errors and run source-validation/freeze, prioritizing PFAL-staged units.
3. Cloud diagnostic all PASS + PC/mobile/tablet round-trip progress and active-time QA.
4. Student-mode multi-unit regression, including due-review separation by selected Unit and persisted selected-unit restore.
5. Only after those gates decide whether to expand beyond this workbook.

## 8. Auto-continue rule
If user says `진행`, `다음 단계 진행`, or equivalent:
1. read latest main/handoff/status/VERSION/Actions
2. execute the first incomplete priority without asking
3. safe changes direct to main
4. verify Static QA + Pages
5. report concise result and necessary live-check points
