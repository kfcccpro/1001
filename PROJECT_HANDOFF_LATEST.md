# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core version `0.9.3`; expansion layer `0.9.3-batch6`
- Student PIN `8081`; Admin/Supervisor PIN `2007`
- Static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore

## 2. Invariants
- Only actual student mode writes progress/review/session/active time.
- Supervisor mode is read-only for learning records.
- Student UI: One Screen · One Task · One Decision; ADHD-friendly pacing.
- Publisher source-aligned, mixed and PFAL-derived content must remain explicitly distinguishable.

## 3. Latest completed source work
- U07: answer-book Unit07 Q07~Q08 representative source/structure verified and converted to `source_aligned_batch_qa`.
- U17: workbook p.50~51 / answer-book p.35 representative omission/common-structure source converted to `source_aligned_batch_qa`.
- U18: workbook p.52~53 / answer-book p.37 representative Q05~Q06 converted to `source_aligned_batch_qa`.
- U19: workbook p.54~55 / answer-book p.39 representative Q05~Q07 converted to `source_aligned_batch_qa`.
- U44 TOC wording corrected from `특정 전치사구를 동반하는 동사` to the publisher wording `특정 전명구를 동반하는 동사`.
- Remaining pure PFAL/source-concept queue: U21~25 → U27 → U31~32.

## 4. Full-workbook supervisor audit
- PIN 2007 `Unit 01~48 한꺼번에 검수` carries Chapter/Unit/interaction/source classification.
- Span/pairSpan preview uses the actual runtime token boundaries.
- Unit jump and item jump are available; long source sentences receive supervisor-only compact sizing.
- Static QA validates all Unit JSON/catalog consistency, required fields, complete validationFlow and selectable span answers, and emits layout telemetry.
- PWA cache: `chunilmun-pfal-t1-v093r`.

## 5. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- active learning time is primary metric; Firestore rules were reported published, but PIN 2007 diagnostic PASS screenshot remains pending.

## 6. Next priorities
1. Live desktop/tablet/mobile combined supervisor visual sweep; do not claim this completed without browser/screenshot evidence.
2. Source-align U21~25, then U27, U31~32 where exact publisher source/answers can be verified.
3. Revisit mixed units and U48 adaptation/source-freeze issue.
4. Cloud diagnostic and multi-device round-trip QA.
5. Student-mode multi-unit regression.

## 7. Auto-continue
If user says `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent, read latest main/handoff/status/VERSION/Actions, execute the first incomplete priority without asking, commit safe changes to main, verify Static QA + Pages, and report concise results.
