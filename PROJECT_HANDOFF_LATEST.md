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
- Chapter 01~12 / Unit 01~48 implemented; `data/catalog.json` is canonical.
- U41~48 are source-aligned at the representative QA-set level; earlier source/PFAL/mixed classifications remain as catalogued.

## 4. Full-workbook supervisor audit — latest
- PIN 2007 `Unit 01~48 한꺼번에 검수` now exposes Chapter, Unit, interaction and content-source classification per item.
- Combined clones carry `auditUnit`, `auditUnitTitle`, `auditChapter`, `auditChapterTitle`, and `auditStatus`; supervisor mode still writes no student progress/time.
- Span/pairSpan previews use the actual runtime tokenization so selectable boundaries can be audited visually without answering.
- Added Unit jump and item jump; long/very-long sentences use supervisor-only compact font sizing for faster review.
- Static QA additionally validates catalog/meta chapter-title-status consistency, required display/explanation fields, complete validationFlow coverage, and layout telemetry.
- PWA cache: `chunilmun-pfal-t1-v093q`.

## 5. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- actual active time is primary metric; visible + recent interaction only
- Firestore rules reported published; PIN 2007 diagnostic PASS screenshot still pending

## 6. Next priority
1. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile and batch-fix viewport-specific issues.
2. Revisit earlier PFAL-staged Units 07, 17~19, 21~25, 27, 31~32 for publisher-source validation where useful.
3. Cloud diagnostic all PASS + PC/mobile/tablet round-trip progress/active-time QA.
4. Student-mode multi-unit regression, especially Unit switching + due-review separation + persisted selection.
5. Only after those gates decide whether to expand beyond this workbook.

## 7. Auto-continue rule
If user says `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent:
1. read latest main/handoff/status/VERSION/Actions
2. execute the first incomplete priority without asking
3. safe changes direct to main
4. verify Static QA + Pages
5. report concise result and necessary live-check points
