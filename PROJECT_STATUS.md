# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.9.0
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud persistence
- Build step: none
- Student: 1
- Admin: 1
- Student PIN: 8081
- Admin PIN: 2007
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`

## Current scope
- Unit 01 `주어의 형태` source-aligned content
- Supervisor review mode remains the default development-review path for PIN 2007
- Supervisor mode does not require solving, does not save progress/time, and allows immediate Previous/Next/jump navigation
- Student actual learning mode remains separate and is the only mode that writes learning progress and active time
- Cross-device persistence added for PC/mobile/tablet/iPad using background Firebase Anonymous Auth + Cloud Firestore
- Cloud namespace is isolated as `chunilmun1001` and `chunilmun1001_sessions`; Moonmago records are not mixed with Chunilmun records
- Existing Firebase project `moonma-f6dbe` is reused only as the backend project at this stage to avoid a second setup path
- Cloud state sync covers completed days, review queue, current/partial active session, device information, and completed learning sessions
- Partial session progress is checkpointed locally and to cloud so another device can continue from remaining Unit items
- Offline fallback remains localStorage; reconnect/login merges local and cloud state
- Actual active learning time is now the primary stored time metric
- Active time counts only while the page is visible and there has been learning interaction within the recent activity window; long idle periods stop accumulating
- Session record stores active time, wall time, device/browser, answers, accuracy evidence, and Unit information
- Admin has a dedicated `학습시간·진도 기록` view with today / 7-day / 30-day active time, Unit progress, current active-session checkpoint, and recent session history
- Delayed recall remains D+1 baseline, D+3 for errors, D+7 for memory-critical items/errors
- Evidence-based growth report and Before→After challenge remain enabled in student mode
- PWA cache v090

## UI principle
- During development review, supervisor mode prioritizes fast inspection over learning enforcement
- Supervisor review: item → optional answer/explanation → Previous/Next/jump; no learning writes
- One Screen / One Task / One Decision during actual student learning
- English source sentence remains large and primary
- Korean instructions, explanations, feedback, and action labels remain enlarged
- Admin's primary management number is actual active learning time rather than accuracy
- Avoid large countdowns, excessive badges, coins, streak-loss pressure, and decorative animation

## Current student learning loop
1. Login syncs cloud/local state before showing current progress
2. Today plan shown as blocks and approximate workload, not a timer
3. Due D+1/D+3/D+7 review first
4. Before comparable-skill check
5. Source-aligned Unit items
6. Each submitted result checkpoints progress/review state
7. Actual active time accumulates while visible and recently active
8. Cloud checkpoint approximately every 30 seconds and at page hide/navigation checkpoints
9. Correct/wrong + enlarged concise explanation
10. Calm block checkpoint
11. Final comparable check
12. Session is saved with active time, wall time, device, answers, and Unit progress
13. Another device can merge state and continue from remaining work

## Next work
1. Verify Firebase rules deployment and real GitHub Pages → Anonymous Auth → Firestore read/write path end to end.
2. Verify PC → mobile/tablet → PC round-trip progress continuation with an interrupted partial session.
3. Verify actual active-time logic: visible learning counts, background/long idle does not, reconnect does not double-count.
4. Refine admin history to add day-by-day 7/30-day charts and per-session problem/time detail after real sync data is collected.
5. Freeze the Unit 01 interaction/data specification after cloud and timing QA.
6. Continue providing development builds in supervisor-first review mode until the user explicitly switches back to student-flow validation.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. During development, default to supervisor review so the user can inspect all content rapidly without saving progress.
4. Student mode alone writes progress and active learning time.
5. Commit directly to `main` for small safe changes.
6. GitHub Pages deploys automatically.
7. User reviews primarily through supervisor mode / in-chat previews; external Pages URL is the live verification target.
