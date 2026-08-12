# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.9.3
- Canonical branch: `main`
- Architecture: static HTML/CSS/Vanilla JS + JSON + Firebase cloud-persistence client
- Build step: none
- Student: 1
- Admin/Supervisor: 1
- Student PIN: 8081
- Admin PIN: 2007
- Deployment: GitHub Pages via GitHub Actions
- Pages URL: `https://kfcccpro.github.io/1001/`
- Canonical handoff: `PROJECT_HANDOFF_LATEST.md`

## Current scope
- Unit 01 `주어의 형태` source-aligned content
- Supervisor review mode is the default development-review path for PIN 2007
- Supervisor mode allows Previous/Next/jump and optional answer/explanation without saving progress/time
- Student actual learning mode is the only mode that writes learning progress and active time
- Guided Repair v0.9.2: first wrong answer shows one simple thinking cue + one-line grammar concept before full answer/explanation
- Compact Layout v0.9.3: minimize vertical scrolling; on desktop, feedback/repair appears beside the problem using horizontal space
- Korean guidance/explanation/action labels remain enlarged; English source sentence remains primary and large

## Cloud / learning record
- Firebase project: `moonma-f6dbe`
- Background Anonymous Auth
- Firestore namespaces: `chunilmun1001`, `chunilmun1001_sessions`
- User reported Firestore rules manually published in Firebase Console on 2026-08-12
- Actual active learning time is the primary stored management metric
- Active time counts while page is visible and recent interaction exists; long idle/background is excluded
- Cross-device target: PC / mobile / Android tablet / iPad share progress, review queue, partial session and session history
- Admin view includes today / 7-day / 30-day active time, Unit progress, active session and recent sessions

## Verification still required
1. PIN 2007 → `클라우드 연결 진단`: SDK / anonymous auth / state read-write / session read-write all PASS
2. PC → mobile/tablet → PC round-trip progress continuation
3. Active-time behavior: visible/active counts; idle/background does not; reconnect does not double-count
4. Real-data admin history QA
5. v0.9.3 compact layout visual QA on desktop/tablet/mobile

## UI principle
- Development review: supervisor mode prioritizes fast inspection over learning enforcement
- Actual student learning: One Screen / One Task / One Decision
- Use horizontal space first; minimize downward scrolling
- Avoid large countdowns, excessive badges, coins, streak-loss pressure and decorative animation
- First error should prompt one more thought before full explanation when pedagogically useful

## Operating rule
1. Always read latest `main` before editing.
2. In a new chat, read `PROJECT_HANDOFF_LATEST.md` first.
3. Make the smallest necessary change.
4. During development, default to supervisor review.
5. Student mode alone writes progress and active learning time.
6. Commit small safe changes directly to `main`.
7. GitHub Pages deploys automatically.
8. User primarily supplies screenshots / short feedback; assistant handles code, QA and deploy when connector access is available.
