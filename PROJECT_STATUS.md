# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Runtime/readability layer: `0.9.4`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Student PIN: `8081`; Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- Student actual learning mode alone writes progress, reviews, sessions and active time.
- PIN 2007 combined review remains read-only for learning records.
- v0.9.4 restores learning/admin/supervisor visual scale after the compact-layout regression while keeping the compact horizontal flow.
- Student/admin Unit navigation now selects a Chapter first and exposes at most four Unit cards at once.

## Source-validation status — 2026-08-14
- U08 `동사 자리·준동사 자리`: workbook p.26~27 / answer-book p.16~17 Q01~Q04 verified → `source_aligned_batch_qa`.
- U28 `등위접속사 뒤의 삽입어구에 주의하라`: workbook p.76~77 / answer-book p.55~56 Q01~Q03 verified → `source_aligned_batch_qa`.
- U33~U36 and U39 were promoted after publisher-source verification.
- Catalog has no mixed/PFAL-derived QA status remaining. All 48 Units are representative source-aligned QA sets, except Unit 01 which retains its validation-specific status.
- `source_aligned_batch_qa` means a representative publisher-source QA set, not a full reproduction or final line-by-line verification of every workbook item.
- U19 Q06 now uses only the exact source sentence required for the relation-clause judgment, reducing the only >=320-character learning sentence while preserving the source task and answer logic.

## Runtime/readability hardening — v0.9.4
- `syncFromCloud()` is read/merge only; it no longer republishes shared state merely because the app opened, refreshed, or an admin viewed records.
- Shared-state writes are guarded to actual student `learn` runs; supervisor/demo/passive modes cannot write learning state through the shared-state path.
- Cloud diagnostic removes its temporary `diagnostic` marker after read-back verification and deletes its temporary diagnostic session document.
- Fresh active-session display window reduced from 24 hours to 2 hours to avoid stale live-study indicators.
- Growth comparisons reject cross-Unit deltas; latest student snapshot is Unit-local.
- Admin progress label follows the selected Unit rather than always saying Unit 01.
- `visibility-v094.css` restores larger sentence, prompt, answer, explanation, navigation and supervisor-audit text sizes across PC/tablet/mobile.
- New `Runtime Regression Guard` CI protects student-write isolation, diagnostic cleanup, Chapter-filter navigation, v0.9.4 asset wiring, mobile readability floor and zero learning sentences >=320 characters.
- PWA cache key: `chunilmun-pfal-t1-v094b`.

## Batch working rule
- Source retrieval, code fixes and logical review are grouped across 2~3 work stages before a repository checkpoint.
- Intermediate edits may be accumulated on a temporary batch branch so main/Pages are not redeployed after every micro-step.
- Main is advanced once after the batch is internally complete and ready for CI/deployment.

## Verification still required
1. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
2. Live cloud diagnostic all PASS, followed by PC↔tablet/mobile round-trip and active-time QA.
3. Student PIN 8081 multi-unit regression: actual learning must write; idle/background time must not accumulate; PIN 2007 must remain read-only.
4. U47 source breadth remains narrow and should be revisited during final source freeze.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable when PFAL-derived material is reintroduced in future work.
- Supervisor mode never writes student progress/time.
- Group 2~3 work stages before one main/deployment checkpoint unless a blocking defect requires an immediate hotfix.
