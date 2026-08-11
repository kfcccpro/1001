# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.8.1
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
- Validation mode: 17 subquestions, one submission per item, no forced retry
- Daily learning mode separated from validation mode
- Delayed recall: D+1 baseline, D+3 for errors, D+7 for memory-critical items and errors
- Evidence-based growth report: structure finding / independent solving / grammar-meaning application / review recall
- `Before → After` challenge: same what-clause subject skill at session start and finish
- Daily pacing: max 6 due reviews + max 14 remaining new items in one session
- Core work is divided into 1–3 calm blocks depending on workload
- No visible countdown; approximate workload only
- Checkpoint after each block; after Block 2 of a 3-block session the learner may continue or finish through the final check
- Early finish preserves progress; remaining new items continue in the next session
- Unit progress is derived from actually completed new item IDs rather than a simple daily completion flag
- Korean guidance/readability patch: English sentence scale unchanged; prompt, guide, feedback, explanation, memory point, checkpoint text, and action labels enlarged
- Current persistence: localStorage only; cross-device cloud sync is the next major architecture step
- PWA cache v081

## UI principle
- One Screen / One Task / One Decision during learning
- English source sentence remains large and primary
- Korean instructions, explanations, and feedback must be large enough to read immediately without leaning in
- Hide architecture and analytics while solving
- Show richer growth information only after the session
- Use motion only for memory-critical attention and visible learning growth
- Avoid large countdowns, excessive badges, coins, streak-loss pressure, and decorative animation
- Treat planned early finish as a valid stopping rule, not failure

## Current learning loop
1. Today plan shown as blocks and approximate workload, not a timer
2. Due D+1/D+3/D+7 review first, capped at 6 per session
3. Before check on a comparable skill
4. Source-aligned Unit items, up to 14 remaining new items per session
5. Explicit answer submission
6. Correct/wrong + enlarged concise source-aligned explanation
7. Memory-critical point receives short attention hold
8. Calm block checkpoint
9. After Block 2 in a 3-block session, learner may continue or choose `마지막 체크 후 마치기`
10. Final comparable check
11. Evidence-based growth report + Before/After result
12. Unfinished new items remain for the next session; review items are scheduled for future days

## Next work
1. Implement cloud persistence so progress is continuous across PC/mobile/tablet/iPad.
2. Make actual active learning time the primary stored and admin-visible metric; exclude long idle periods.
3. Synchronize current progress, completed items, review queue, sessions, accuracy, and active time through a single learner cloud state.
4. Build admin history views for today/7-day/30-day active learning time, session detail, current Unit progress, accuracy, and review recall.
5. Preserve offline learning with later merge/sync and keep PIN-only student/admin routing without signup UI.
6. After cloud sync is stable, freeze Unit 01 interaction specification and expand Chapter 1.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. Validate student flow before adding complexity.
4. Commit directly to `main` for small safe changes.
5. GitHub Pages deploys automatically.
6. User reviews changes primarily through in-chat previews and gives direct visual feedback.
7. External Pages URL is secondary verification, not the default review surface.
