# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core `0.9.3`; expansion `0.9.3-batch6`
- Student PIN `8081`; Admin/Supervisor PIN `2007`
- Static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore

## 2. Invariants
- Only actual student mode writes progress/review/session/active time; supervisor is read-only.
- Student UX stays One Screen · One Task · One Decision with ADHD-friendly pacing.
- Publisher source-aligned, mixed and PFAL-derived content remain explicitly distinguished.

## 3. Latest completed source work
- U07: representative answer-book Q07~Q08 source/structure verified → `source_aligned_batch_qa`.
- U17~U19: representative workbook/answer-book source and omission/relative-clause logic verified → `source_aligned_batch_qa`.
- U24: workbook p.66 + answer-book p.47 representative Q01~Q03 verified → `source_aligned_batch_qa` (parallelism, inversion, object fronting, omission).
- U44 exact publisher TOC wording corrected to `특정 전명구를 동반하는 동사`.
- Remaining pure source-concept/PFAL queue: U21~23 → U25 → U27 → U31~32.

## 4. Supervisor audit / QA
- PIN 2007 combined review shows Chapter/Unit/interaction/source classification, uses actual token boundaries for span previews, and supports Unit/item jump.
- Static QA checks all Unit JSON/catalog consistency, required fields, complete validationFlow and selectable answers and emits layout telemetry.
- Live desktop/tablet/mobile visual sweep still requires browser/screenshot evidence and must not be claimed complete yet.
- PWA cache: `chunilmun-pfal-t1-v093s`.

## 5. Cloud
- Firebase project `moonma-f6dbe`; collections `chunilmun1001`, `chunilmun1001_sessions`.
- Firestore rules were reported published; PIN 2007 diagnostic PASS screenshot remains pending.

## 6. Next priorities
1. Source-align U21~23, then U25, U27, U31~32 where exact publisher source is verified.
2. Revisit mixed units and U48 adaptation/source-freeze issue.
3. Live full-workbook supervisor viewport sweep when screenshots/browser evidence are available.
4. Cloud diagnostic + PC/mobile/tablet round-trip active-time/progress QA.
5. Student-mode multi-unit regression.

## 7. Auto-continue
On `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent, read latest main/status/handoff/actions, execute incomplete priorities without asking, commit safe changes to main, verify Static QA + Pages, and report concise results.
