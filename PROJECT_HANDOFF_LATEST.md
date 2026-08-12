# 천일문 PFAL — PROJECT HANDOFF LATEST

이 문서는 새 대화에서 즉시 이어가기 위한 기준본이다. 항상 GitHub `kfcccpro/1001`의 최신 `main`, 이 파일, `PROJECT_STATUS.md`, `VERSION`, 최신 Actions 상태를 먼저 확인한다.

## 1. 프로젝트
- Repo/branch: `kfcccpro/1001` / `main`
- Live: `https://kfcccpro.github.io/1001/`
- Core: static HTML/CSS/Vanilla JS + JSON + Firebase Anonymous Auth + Firestore
- Core version: `0.9.3`; content expansion layer: `0.9.3-batch3`
- Student 1명 PIN `8081`; Admin/Supervisor 1명 PIN `2007`
- PIN은 보안 인증이 아니라 화면 분기용이다.

## 2. 학습/UX 불변 원칙
- 학생 실제 모드만 학습 진도·복습·세션·active time을 저장한다.
- 감독형은 저장 없이 Previous/Next/jump 및 선택적 정답·해설 확인이 가능해야 한다.
- 학생 UI: `One Screen · One Task · One Decision`.
- 큰 영문, 충분히 큰 한글 안내/해설, 세로 스크롤 최소화. 데스크톱 제출 후 피드백은 문제 옆 우측 패널을 기본으로 한다.
- ADHD 친화: 큰 카운트다운, 과도한 실패 강조, 복잡한 다단계 UX 금지.
- 학습 루프: Cold Attempt → 구조 판단 → 최소 Guided Repair → 재도전 → 전이 → D+1/D+3/D+7.
- 첫 오답에서 답을 즉시 공개하지 않고 한 단계 사고 힌트 + 문법 개념 1줄을 먼저 준다.
- 출판사 원문/source-aligned 데이터와 PFAL 파생 콘텐츠를 구분하며, 공개 repo에 교재 전체를 무분별하게 복제하지 않는다.

## 3. 현재 콘텐츠 범위
`data/catalog.json`이 단원 범위의 기준이다.

- Chapter 01 `주어·동사 찾기` — Unit 01~04
- Chapter 02 `수식어구 뒤의 동사 찾기` — Unit 05~08
- Chapter 03 `명사 뒤 수식어구로 인한 문제들` — Unit 09~12
- Chapter 04 `문장 구조 파악을 어렵게 하는 것들` — Unit 13~16
- Chapter 05 `생략이 일어난 문장 구조 이해하기` — Unit 17~20
- Chapter 06 `어순에 주의해야 하는 구문` — Unit 21~24

상태:
- Unit 01: source-aligned validated baseline.
- Unit 02~06: source-aligned/source-derived staged QA.
- Unit 07: PFAL-derived staged QA.
- Unit 08: source/PFAL mixed staged QA.
- Unit 09~16: source-aligned batch QA.
- Unit 17~19: 교재의 단원 개념/페이지는 확인했으나 문제는 PFAL 파생 staging.
- Unit 20: 업로드된 문제집·해설의 가정법 도치 예문/정답에 맞춘 source-aligned batch QA.
- Unit 21~24: 교재의 단원 개념/페이지는 확인했으나 문제는 PFAL 파생 staging.

Chapter 05 source sequence:
- U17 생략·공동구문
- U18 생략구문
- U19 접속사·관계사의 생략
- U20 if 또는 if절이 생략된 가정법

Chapter 06 source sequence:
- U21 어순 변화
- U22 문장 앞으로 이동
- U23 문장 뒤로 이동
- U24 이미 아는 정보+새로운 정보

## 4. 감독형 일괄 검수
PIN `2007`에서:
- 현재 Unit만 감독형 검수 가능
- `Unit 01~24 한꺼번에 검수` 가능
- 일괄 범위 문구는 catalog에서 동적으로 계산한다.
- 문제를 풀지 않고 이전/다음/점프, 정답·해설 열기/닫기 가능
- 감독형에서 진도·시간·복습 스케줄을 절대 저장하지 않는다.

사용자의 현재 개발 방식: 여러 단원/Chapter를 먼저 빠르게 구현한 뒤 감독형에서 한꺼번에 검수한다.

## 5. 주요 파일
- Core/UI: `index.html`, `app.js`, `styles.css`, `learning.css`, `compact-v093.css`
- Supervisor: `supervisor-v082.js/css`
- Guided Repair: `repair-guides-v092.js`, `guided-repair-v092.js/css`
- Multi-unit: `multiunit-v093b.js/css`
- Catalog: `data/catalog.json`
- Units: `data/unit01.json` ... `data/unit24.json`
- Cloud: `cloud-v09.js/css`, `cloud-diagnostic-v091.js/css`
- PWA: `sw.js`, `manifest.webmanifest`
- QA: `.github/workflows/qa.yml`
- State: `VERSION`, `PROJECT_STATUS.md`, this handoff

## 6. Cloud/active time
- Firebase project `moonma-f6dbe`
- Collections `chunilmun1001`, `chunilmun1001_sessions`
- Anonymous Auth in background
- actual active time is primary admin metric
- visible + recent interaction only counts; idle/background excluded
- target cross-device continuity: PC / mobile / Android tablet / iPad
- Firestore rules were reported as manually published on 2026-08-12, but PIN 2007 cloud diagnostic PASS screenshot is still pending.

## 7. Current QA state and next priority
Batch3 adds Chapter 05~06 / Unit 17~24, dynamic Unit 01~24 supervisor range, stronger 24-unit JSON/flow QA, and SW cache `v093d`.

Important content distinction:
- Unit20 is source-aligned from the uploaded problem/solution book.
- Unit17~19 and Unit21~24 are deliberately PFAL-derived concept staging until exact source transcription is checked. Do not call them source-validated.

After batch3 deployment succeeds, unfinished priorities are:
1. PIN 2007 `Unit 01~24 한꺼번에 검수` live content/layout check.
2. Fix any sentence/prompt/answer/range errors; source-check PFAL staged units before final freeze.
3. Cloud diagnostic all PASS + cross-device/active-time QA.
4. Then expand Chapter 07~08 / Unit 25~32 as the next batch.

## 8. 자동 진행 규칙
사용자가 `천일문 다음 작업 진행`, `다음 단계 진행`, `진행`처럼 이어서 하라고 하면 질문하지 말고:
1. latest `main`/handoff/status/VERSION/Actions 확인
2. 첫 미완료 우선순위 수행
3. 안전한 변경은 main 직접 commit
4. Static QA + Pages 배포 확인
5. 결과와 사용자가 실제 기기에서 볼 검수 포인트만 간결히 보고

사용자는 복잡한 GitHub 조작을 하지 않고 실제 사이트 테스트와 짧은 피드백에 집중한다.
