# 천일문 PFAL — PROJECT HANDOFF LATEST

## 1. Project
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core version: `0.9.3`; expansion layer: `0.9.3-batch6`
- Static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore
- Student PIN `8081`; Admin/Supervisor PIN `2007`

## 2. Invariants
- Only actual student mode writes progress/review/session/active time.
- Supervisor mode supports Previous/Next/jump and optional answer/explanation without saving.
- Student UI: One Screen · One Task · One Decision; large English/Korean; minimize vertical scroll.
- ADHD-friendly; no large countdown or excessive failure emphasis.
- Learning loop: Cold Attempt → structure judgment → minimal Guided Repair → retry → transfer → D+1/D+3/D+7.
- Publisher source-aligned content and PFAL-derived content must remain explicitly distinct.

## 3. Current workbook scope
- Chapter 01~12 / Unit 01~48 implemented; `data/catalog.json` is canonical.
- PIN 2007 supports current Unit review and `Unit 01~48 한꺼번에 검수`.

## 4. Source validation — latest
- U41 `it ~ to-V[that]`: source-aligned from workbook p.110 and answer book p.80.
- U42 `짝을 이루는 접속사`: source-aligned from representative workbook p.112 sentences and answer book p.82 logic: either A or B, not A but B, not only A but also B, plus dummy/true subject analysis where required.
- U43 `짝을 이루는 대명사·부사`: source-aligned from workbook p.114 and answer book p.84.
- U44 `특정 전치사구를 동반하는 동사`: source-aligned from representative workbook p.116 sentences and answer book p.85 logic: look upon A as B, blame A for B, distinguish A from B.
- U45, U46, U47 remain PFAL-derived concept staging and must not be called source validated.
- U48 remains source-aligned.
- Next source-validation order: U45 → U46 → U47.

## 5. Full-workbook QA already implemented
- Static QA validates all Unit 01~48 JSON/catalog data, unique IDs, choice answers, selectable span/pairSpan answers and validationFlow integrity.
- Runtime span tokenization supports compounds/suspensive hyphens, abbreviations, quotes, contractions and numeric suffixes.
- Selected Unit persists across reload.
- Student report no longer hardcodes Unit 01 and selected-Unit tomorrow-review count is separated.
- PWA cache: `chunilmun-pfal-t1-v093o`.

## 6. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- actual active time is primary metric; visible + recent interaction only
- Firestore rules reported published; PIN 2007 diagnostic PASS screenshot still pending

## 7. Next priority
1. Continue publisher source-validation/freeze with U45, then U46, U47.
2. PIN 2007 `Unit 01~48 한꺼번에 검수` full content/layout sweep and batch fixes.
3. Cloud diagnostic all PASS + PC/mobile/tablet round-trip progress/active-time QA.
4. Student-mode multi-unit regression, especially Unit switching + due-review separation + persisted selection.
5. Only after those gates decide whether to expand beyond this workbook.

## 8. Auto-continue rule
If user says `진행`, `다음 작업 진행`, `다음 단계 진행`, or equivalent:
1. read latest main/handoff/status/VERSION/Actions
2. execute the first incomplete priority without asking
3. safe changes direct to main
4. verify Static QA + Pages
5. report concise result and necessary live-check points
