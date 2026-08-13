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
- U21: workbook p.60~61 / answer-book p.42 representative Q01~Q04 verified → `source_aligned_batch_qa`; so/neither/nor/there inversion is represented.
- U22: workbook p.62~63 / answer-book representative Q05~Q07 verified → `source_aligned_batch_qa`; fronted complement/locative phrase, inversion and omitted relative pronoun are represented.
- U23: workbook p.64~65 / answer-book p.45 representative Q01~Q02 verified → `source_aligned_batch_qa`; heavy-object shift, parenthetical insertion and to-infinitive modifier are represented.
- U24 was already source-aligned, so Chapter 06 U21~U24 is now source-aligned at representative QA-set level.
- Remaining pure source-concept/PFAL queue: U25 → U27 → U31~32. Initial targeted searches for U25/U27/U31/U32 were insufficient for safe promotion, so their current status is intentionally retained.

## 4. Supervisor audit / QA
- PIN 2007 combined review shows Chapter/Unit/interaction/source classification, uses actual token boundaries for span previews, and supports Unit/item jump.
- Static QA checks all Unit JSON/catalog consistency, required fields, complete validationFlow and selectable answers and emits layout telemetry.
- Live desktop/tablet/mobile visual sweep still requires browser/screenshot evidence and must not be claimed complete yet.
- PWA cache: `chunilmun-pfal-t1-v093t`.

## 5. Cloud
- Firebase project `moonma-f6dbe`; collections `chunilmun1001`, `chunilmun1001_sessions`.
- Firestore rules were reported published; PIN 2007 diagnostic PASS screenshot remains pending.

## 6. Next priorities
1. Re-search and source-align U25, U27, U31~32 only where exact publisher source/answers can be verified.
2. Revisit mixed units and U48 adaptation/source-freeze issue.
3. Live full-workbook supervisor viewport sweep when screenshots/browser evidence are available.
4. Cloud diagnostic + PC/mobile/tablet round-trip active-time/progress QA.
5. Student-mode multi-unit regression.

## 7. Auto-continue
On `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent, read latest main/status/handoff/actions, execute incomplete priorities without asking, commit safe changes to main, verify Static QA + Pages, and report concise results.
