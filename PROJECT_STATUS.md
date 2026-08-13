# PROJECT STATUS

- Project: Chunilmun PFAL
- Core version: `0.9.3`
- Expansion layer: `0.9.3-batch6`
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student PIN: `8081`
- Admin/Supervisor PIN: `2007`
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Chapter 01~12 / Unit 01~48 implemented.
- PIN 2007 combined supervisor review targets `Unit 01~48` dynamically from `data/catalog.json`.
- Student actual learning mode alone writes progress, reviews, sessions and active time.

## Source-validation status — 2026-08-13
- Unit 41~44: representative workbook sentences and answer-book logic verified → `source_aligned_batch_qa`.
- Unit 45 `관계사절이 여러 개 들어간 복잡한 문장`: workbook p.120~121 concept + answer-book representative Q03~Q05 sentence/structure logic verified → `source_aligned_batch_qa`.
- Unit 46 `비교구문과 결합한 복잡한 절`: workbook p.122~123, especially Q05~Q07, and answer-book comparison logic verified → `source_aligned_batch_qa`.
- Unit 47 `특수구문과 결합한 복잡한 절`: answer-book Unit47 Q01 publisher sentence and create / It is ~ who analysis verified → `source_aligned_batch_qa`. Only the verified representative source sentence is used; this is not a claim that every publisher exercise was reproduced.
- Unit 48 remains `source_aligned_batch_qa`.
- Chapter 12 Unit 45~48 is now source-aligned at the representative QA-set level.
- Source-aligned status means selected publisher sentences and answer logic are verified; full live viewport/content freeze remains a separate gate.

## Full-workbook semantic QA checkpoint
- Static QA covers Unit 01~48 JSON/catalog consistency, global IDs, choice-answer membership, selectable span/pairSpan answers, and validationFlow references/duplicates.
- Span runtime supports compounds, suspensive hyphens, abbreviations, quoted phrases, contractions and numeric suffixes.
- Selected Unit restoration after reload is implemented.
- Learning report Unit label and selected-Unit `내일 다시` count are corrected.
- PWA cache key after this source-validation update: `chunilmun-pfal-t1-v093p`.

## Verification still required
1. PIN 2007 → `Unit 01~48 한꺼번에 검수`: full-workbook order, text, prompts, answers/explanations and compact layout; batch-fix issues found in the live sweep.
2. Revisit earlier PFAL-staged Units 07, 17~19, 21~25, 27, 31~32 for publisher-source validation where useful; keep mixed/PFAL statuses honest until verified.
3. Cloud diagnostic all PASS, then PC/mobile/tablet round-trip and active-time QA.
4. Student-mode multi-unit regression, especially due-review separation and cloud round-trip after Unit switching.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
