# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core `0.9.3`; expansion `0.9.3-batch6`
- Student PIN `8081`; Admin/Supervisor PIN `2007`

## 2. Invariants
- Only actual student mode writes progress/review/session/active time; supervisor is read-only.
- Student UX stays One Screen · One Task · One Decision with ADHD-friendly pacing.
- Publisher source-aligned, mixed and PFAL-derived content remain explicitly distinguished.

## 3. Latest completed source work
- U21~U23 were converted from source-concept/PFAL staging to representative `source_aligned_batch_qa` using verified publisher sentences/answer logic. Together with U24, Chapter 06 U21~U24 is now source-aligned at representative QA-set level.
- U48 source freeze was tightened: the adapted short Q02-2 sentence was replaced by the exact full SNS source sentence already verified for Q02-1; the oversized Q01-2 relation-clause span drag was converted to an exact-source choice judgment for mobile usability.
- Remaining pure source-concept/PFAL queue: U25 → U27 → U31~32. Targeted searches have been repeated, but no safe status promotion will occur until exact publisher sentence/answer evidence is retrieved.

## 4. Supervisor audit / QA
- PIN 2007 combined review shows Chapter/Unit/interaction/source classification, uses actual token boundaries for span previews, and supports Unit/item jump.
- Static QA checks all Unit JSON/catalog consistency, required fields, complete validationFlow and selectable answers and emits layout telemetry.
- Live desktop/tablet/mobile visual sweep still requires browser/screenshot evidence and must not be claimed complete yet.
- PWA cache: `chunilmun-pfal-t1-v093u`.

## 5. Cloud
- Firebase project `moonma-f6dbe`; collections `chunilmun1001`, `chunilmun1001_sessions`.
- Firestore rules were reported published; PIN 2007 diagnostic PASS screenshot remains pending.

## 6. Next priorities
1. Continue exact-source retrieval for U25, U27, U31~32; only promote when publisher evidence is sufficient.
2. Audit mixed units after the pure-PFAL queue.
3. Live full-workbook supervisor viewport sweep when screenshot/browser evidence is available.
4. Cloud diagnostic + PC/mobile/tablet round-trip active-time/progress QA.
5. Student-mode multi-unit regression.

## 7. Auto-continue
On `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent, read latest main/status/handoff/actions, execute incomplete priorities without asking, commit safe changes to main, verify Static QA + Pages, and report concise results.
