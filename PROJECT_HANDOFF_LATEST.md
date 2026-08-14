# 천일문 PFAL — PROJECT HANDOFF LATEST

- Repo: `kfcccpro/1001` / canonical `main`
- Core: `0.9.3`; expansion/content: `0.9.3-batch6`; runtime/readability: `0.9.4c`
- Student PIN `8081`; Admin/Supervisor PIN `2007`
- Only actual student learning may write progress/review/session/active-time shared state. Supervisor remains read-only for learning records.

## Frozen product scope
- Chapter 01~12 / Unit 01~48 implemented as representative publisher-source-aligned QA sets.
- U01: `source_aligned_validation`; U02~U48: `source_aligned_batch_qa`.
- New feature development is frozen unless a release-blocking defect is found.

## Final blocker batch — 2026-08-14
1. U47 source-freeze flag closed: exact workbook/answer evidence now covers representative Q01 and Q05~Q07 tasks (emphasis, apposition, shared modifier, passive `be used`, parallel clauses, causal `as`).
2. Active-time hardening: periodic checkpoints occur only while visible/recently active, so idle/background tabs do not keep live-study state fresh. Live-session freshness is about 3 minutes (`ACTIVE_GRACE_MS + 60s`).
3. Cloud diagnostic cleanup now attempts state/session cleanup on both success and failure paths.
4. PWA cache: `chunilmun-pfal-t1-v094c`.
5. Runtime Regression Guard protects the above invariants plus the readability floor and zero learning sentences >=320 characters.

## Remaining release evidence
- PIN 2007 full-workbook visual sweep on desktop/tablet/mobile with actual screenshots/browser evidence.
- Cloud Diagnostic all PASS in the deployed origin.
- PIN 8081 real multi-device round-trip: learning write/sync, idle/background time exclusion, and PIN 2007 read-only confirmation.

## Finish rule
- Do not invent live PASS results.
- If the three evidence groups pass without defects, perform one final documentation/version freeze and close the project.
- If defects appear, fix only release blockers and re-run the affected evidence group.
