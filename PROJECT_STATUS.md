# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.9.0
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
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
- Cross-device client logic added for PC/mobile/tablet/iPad using background Firebase Anonymous Auth + Cloud Firestore
- Cloud namespace is isolated as `chunilmun1001` and `chunilmun1001_sessions`; Moonmago records are not mixed with Chunilmun records
- Existing Firebase project `moonma-f6dbe` is reused only as the backend project at this stage
- Client sync covers completed days, review queue, current/partial active session, device information, and completed learning sessions
- Partial session progress is checkpointed locally and, once Firestore rules are published, to cloud so another device can continue from remaining Unit items
- Offline fallback remains localStorage; reconnect/login merges local and cloud state
- Actual active learning time is the primary stored time metric
- Active time counts only while the page is visible and there has been learning interaction within the recent activity window; long idle periods stop accumulating
- Session record stores active time, wall time, device/browser, answers, accuracy evidence, and Unit information
- Admin has a dedicated `학습시간·진도 기록` view with today / 7-day / 30-day active time, Unit progress, current active-session checkpoint, and recent session history
- Static JavaScript QA workflow added and v0.9 syntax check passed
- PWA cache v090

## Firebase backend status
- Repository rule file has been updated to allow anonymous read/write only for the isolated Chunilmun namespaces.
- Automatic Firestore rules deployment was attempted through the existing Firebase service-account secret.
- Deployment reached the Firebase Rules API but failed with HTTP 403 `The caller does not have permission` during rules validation.
- Therefore the v0.9 client is currently safe in local fallback mode until the updated Firestore rules are published once with an account/token that has Firebase Rules permission.
- No Moonmago live Firestore rules were changed by the failed deployment attempt.

## UI principle
- During development review, supervisor mode prioritizes fast inspection over learning enforcement
- Supervisor review: item → optional answer/explanation → Previous/Next/jump; no learning writes
- One Screen / One Task / One Decision during actual student learning
- English source sentence remains large and primary
- Korean instructions, explanations, feedback, and action labels remain enlarged
- Admin's primary management number is actual active learning time rather than accuracy
- Avoid large countdowns, excessive badges, coins, streak-loss pressure, and decorative animation

## Current student learning loop
1. Login attempts cloud/local merge before showing current progress
2. If cloud permission is unavailable, local fallback continues without blocking learning
3. Today plan shown as blocks and approximate workload, not a timer
4. Due D+1/D+3/D+7 review first
5. Before comparable-skill check
6. Source-aligned Unit items
7. Each submitted result checkpoints progress/review state locally and attempts cloud sync
8. Actual active time accumulates while visible and recently active
9. Checkpoint approximately every 30 seconds and at page hide/navigation checkpoints
10. Correct/wrong + enlarged concise explanation
11. Calm block checkpoint
12. Final comparable check
13. Session is saved with active time, wall time, device, answers, and Unit progress

## Next work
1. Publish the prepared Firestore rules once with Firebase Rules permission; this is the only blocker for live cross-device writes.
2. Verify real GitHub Pages → Anonymous Auth → Firestore read/write end to end.
3. Verify PC → mobile/tablet → PC round-trip progress continuation with an interrupted partial session.
4. Verify actual active-time logic: visible learning counts, background/long idle does not, reconnect does not double-count.
5. Refine admin history with day-by-day 7/30-day charts and per-session problem/time detail after real sync data is collected.
6. Freeze the Unit 01 interaction/data specification after cloud and timing QA.
7. Continue providing development builds in supervisor-first review mode until the user explicitly switches back to student-flow validation.

## Operating rule
1. Always read latest `main` before editing.
2. Make the smallest necessary change.
3. During development, default to supervisor review so the user can inspect all content rapidly without saving progress.
4. Student mode alone writes progress and active learning time.
5. Commit directly to `main` for small safe changes.
6. GitHub Pages deploys automatically.
7. User reviews primarily through supervisor mode / in-chat previews; external Pages URL is the live verification target.
