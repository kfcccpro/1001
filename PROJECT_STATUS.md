# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Student PIN: `8081`; Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- Student actual learning mode alone writes progress, reviews, sessions and active time.
- PIN 2007 combined review remains read-only for learning records.

## Source-validation status — 2026-08-13
- U33 `대명사 it, they, this, that`: publisher Q01~Q03 verified; PFAL-only item replaced by source Q03 tasks for `they`, `those`, and `discard` → `source_aligned_batch_qa`.
- U34 `숨어 있는 가정법`: representative publisher Q05~Q06 verified; custom `Without` item removed → `source_aligned_batch_qa`.
- U35 `부정구문`: publisher Q01~Q03 verified; custom `not all` item removed → `source_aligned_batch_qa`.
- U36 `인과/선후를 나타내는 수동태 표현`: publisher Q04~Q06 verified; PFAL-only `attributed to`/`caused by` examples replaced by publisher Q04 `be attributed to` tasks → `source_aligned_batch_qa`.
- U39 `정보 추가 vs. 강조`: publisher Q01~Q04 verified; PFAL `Indeed`/`Moreover` examples replaced by publisher Q03 `furthermore` and Q04 `as well` tasks → `source_aligned_batch_qa`.
- U08 and U28 were re-audited. Exact additional publisher evidence was not sufficient to remove their remaining PFAL items safely, so they intentionally remain `source_aligned_plus_pfal_batch_qa`.
- No pure `source_concept_pfal_batch_qa` or `pfal_derived_batch_qa` units remain in the catalog.

## Batch working rule
- Source retrieval, item replacement and logical review are grouped across 2~3 work stages before a repository checkpoint.
- Intermediate edits are accumulated on a temporary batch branch so main/PAGES are not redeployed after every micro-step.
- Main is advanced once after the batch is internally complete and ready for CI/deployment.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093w`.

## Verification still required
1. Finalize U08/U28 only if exact publisher source can be recovered; otherwise retain explicit mixed classification.
2. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
3. Cloud diagnostic all PASS, multi-device round-trip/active-time QA, then student-mode regression.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Group 2~3 work stages before one main/deployment checkpoint unless a blocking defect requires an immediate hotfix.
