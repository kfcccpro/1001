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
- U25, U27, U31 and U32 were converted from source-concept/PFAL staging to representative `source_aligned_batch_qa` after direct workbook + answer-book verification.
- U25 covers allow/ensure parallelism, adjective/adverb parallelism, by + gerund parallelism and paired that-clauses.
- U27 covers nested coordination: not A but B, rather than, clause-level and, and because-clause coordination.
- U31 covers omitted comparison targets and recovery of omitted material.
- U32 covers not so much A as B, no more ... than, no less ... than and just as ... as equivalence.
- The catalog now has no pure PFAL/source-concept units. Remaining mixed units are U08, U28, U33~36 and U39.
- U48 source freeze already uses the exact SNS source sentence across both Q02 items.

## 4. Supervisor audit / QA
- PIN 2007 combined review shows Chapter/Unit/interaction/source classification, uses actual token boundaries for span previews, and supports Unit/item jump.
- Static QA checks all Unit JSON/catalog consistency, required fields, complete validationFlow and selectable answers and emits layout telemetry.
- Live desktop/tablet/mobile visual sweep still requires browser/screenshot evidence and must not be claimed complete yet.
- PWA cache: `chunilmun-pfal-t1-v093v`.

## 5. Cloud
- Firebase project `moonma-f6dbe`; collections `chunilmun1001`, `chunilmun1001_sessions`.
- Firestore rules were reported published; PIN 2007 diagnostic PASS screenshot remains pending.

## 6. Next priorities
1. Mixed-unit source audit: U08 → U28 → U33~36 → U39. Replace PFAL-only items only when exact publisher source/answers are verified.
2. Live full-workbook supervisor viewport sweep when screenshots/browser evidence are available.
3. Cloud diagnostic + PC/mobile/tablet round-trip active-time/progress QA.
4. Student-mode multi-unit regression.

## 7. Auto-continue
On `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent, read latest main/status/handoff/actions, execute incomplete priorities without asking, commit safe changes to main, verify Static QA + Pages, and report concise results.
