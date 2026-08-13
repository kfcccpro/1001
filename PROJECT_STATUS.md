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
- U08 `동사 자리·준동사 자리`: workbook p.26~27 / answer-book p.16~17 Q01~Q04 verified. Former PFAL items were replaced with publisher Q03~Q04 source tasks, including `acting`, `a natural tendency to behave like the people around you`, and `struggling` → `source_aligned_batch_qa`.
- U28 `등위접속사 뒤의 삽입어구에 주의하라`: workbook p.76~77 / answer-book p.55~56 Q01~Q03 verified. Former PFAL item was replaced with publisher Q02~Q03 coordination tasks → `source_aligned_batch_qa`.
- U33~U36 and U39 were already promoted in the same source-audit batch after publisher-source verification.
- Catalog now has no `source_aligned_plus_pfal_batch_qa`, `source_concept_pfal_batch_qa`, or `pfal_derived_batch_qa` units. All 48 Units are representative source-aligned QA sets, except Unit 01 which retains its validation-specific status.
- `source_aligned_batch_qa` means a representative publisher-source QA set, not a full reproduction or final line-by-line verification of every workbook item.

## Batch working rule
- Source retrieval, item replacement and logical review are grouped across 2~3 work stages before a repository checkpoint.
- Intermediate edits may be accumulated on a temporary batch branch so main/Pages are not redeployed after every micro-step.
- Main is advanced once after the batch is internally complete and ready for CI/deployment.

## Full-workbook supervisor audit checkpoint
- Combined PIN 2007 review exposes Chapter, Unit, interaction and source classification per item.
- Span/pairSpan items use actual student runtime token boundaries; Unit-level and item-level jumps are available.
- Static QA enforces catalog/meta chapter-title-status consistency, required fields, complete validationFlow coverage and selectable answers; layout telemetry remains enabled.
- PWA cache key: `chunilmun-pfal-t1-v093w`.

## Verification still required
1. Live PIN 2007 `Unit 01~48 한꺼번에 검수` visual sweep on desktop/tablet/mobile; do not mark complete without browser/screenshot evidence.
2. Cloud diagnostic all PASS, multi-device round-trip/active-time QA.
3. Student-mode multi-unit regression.
4. U47 source breadth remains narrow and should be revisited during final source freeze.

## Operating rules
- Keep source-aligned and PFAL-derived content explicitly distinguishable when PFAL-derived material is reintroduced in future work.
- Supervisor mode never writes student progress/time.
- Group 2~3 work stages before one main/deployment checkpoint unless a blocking defect requires an immediate hotfix.
