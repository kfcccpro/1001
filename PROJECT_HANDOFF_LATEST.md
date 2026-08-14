# 천일문 PFAL — PROJECT HANDOFF LATEST

- Repo: `kfcccpro/1001` / canonical `main`
- Core: `0.9.3`; expansion/content layer: `0.9.3-batch6`; runtime/readability patch: `0.9.4`
- Student PIN `8081`; Admin/Supervisor PIN `2007`
- Student actual learning mode is the only mode allowed to write progress/review/session/active-time shared state. Supervisor remains read-only for learning records.

## Source audit status
- Chapter 01~12 / Unit 01~48 are implemented as representative publisher-source-aligned QA sets.
- U01 retains `source_aligned_validation`; U02~U48 use `source_aligned_batch_qa`.
- U08 and U28 were finalized from exact workbook/answer-book evidence and are no longer mixed/PFAL-derived catalog units.
- This status means representative source-aligned QA coverage, not full-workbook republication or exhaustive line-by-line reproduction.

## v0.9.4 runtime/readability batch
1. Readability restoration: `visibility-v094.css` restores sentence, prompt, answer, button, home/admin and supervisor visual scale after the compact-layout reduction while retaining compact flow.
2. Multi-unit navigation: student/admin Unit selection is reduced from 48 simultaneously stacked Unit cards to Chapter tabs plus the selected Chapter's four Units.
3. Runtime isolation: `runtime-fixes-v094.js` makes ordinary cloud synchronization read-only, gates shared-state writes to real student learning, shortens stale active-session display to 2 hours, cleans diagnostic markers, keeps growth comparison Unit-local, and fixes the cloud-admin Unit progress label.
4. PWA cache key: `chunilmun-pfal-t1-v094a`.
5. Static QA now checks the v0.9.4 JS/CSS/index/PWA wiring in addition to the existing 48-Unit semantic validation.

## Verification still required
- GitHub Static QA and Pages deployment for the v0.9.4 batch after main advancement.
- Live PIN 2007 full-workbook visual sweep on desktop/tablet/mobile; browser/screenshot evidence is required before visual PASS.
- Cloud diagnostic all PASS and multi-device round-trip/active-time QA require live device evidence.
- Student-mode multi-unit regression requires live execution evidence.
- U47 source breadth remains a final source-freeze review flag, not a confirmed defect.

## Batch rule
- Group 2~3 meaningful stages before one main/deployment checkpoint.
- Avoid micro-deployments unless a blocking production defect requires a hotfix.
