# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.4.0
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON
- Build step: none
- Student: 1
- Admin: 1
- Student PIN: 8081
- Admin PIN: 2007
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Unit 01 `주어의 형태` source-aligned validation
- Workbook Q01~Q07 original subquestions converted into 17 interactive checks
- Interaction types: choice / span / pairSpan / text
- Fixed validation loop: answer → submit → correct/wrong → explanation → next
- No forced retry in validation mode
- Source-derived concise explanation, optional structure view and memory point
- Per-subquestion result summary at end
- PWA cache v040

## Source alignment verified
- Q01: two present-participle modifier phrases + was/were
- Q02: improve/improves + pronoun reference
- Q03: two subject ranges + pronoun reference
- Q04: noun-clause subject + infinitive modifier + relative clause
- Q05: what-clause subject + former reference + as meaning
- Q06: coordinated noun-clause subject + credible vocabulary recall
- Q07: TOPIC + parallel predicates + relative clause

## Next work
1. User validates the 17-item flow on the deployed URL.
2. Fix any remaining selection, tokenization, feedback, or mobile/tablet interaction defects.
3. Once validation UX is stable, freeze Unit 01 interaction specification.
4. Then create a separate actual-learning mode using the same verified items: daily retrieval, error correction, Memory Lock, transfer, D+1/D+3/D+7 recall, and visible growth reward.
5. Only after Unit 01 learning mode is stable, expand to the rest of Chapter 1.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. Validate student flow before adding complexity.
4. Commit directly to `main` for small safe changes.
5. GitHub Pages deploys automatically.
6. User tests the deployed URL and sends screenshot/feedback.
