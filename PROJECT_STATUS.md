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
- Unit 41 `it ~ to-V[that]`: workbook p.110 + answer book p.80 exact source/answer logic verified and converted to `source_aligned_batch_qa`.
- Unit 43 `짝을 이루는 대명사·부사`: workbook p.114 + answer book p.84 exact source/answer logic verified and converted to `source_aligned_batch_qa`.
- Unit 42 and Unit 44~47 remain `source_concept_pfal_batch_qa`; do not describe them as publisher-source validated yet.
- Unit 48 remains `source_aligned_batch_qa`.
- Source-aligned status means publisher sentence and answer logic are verified; full live viewport/content freeze is still a separate gate.

## Full-workbook semantic QA checkpoint
- Static QA covers Unit 01~48 JSON/catalog consistency, global IDs, choice-answer membership, selectable span/pairSpan answers, and validationFlow references/duplicates.
- Span runtime supports compounds, suspensive hyphens, abbreviations, quoted phrases, contractions and numeric suffixes.
- Selected Unit restoration after reload is implemented.
- Learning report Unit label and selected-Unit `내일 다시` count are corrected.
- PWA cache key after this source-validation update: `chunilmun-pfal-t1-v093n`.

## Verification still required
1. Continue source-validation/freeze: Unit 42, then Unit 44~47; after that revisit earlier PFAL-staged Units 07, 17~19, 21~25, 27, 31~32 as needed.
2. PIN 2007 → `Unit 01~48 한꺼번에 검수`: full-workbook order, text, prompts, answers/explanations and compact layout.
3. Cloud diagnostic all PASS, then PC/mobile/tablet round-trip and active-time QA.
4. Student-mode multi-unit regression, especially due-review separation and cloud round-trip after Unit switching.

## Operating rules
- Always read latest main/handoff/status/VERSION before editing.
- Keep source-aligned and PFAL-derived content explicitly distinguishable.
- Supervisor mode never writes student progress/time.
- Small safe changes go directly to main; Pages auto-deploys.
- Bump SW cache after cached asset changes.
