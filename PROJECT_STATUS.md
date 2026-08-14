# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Runtime/readability layer: `0.9.4c`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Student PIN: `8081`; Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- Student actual learning mode alone writes progress, reviews, sessions and active time.
- PIN 2007 combined review remains read-only for learning records.
- Student/admin Unit navigation selects a Chapter first and exposes at most four Unit cards at once.
- v0.9.4 readability restoration remains active across PC/tablet/mobile.

## Source-validation status — 2026-08-14
- U01 retains `source_aligned_validation`; U02~U48 use `source_aligned_batch_qa`.
- U08/U28/U33~U36/U39 were previously finalized from exact workbook/answer-book evidence.
- U19 Q06 uses only the source sentence required for the target relation-clause judgment; no learning sentence is allowed to exceed the 320-character regression threshold.
- U47 final source-freeze breadth was expanded from Q01-only coverage to verified Q01 and Q05~Q07 source tasks. Q05 covers apposition, Q06 common-modifier scope and passive `be used`, and Q07 parallel in-objects plus causal `as`.
- `source_aligned_batch_qa` means representative publisher-source QA coverage, not full-workbook republication.

## Runtime/readability hardening — v0.9.4c
- `syncFromCloud()` is read/merge only and does not republish shared state on passive startup/admin refresh.
- Shared-state writes are gated to actual student `learn` runs.
- Cloud diagnostic removes temporary state/session markers on both success and failure cleanup paths.
- Active-time accumulation requires visible + recent interaction.
- Periodic active-session checkpoints now run only while the learner is actually active; hidden/idle tabs no longer keep the live-session timestamp fresh.
- Live active-session freshness is `ACTIVE_GRACE_MS + 60s` (about 3 minutes), replacing the former long stale window.
- Growth comparison remains Unit-local; admin progress label follows the selected Unit.
- Runtime Regression Guard checks write isolation, idle-time checkpointing, diagnostic cleanup, Chapter navigation, U47 freeze items, readability floor and zero sentences >=320 characters.
- PWA cache key: `chunilmun-pfal-t1-v094c`.

## Verification still required
1. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; browser/screenshot evidence is required before visual PASS.
2. Live Cloud Diagnostic all PASS.
3. Real PC↔tablet/mobile round-trip using PIN 8081, including actual learning write, idle/background active-time exclusion and PIN 2007 read-only confirmation.

## Release boundary
- New feature development is frozen unless a release-blocking defect is found.
- Remaining work is evidence-based live verification and only the fixes required by those tests.
- Group remaining verification/fixes into 2~3 meaningful stages before a deployment checkpoint.
