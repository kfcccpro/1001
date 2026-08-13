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
- U41~U44: publisher workbook/answer-book representative sentences and answer logic are source-aligned.
- U45: representative Unit45 Q03~Q05 structures verified: delayed participial modifier, delayed why-clause, and delayed relative clauses.
- U46: workbook p.123 Q05~Q07 verified: `not so much A as B`, `No A is so ... as B`, and `There is no comparative ... than ...` superlative meaning.
- U47: answer-book Unit47 Q01 verified: plural `create`, nested relative clause, and `It is ~ who` cleft emphasis. The webapp uses only this verified representative source sentence for U47; it does not claim full publisher exercise replication.
- U48 remains source-aligned.
- Therefore Chapter12 U45~U48 is source-aligned at representative QA-set level, but still awaits the live content/layout freeze.

## 5. Full-workbook QA already implemented
- Static QA validates all Unit 01~48 JSON/catalog data, unique IDs, choice answers, selectable span/pairSpan answers and validationFlow integrity.
- Runtime span tokenization supports compounds/suspensive hyphens, abbreviations, quotes, contractions and numeric suffixes.
- Selected Unit persists across reload.
- Student report no longer hardcodes Unit 01 and selected-Unit tomorrow-review count is separated.
- PWA cache: `chunilmun-pfal-t1-v093p`.

## 6. Cloud
- Firebase project `moonma-f6dbe`
- collections `chunilmun1001`, `chunilmun1001_sessions`
- actual active time is primary metric; visible + recent interaction only
- Firestore rules reported published; PIN 2007 diagnostic PASS screenshot still pending

## 7. Next priority
1. PIN 2007 `Unit 01~48 한꺼번에 검수` full content/layout sweep and batch fixes.
2. Revisit earlier PFAL-staged Units 07, 17~19, 21~25, 27, 31~32 for source validation where useful.
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
