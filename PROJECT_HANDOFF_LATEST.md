# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core version: `0.9.3`; expansion layer: `0.9.3-batch5`
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
- Ch01~08 Unit01~32
- Ch09 Unit33~36 `아는 것 같지만 한 번 더 생각해야 하는 구문`
- Ch10 Unit37~40 `과감히 건너뛰고 적극적으로 예측하라`

Batch5 source distinction:
- U33~36: source-aligned core + small PFAL transfer additions.
- U37, U38, U40: source-aligned batch QA.
- U39: source-aligned core + PFAL transfer additions.

Chapter 09 source sequence:
- U33 대명사 it, they, this, that
- U34 숨어 있는 가정법
- U35 부정구문
- U36 인과/선후를 나타내는 수동태 표현

Chapter 10 source sequence:
- U37 부연 설명은 건너뛰어라
- U38 예시·동격
- U39 정보 추가 vs. 강조
- U40 비교·대조를 나타내는 연결어

## 4. Supervisor
PIN 2007:
- current Unit review
- `Unit 01~40 한꺼번에 검수`
- range label is computed from catalog
- no learning records written

## 5. Main files
- Core/UI: index.html, app.js, styles.css, learning.css, compact-v093.css
- Supervisor: supervisor-v082.js/css
- Guided Repair: repair-guides-v092.js, guided-repair-v092.js/css
- Multi-unit: multiunit-v093b.js/css
- Catalog/data: data/catalog.json, data/unit01.json ... data/unit40.json
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
After batch5 deployment succeeds:
1. PIN 2007 `Unit 01~40 한꺼번에 검수` live content/layout check.
2. Fix text/prompt/answer/range issues, preserving source/PFAL status.
3. Cloud diagnostic + cross-device/active-time QA.
4. Then expand Chapter 11~12 / Unit 41~48, completing the current workbook scope.

## 8. Auto-continue rule
If user says `진행`, `다음 단계 진행`, or equivalent:
1. read latest main/handoff/status/VERSION/Actions
2. execute first incomplete priority without asking
3. safe changes direct to main
4. verify Static QA + Pages
5. report concise result and only necessary live-check points
