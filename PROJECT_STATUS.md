# PROJECT STATUS

- Project: Chunilmun PFAL
- Version: 0.9.3 + batch1 expansion layer
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
- Chapter 01 `주어·동사 찾기`: Unit 01~04 available in the webapp catalog
- Chapter 02 `수식어구 뒤의 동사 찾기`: Unit 05~08 available in the webapp catalog
- Unit 01 remains the source-aligned validated baseline
- Unit 02~06 are staged as batch-QA candidates using source-aligned / source-derived material where checked
- Unit 07 is explicitly PFAL-derived concept practice for batch UI/learning-flow QA, not a claim of publisher-source validation
- Unit 08 is staged as mixed source-derived / PFAL concept practice and still requires content validation
- PIN 2007 supervisor mode now includes `Unit 01~08 한꺼번에 검수` in addition to current-unit review
- Unit selector is available so individual units can also be inspected separately
- Supervisor mode allows Previous/Next/jump and optional answer/explanation without saving progress/time
- Student actual learning mode is the only mode that writes learning progress and active time
- Guided Repair v0.9.2: first wrong answer shows one simple thinking cue + one-line grammar concept before full answer/explanation
- Compact Layout v0.9.3: minimize vertical scrolling; on desktop, feedback/repair appears beside the problem using horizontal space
- Multi-unit batch layer `0.9.3-batch1`: Chapter 01~02 catalog, Unit 01~08 loading, and combined supervisor review

## v0.9.3 deployment / QA checkpoint
- Repository `VERSION` and runtime `APP_VERSION` are aligned at `0.9.3`; the multi-unit expansion is an additive `batch1` layer rather than a core-version bump.
- PWA cache key is refreshed to `chunilmun-pfal-t1-v093b` so Unit 01~08 assets replace the previous cached shell.
- Static QA now validates JavaScript syntax plus catalog / Unit 01~08 JSON integrity and flow references.
- Real viewport and content confirmation remain pending until the combined supervisor review is checked on the live site.

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
1. PIN 2007 → `Unit 01~08 한꺼번에 검수`: chapter/unit order, sentence/prompt/answer/explanation correctness, Previous/Next/jump behavior
2. Source-content validation for staged Unit 02~08 before treating those units as final learning content
3. Desktop/tablet/mobile compact-layout visual QA while traversing the combined batch
4. PIN 2007 → `클라우드 연결 진단`: SDK / anonymous auth / state read-write / session read-write all PASS
5. PC → mobile/tablet → PC round-trip progress continuation across more than one unit
6. Active-time behavior: visible/active counts; idle/background does not; reconnect does not double-count
7. Real-data admin history QA

## UI principle
- Development review: supervisor mode prioritizes fast inspection over learning enforcement
- Actual student learning: One Screen / One Task / One Decision
- Use horizontal space first; minimize downward scrolling
- Avoid large countdowns, excessive badges, coins, streak-loss pressure and decorative animation
- First error should prompt one more thought before full explanation when pedagogically useful
- Publisher source text and PFAL-derived content must remain conceptually and operationally distinguishable; do not treat staged PFAL items as source-validated items

## Operating rule
1. Always read latest `main` before editing.
2. In a new chat, read `PROJECT_HANDOFF_LATEST.md` first.
3. Make the smallest necessary change.
4. During development, default to supervisor review; for this expansion use combined Unit 01~08 review first.
5. Student mode alone writes progress and active learning time.
6. Commit small safe changes directly to `main`.
7. GitHub Pages deploys automatically.
8. User primarily supplies screenshots / short feedback; assistant handles code, QA and deploy when connector access is available.
