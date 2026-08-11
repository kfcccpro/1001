# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.6.0
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
- Student home: due review count / current Unit / streak / recent 7-day learning trace
- Delayed recall: D+1 baseline, D+3 for errors, D+7 for memory-critical items and errors
- Learning result screen: evidence-based growth reward rather than coins or rank
- Growth evidence: structure finding / independent solving / grammar-meaning application / review recall
- Previous-session delta appears only when evidence is comparable; otherwise shows insufficient evidence
- Longest independently solved sentence and verified skill wins shown as concrete reward
- Current persistence: localStorage only, intentionally simple
- PWA cache v060

## UI principle
- One Screen / One Task / One Decision during learning
- Hide architecture and analytics while solving
- Show richer growth information only after the session
- Use motion only for memory-critical attention and visible learning growth
- Avoid large countdowns, excessive badges, coins, streak-loss pressure, and decorative animation

## Current learning loop
1. Due D+1/D+3/D+7 review first
2. Unit source item
3. Explicit answer submission
4. Correct/wrong + concise source-aligned explanation
5. Memory-critical point receives short attention hold
6. Continue without forced repeated correction in the current prototype
7. End-of-session evidence-based growth report
8. Review items scheduled for future days

## Next work
1. Validate v0.6 growth report on PC and tablet-size screens.
2. Refine the reward language and metrics so they remain concrete and non-inflated.
3. Add a compact `Before → After` challenge only where the same skill has sufficient comparable evidence.
4. Add a simple daily target/stop rule for the ~1-hour supervised study window without showing an anxiety-inducing countdown.
5. After Unit 01 learning mode is stable, freeze the Unit interaction specification and expand Chapter 1.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. Validate student flow before adding complexity.
4. Commit directly to `main` for small safe changes.
5. GitHub Pages deploys automatically.
6. User tests the deployed version and sends screenshot/feedback.
7. In conversation, prefer in-chat preview/reproduction for review; use the external URL as the deployment target, not as the primary review method.
