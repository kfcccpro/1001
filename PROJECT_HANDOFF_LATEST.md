# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core version: `0.9.3`; expansion layer: `0.9.3-batch4`
- Static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore
- Student PIN `8081`; Admin/Supervisor PIN `2007`

## 2. Invariants
- Only actual student mode writes progress/review/session/active time.
- Supervisor mode: Previous/Next/jump and optional answer/explanation without saving.
- Student UI: One Screen · One Task · One Decision; large English/Korean; minimize vertical scroll.
- ADHD-friendly; no large countdown or excessive failure emphasis.
- Learning loop: Cold Attempt → structure judgment → minimal Guided Repair → retry → transfer → D+1/D+3/D+7.
- Keep publisher source-aligned content distinct from PFAL-derived content.

## 3. Current scope
`data/catalog.json` is canonical.
- Ch01 Unit01~04 주어·동사 찾기
- Ch02 Unit05~08 수식어구 뒤 동사 찾기
- Ch03 Unit09~12 명사 뒤 수식어구
- Ch04 Unit13~16 문장 구조 방해 요소
- Ch05 Unit17~20 생략
- Ch06 Unit21~24 어순
- Ch07 Unit25~28 병렬구조를 파악하기 어려운 이유
- Ch08 Unit29~32 비교구문에서 정확히 이해해야 할 것들

Batch4 source distinction:
- U26, U29, U30: source-aligned batch QA.
- U28: source-aligned core + one PFAL transfer item.
- U25, U27, U31, U32: PFAL-derived concept staging.

## 4. Supervisor
PIN 2007:
- current Unit review
- `Unit 01~32 한꺼번에 검수`
- range label is computed from catalog
- no learning records written

## 5. Main files
- Core/UI: index.html, app.js, styles.css, learning.css, compact-v093.css
- Supervisor: supervisor-v082.js/css
- Guided Repair: repair-guides-v092.js, guided-repair-v092.js/css
- Multi-unit: multiunit-v093b.js/css
- Catalog/data: data/catalog.json, data/unit01.json ... data/unit32.json
- Cloud: cloud-v09.js/css, cloud-diagnostic-v091.js/css
- PWA: sw.js, manifest.webmanifest
- QA: .github/workflows/qa.yml
- State: VERSION, PROJECT_STATUS.md, PROJECT_HANDOFF_LATEST.md

## 6. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- actual active time is primary metric; visible + recent interaction only
- Firestore rules reported published; PIN 2007 diagnostic PASS screenshot still pending

## 7. Next priority
After batch4 deployment succeeds:
1. PIN 2007 `Unit 01~32 한꺼번에 검수` live content/layout check.
2. Fix text/prompt/answer/range issues, preserving source/PFAL status.
3. Cloud diagnostic + cross-device/active-time QA.
4. Then expand Chapter 09~10 / Unit 33~40.

## 8. Auto-continue rule
If user says `진행`, `다음 단계 진행`, or equivalent:
1. read latest main/handoff/status/VERSION/Actions
2. execute first incomplete priority without asking
3. safe changes direct to main
4. verify Static QA + Pages
5. report concise result and only necessary live-check points
