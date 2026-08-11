# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.8.2
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
- Unit 01 `주어의 형태` source-aligned content
- Supervisor review mode is now the default development-review path for PIN 2007
- Supervisor mode does not require solving, does not save progress, and allows immediate Previous/Next navigation through all validation items
- Supervisor can optionally reveal answer, explanation, structure, and memory point without submitting an answer
- Direct jump selector allows moving to any validation subquestion immediately
- Student actual learning mode remains available separately with normal answer submission and learning logic
- Validation mode: 17 subquestions
- Daily learning mode separated from validation/supervisor review
- Delayed recall: D+1 baseline, D+3 for errors, D+7 for memory-critical items and errors
- Evidence-based growth report: structure finding / independent solving / grammar-meaning application / review recall
- `Before → After` challenge: same what-clause subject skill at session start and finish
- Daily pacing: max 6 due reviews + max 14 remaining new items in one session
- Korean guidance/readability patch: English sentence scale unchanged; prompt, guide, feedback, explanation, memory point, checkpoint text, and action labels enlarged
- Current persistence: localStorage only; cross-device cloud sync is the next major architecture step
- PWA cache v082

## UI principle
- During development review, supervisor mode must prioritize fast inspection over learning enforcement
- Supervisor review: open item → optionally reveal answer/explanation → Previous/Next, with no required response and no learning-record writes
- One Screen / One Task / One Decision during actual student learning
- English source sentence remains large and primary
- Korean instructions, explanations, and feedback must be large enough to read immediately without leaning in
- Hide architecture and analytics while solving
- Avoid large countdowns, excessive badges, coins, streak-loss pressure, and decorative animation

## Current student learning loop
1. Today plan shown as blocks and approximate workload, not a timer
2. Due D+1/D+3/D+7 review first, capped at 6 per session
3. Before check on a comparable skill
4. Source-aligned Unit items, up to 14 remaining new items per session
5. Explicit answer submission
6. Correct/wrong + enlarged concise source-aligned explanation
7. Memory-critical point receives short attention hold
8. Calm block checkpoint
9. Final comparable check
10. Evidence-based growth report + Before/After result
11. Unfinished new items remain for the next session; review items are scheduled for future days

## Next work
1. Implement cloud persistence so progress is continuous across PC/mobile/tablet/iPad.
2. Make actual active learning time the primary stored and admin-visible metric; exclude long idle periods.
3. Synchronize current progress, completed items, review queue, sessions, accuracy, and active time through a single learner cloud state.
4. Build admin history views for today/7-day/30-day active learning time, session detail, current Unit progress, accuracy, and review recall.
5. Preserve offline learning with later merge/sync and keep PIN-only student/admin routing without signup UI.
6. Continue providing development builds in supervisor-first review mode until the user explicitly switches back to student-flow validation.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. During development, default to supervisor review so the user can inspect all content rapidly without saving progress.
4. Commit directly to `main` for small safe changes.
5. GitHub Pages deploys automatically.
6. User reviews changes primarily through in-chat previews and gives direct visual feedback.
7. External Pages URL is secondary verification, not the default review surface.
